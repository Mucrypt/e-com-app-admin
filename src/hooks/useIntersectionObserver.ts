// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react'

/**
 * A custom React hook that uses the Intersection Observer API to detect when an element
 * enters or exits the viewport.
 * 
 * @param options - Configuration options for the IntersectionObserver. Defaults to an empty object.
 *                  Can include properties like `root`, `rootMargin`, `threshold`, etc.
 * 
 * @returns A tuple containing:
 *   - `ref`: A React ref object to be attached to the DOM element you want to observe
 *   - `isIntersecting`: A boolean indicating whether the observed element is currently intersecting with the root
 * 
 * @example
 * ```tsx
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible ? 'Element is visible!' : 'Element is not visible'}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return [ref, isIntersecting] as const
}
