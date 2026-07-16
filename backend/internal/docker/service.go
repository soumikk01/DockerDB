package docker

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/Microsoft/go-winio"
)

// Service talks to the Docker Engine REST API directly over the Windows named pipe.
// This avoids github.com/docker/docker which is broken on Go 1.26.
type Service struct {
	client  *http.Client
	baseURL string
}

const dockerPipe = `\\.\pipe\docker_engine`

// New creates a Service connecting to Docker Desktop on Windows via named pipe.
func New() (*Service, error) {
	transport := &http.Transport{
		DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
			return winio.DialPipeContext(ctx, dockerPipe)
		},
	}
	c := &http.Client{Transport: transport, Timeout: 30 * time.Second}
	svc := &Service{client: c, baseURL: "http://localhost"}

	// Ping Docker to verify it's reachable
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	rc, err := svc.do(ctx, http.MethodGet, "/v1.41/_ping", nil)
	if err != nil {
		return nil, fmt.Errorf("docker ping failed (is Docker Desktop running?): %w", err)
	}
	rc.Close()
	log.Println("[docker] Connected to Docker Desktop via named pipe")
	return svc, nil
}

// ContainerConfig holds everything needed to provision a database container.
type ContainerConfig struct {
	ContainerName string
	Image         string
	Env           []string
	HostPort      int
	ContainerPort string // just the port number e.g. "5432"
}

// CreateAndStart pulls the image then creates and starts the container.
// Returns the container ID.
func (s *Service) CreateAndStart(ctx context.Context, cfg ContainerConfig) (string, error) {
	// Split "postgres:16" → fromImage=postgres&tag=16
	imageName, imageTag, _ := strings.Cut(cfg.Image, ":")
	if imageTag == "" {
		imageTag = "latest"
	}
	pullURL := fmt.Sprintf("/v1.41/images/create?fromImage=%s&tag=%s", imageName, imageTag)

	log.Printf("[docker] Pulling %s:%s ...", imageName, imageTag)
	pullCtx, cancel := context.WithTimeout(ctx, 10*time.Minute)
	defer cancel()

	rc, err := s.do(pullCtx, http.MethodPost, pullURL, nil)
	if err != nil {
		return "", fmt.Errorf("image pull %s:%s: %w", imageName, imageTag, err)
	}
	// Drain pull stream (required to complete the pull)
	pullOut, _ := io.ReadAll(rc)
	rc.Close()
	log.Printf("[docker] Pull complete for %s:%s — %d bytes", imageName, imageTag, len(pullOut))

	portProto := cfg.ContainerPort + "/tcp"
	body := map[string]any{
		"Image": cfg.Image,
		"Env":   cfg.Env,
		"ExposedPorts": map[string]any{
			portProto: map[string]any{},
		},
		"HostConfig": map[string]any{
			"PortBindings": map[string]any{

				portProto: []map[string]string{
					{"HostIp": "127.0.0.1", "HostPort": fmt.Sprintf("%d", cfg.HostPort)},
				},
			},
			"RestartPolicy": map[string]string{"Name": "unless-stopped"},
		},
	}

	result, err := s.postJSON(ctx,
		fmt.Sprintf("/v1.41/containers/create?name=%s", cfg.ContainerName), body)
	if err != nil {
		return "", fmt.Errorf("create container: %w", err)
	}

	id, _ := result["Id"].(string)
	if id == "" {
		return "", fmt.Errorf("docker did not return a container ID")
	}

	rc, err = s.do(ctx, http.MethodPost,
		fmt.Sprintf("/v1.41/containers/%s/start", id), nil)
	if err != nil {
		return "", fmt.Errorf("start container: %w", err)
	}
	if rc != nil {
		rc.Close()
	}
	log.Printf("[docker] Container %s started (id=%s)", cfg.ContainerName, id[:12])
	return id, nil
}

// Stop gracefully stops a container (10 s timeout).
func (s *Service) Stop(ctx context.Context, containerID string) error {
	rc, err := s.do(ctx, http.MethodPost,
		fmt.Sprintf("/v1.41/containers/%s/stop?t=10", containerID), nil)
	if rc != nil {
		rc.Close()
	}
	return err
}

// Start starts a stopped container.
func (s *Service) Start(ctx context.Context, containerID string) error {
	rc, err := s.do(ctx, http.MethodPost,
		fmt.Sprintf("/v1.41/containers/%s/start", containerID), nil)
	if rc != nil {
		rc.Close()
	}
	return err
}

// Remove force-removes a container.
func (s *Service) Remove(ctx context.Context, containerID string) error {
	_ = s.Stop(ctx, containerID)
	rc, err := s.do(ctx, http.MethodDelete,
		fmt.Sprintf("/v1.41/containers/%s?force=true", containerID), nil)
	if rc != nil {
		rc.Close()
	}
	return err
}

// Status returns the live container state string (e.g. "running", "exited").
func (s *Service) Status(ctx context.Context, containerID string) string {
	rc, err := s.do(ctx, http.MethodGet,
		fmt.Sprintf("/v1.41/containers/%s/json", containerID), nil)
	if err != nil {
		return "unknown"
	}
	defer rc.Close()
	var info struct {
		State struct{ Status string } `json:"State"`
	}
	if err := json.NewDecoder(rc).Decode(&info); err != nil {
		return "unknown"
	}
	return info.State.Status
}

// Logs returns a streaming ReadCloser of container stdout+stderr.
func (s *Service) Logs(ctx context.Context, containerID string) (io.ReadCloser, error) {
	return s.do(ctx, http.MethodGet, fmt.Sprintf(
		"/v1.41/containers/%s/logs?stdout=1&stderr=1&follow=1&timestamps=1&tail=50",
		containerID), nil)
}

// FindFreePort scans for an open TCP port starting from start.
func FindFreePort(start int) int {
	for p := start; p < start+1000; p++ {
		ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", p))
		if err == nil {
			ln.Close()
			return p
		}
	}
	return start
}

// ─── internal helpers ─────────────────────────────────────────────────────────

func (s *Service) postJSON(ctx context.Context, path string, body any) (map[string]any, error) {
	b, _ := json.Marshal(body)
	rc, err := s.do(ctx, http.MethodPost, path, bytes.NewReader(b))
	if err != nil {
		return nil, err
	}
	defer rc.Close()
	var result map[string]any
	json.NewDecoder(rc).Decode(&result)
	return result, nil
}

func (s *Service) do(ctx context.Context, method, path string, body io.Reader) (io.ReadCloser, error) {
	req, err := http.NewRequestWithContext(ctx, method, s.baseURL+path, body)
	if err != nil {
		return nil, err
	}
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= 400 {
		defer resp.Body.Close()
		msg, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("docker API %s %s → %d: %s",
			method, path, resp.StatusCode, strings.TrimSpace(string(msg)))
	}
	return resp.Body, nil
}
