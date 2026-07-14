'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    // Small delay to ensure all client components have hydrated and rendered
    const timeoutId = setTimeout(() => {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
      );

      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => intersectionObserver!.observe(el));

      // Watch for new .reveal elements added to the DOM dynamically
      mutationObserver = new MutationObserver(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
          intersectionObserver?.observe(el);
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  return null;
}
