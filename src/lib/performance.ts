// src/lib/performance.ts
export class PerformanceMonitor {
  static measureRender(componentName: string) {
    performance.mark(`${componentName}-start`)

    return () => {
      performance.mark(`${componentName}-end`)
      performance.measure(
        componentName,
        `${componentName}-start`,
        `${componentName}-end`
      )
    }
  }

  static reportMetrics() {
    const entries = performance.getEntriesByType('measure')
    entries.forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`)
    })
  }
}
