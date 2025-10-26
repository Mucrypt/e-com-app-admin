// src/lib/lazy-imports.ts
import { lazy } from 'react'

// Lazy load heavy components
/**
 * Lazily loads the SuperAdminDashboard React component.
 *
 * This constant is a React.LazyExoticComponent created via dynamic import of
 * the module at '@/app/superadmin/dashboard/page' and exposes that module's
 * default export as the lazy-loaded component.
 *
 * Usage:
 * - Render this component inside a React.Suspense boundary to provide a fallback
 *   while the module is being fetched.
 * - Wrap usage in an ErrorBoundary to handle load-time errors.
 *
 * Example:
 * ```
 * <Suspense fallback={<Loading />}>
 *   <SuperAdminDashboard />
 * </Suspense>
 * ```
 *
 * Remarks:
 * - The imported module must have a default export that is a valid React component.
 * - React.lazy is client-side only and does not perform server-side rendering.
 * - Ensure the project path alias '@' is configured so the import resolves correctly.
 *
 * @constant
 * @public
 */
export const SuperAdminDashboard = lazy(() =>
  import('@/app/superadmin/dashboard/page').then((module) => ({
    default: module.default,
  }))
)

export const OrdersDashboard = lazy(
  () =>
    import('@/app/superadmin/administration/OrdersDashboard/OrdersDashboard')
)

export const RichTextEditor = lazy(
  () => import('@/components/rich-text-editor')
)
