import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  version: string
  environment: string
  services: {
    database: ServiceStatus
    ai: ServiceStatus
    storage: ServiceStatus
    cache: ServiceStatus
  }
  metrics?: {
    memory_usage_mb: number
    response_time_ms: number
  }
  trace_id?: string
}

interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'degraded' | 'disabled'
  configured: boolean
  details?: string
  last_check?: string
}

// Secure secret reading function
function readSecret(envVar: string, filePath?: string): string | null {
  try {
    if (filePath && process.env[filePath]) {
      return readFileSync(process.env[filePath], 'utf8').trim()
    }
    return process.env[envVar] || null
  } catch {
    return process.env[envVar] || null
  }
}

// Check AI service availability
async function checkAIService(): Promise<ServiceStatus> {
  try {
    const apiKey = readSecret('OPENAI_API_KEY', 'OPENAI_API_KEY_FILE')

    if (!apiKey) {
      return {
        status: 'disabled',
        configured: false,
        details: 'API key not configured',
      }
    }

    // Basic connectivity check (without making actual API call)
    return {
      status: 'healthy',
      configured: true,
      details: 'API key configured',
      last_check: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      configured: false,
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Check database connectivity
async function checkDatabase(): Promise<ServiceStatus> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        status: 'unhealthy',
        configured: false,
        details: 'Supabase credentials not configured',
      }
    }

    // Basic configuration check
    return {
      status: 'healthy',
      configured: true,
      details: 'Supabase configured',
      last_check: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      configured: false,
      details: error instanceof Error ? error.message : 'Database check failed',
    }
  }
}

// Check storage service
async function checkStorage(): Promise<ServiceStatus> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = readSecret('CLOUDINARY_API_KEY', 'CLOUDINARY_API_KEY_FILE')

    if (!cloudName || !apiKey) {
      return {
        status: 'disabled',
        configured: false,
        details: 'Cloudinary not configured',
      }
    }

    return {
      status: 'healthy',
      configured: true,
      details: 'Cloudinary configured',
      last_check: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      configured: false,
      details: error instanceof Error ? error.message : 'Storage check failed',
    }
  }
}

// Check cache service (placeholder for Redis)
async function checkCache(): Promise<ServiceStatus> {
  return {
    status: 'healthy',
    configured: true,
    details: 'Cache service ready',
    last_check: new Date().toISOString(),
  }
}

// Main health check endpoint
export async function GET(): Promise<NextResponse> {
  const startTime = Date.now()
  const traceId = `health-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`

  try {
    // Run all health checks in parallel
    const [database, ai, storage, cache] = await Promise.all([
      checkDatabase(),
      checkAIService(),
      checkStorage(),
      checkCache(),
    ])

    // Calculate overall status
    const services = { database, ai, storage, cache }
    const serviceStatuses = Object.values(services).map((s) => s.status)

    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'

    if (serviceStatuses.includes('unhealthy')) {
      overallStatus = 'unhealthy'
    } else if (serviceStatuses.includes('degraded')) {
      overallStatus = 'degraded'
    }

    // Calculate metrics
    const responseTime = Date.now() - startTime
    const memoryUsage = process.memoryUsage()

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      metrics: {
        memory_usage_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        response_time_ms: responseTime,
      },
      trace_id: traceId,
    }

    // Return appropriate HTTP status
    const httpStatus =
      overallStatus === 'healthy'
        ? 200
        : overallStatus === 'degraded'
        ? 200
        : 503

    return NextResponse.json(healthCheck, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Trace-ID': traceId,
      },
    })
  } catch (error) {
    console.error(`[${traceId}] Health check failed:`, error)

    const errorResponse: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: 'unhealthy',
          configured: false,
          details: 'Health check failed',
        },
        ai: {
          status: 'unhealthy',
          configured: false,
          details: 'Health check failed',
        },
        storage: {
          status: 'unhealthy',
          configured: false,
          details: 'Health check failed',
        },
        cache: {
          status: 'unhealthy',
          configured: false,
          details: 'Health check failed',
        },
      },
      trace_id: traceId,
    }

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'X-Trace-ID': traceId,
      },
    })
  }
}

// HEAD endpoint for simple up/down check
export async function HEAD(): Promise<Response> {
  try {
    // Quick basic checks
    const hasSupabase = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    if (!hasSupabase) {
      return new Response(null, { status: 503 })
    }

    return new Response(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    return new Response(null, { status: 503 })
  }
}
