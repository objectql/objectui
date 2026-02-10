/**
 * useResponsiveSidebar
 *
 * Auto-collapses the sidebar on tablet-width viewports (768px–1023px).
 * Must be called inside a SidebarProvider context.
 * @module
 */

import { useEffect } from 'react';
import { useSidebar } from '@object-ui/components';

/** Tablet breakpoint range: 768px <= width < 1024px */
const TABLET_MIN = 768;
const TABLET_MAX = 1024;

export function useResponsiveSidebar() {
  const { setOpen, isMobile } = useSidebar();

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= TABLET_MIN && width < TABLET_MAX) {
        // Tablet: auto-collapse sidebar
        setOpen(false);
      }
    }

    // Run on mount to set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setOpen, isMobile]);
}
