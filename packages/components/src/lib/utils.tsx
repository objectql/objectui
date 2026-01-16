import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SchemaRenderer } from "@object-ui/react"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renderChildren(children: any): React.ReactNode {
  if (!children) return null;
  if (typeof children === 'string' || typeof children === 'number') {
    return children;
  }
  if (Array.isArray(children)) {
    if (children.length === 0) return null;
    // Unwrap single child to support Radix UI 'asChild' pattern which expects a single ReactElement, not an array
    if (children.length === 1) {
      return <SchemaRenderer schema={children[0]} />; 
    }
    return children.map((child, index) => (
      <SchemaRenderer key={child.id || index} schema={child} />
    ));
  }
  return <SchemaRenderer schema={children} />;
}

