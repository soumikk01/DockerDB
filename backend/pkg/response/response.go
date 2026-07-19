package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// OK sends a 200 JSON response with data.
func OK(c *gin.Context, data any) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": data})
}

// Created sends a 201 JSON response with data.
func Created(c *gin.Context, data any) {
	c.JSON(http.StatusCreated, gin.H{"success": true, "data": data})
}

// Error sends an error JSON response with the given HTTP status.
func Error(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"success": false, "error": message})
}

// BadRequest sends a 400 error.
func BadRequest(c *gin.Context, message string) {
	Error(c, http.StatusBadRequest, message)
}

// NotFound sends a 404 error.
func NotFound(c *gin.Context, message string) {
	Error(c, http.StatusNotFound, message)
}

// InternalError sends a 500 error.
func InternalError(c *gin.Context, message string) {
	Error(c, http.StatusInternalServerError, message)
}
