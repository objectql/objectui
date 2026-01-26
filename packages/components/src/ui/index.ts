/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export * from './accordion';
export * from './alert-dialog';
export * from './alert';
export * from './aspect-ratio';
export * from './avatar';
export * from './badge';
export * from './breadcrumb';
export * from './button-group';
export * from './button';
export * from './calendar';
export * from './card';
export * from './carousel';
export * from './checkbox';
export * from './collapsible';
export * from './combobox';
export * from './command';
export * from './context-menu';
export * from './date-picker';
export * from './dialog';
export * from './drawer';
export * from './dropdown-menu';
export * from './empty';
/** @deprecated Use form.tsx components (FormField, FormItem, FormLabel, FormControl, FormMessage) instead */
export * from './field';
export * from './filter-builder';
export * from './form';
export * from './hover-card';
/** @deprecated Use standard Tailwind flex utilities with Shadcn primitives instead */
export * from './input-group';
export * from './input-otp';
export * from './input';
export * from './item';
export * from './kbd';
export * from './label';
export * from './menubar';
export * from './navigation-menu';
export * from './pagination';
export * from './popover';
export * from './progress';
export * from './radio-group';
export * from './resizable';
export * from './scroll-area';
export * from './select';
export * from './separator';
export * from './sheet';
export * from './sidebar';
export * from './skeleton';
export * from './slider';
/** 
 * Sonner is the recommended toast solution for ObjectUI.
 * When you import { Toaster } from '@object-ui/components', you get the Sonner Toaster (recommended).
 * The legacy toast system is still available but deprecated.
 * @see https://ui.shadcn.com/docs/components/sonner
 */
export { Toaster } from './sonner';
export * from './spinner';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './textarea';
/** @deprecated Use Sonner (sonner.tsx) for toast notifications instead */
export * from './toast';
/** 
 * @deprecated Use the Sonner-based Toaster instead. 
 * Import { Toaster } from '@object-ui/components' to get the recommended Sonner Toaster.
 * This ToastNotifier export is the legacy Radix-based toaster.
 */
export { Toaster as ToastNotifier } from './toaster';
export * from './toggle-group';
export * from './toggle';
export * from './tooltip';
