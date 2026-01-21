'use client';

// Import components to trigger registration
import '@object-ui/components';

export function ObjectUIProvider({ children }: { children: React.ReactNode }) {
  // Components are auto-registered on import
  return <>{children}</>;
}
