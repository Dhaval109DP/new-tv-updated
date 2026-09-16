'use client';

import { useEffect } from 'react';

/**
 * Hook for Android TV / D-pad navigation.
 * - Auto-focuses the first navigable element on mount
 * - Auto-scrolls focused elements into view on every focus change
 */
export function useTvFocus() {
  useEffect(() => {
    // Auto-focus the first focusable element after hydration
    const timer = setTimeout(() => {
      const firstFocusable = document.querySelector<HTMLElement>(
        '[data-tv-focusable], nav a, nav button, header a, header button'
      );
      if (firstFocusable) {
        firstFocusable.focus({ preventScroll: true });
      }
    }, 300);

    // Auto-scroll focused element into view
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Smooth scroll the element into view vertically
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });

      // Handle horizontal scroll within carousels
      const scrollParent = target.closest('.overflow-x-auto, [data-tv-carousel]');
      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const scrollLeft = scrollParent.scrollLeft;

        // If element is out of view horizontally, scroll it in
        if (targetRect.left < parentRect.left + 40) {
          scrollParent.scrollTo({
            left: scrollLeft - (parentRect.left - targetRect.left) - 80,
            behavior: 'smooth',
          });
        } else if (targetRect.right > parentRect.right - 40) {
          scrollParent.scrollTo({
            left: scrollLeft + (targetRect.right - parentRect.right) + 80,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);
}
