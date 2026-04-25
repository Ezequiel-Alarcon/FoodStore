/**
 * ============================================
 * API Service Genérico — FoodStore
 * ============================================
 * Funciones reutilizables para comunicación HTTP
 * con el backend usando fetch nativo.
 *
 * Patrón: cada función es genérica y tipada.
 * La lógica de "qué endpoint llamar" vive en /actions.
 */

const BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api')

/**
 * Error estructurado de API.
 * Parsea el body del backend para extraer el mensaje real.
 */
export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

/**
 * Helper para parsear errores del backend.
 * FastAPI devuelve { detail: "..." } en errores.
 */
async function handleErrorResponse(res: Response, fallback: string): Promise<never> {
  let detail = fallback
  try {
    const body = await res.json()
    if (typeof body.detail === 'string') {
      detail = body.detail
    } else if (Array.isArray(body.detail)) {
      detail = body.detail.map((d: { msg?: string }) => d.msg || JSON.stringify(d)).join(', ')
    }
  } catch {
    // Body no es JSON — usamos el fallback
  }
  throw new ApiError(res.status, detail)
}

/**
 * GET — Obtener datos del servidor
 */
export const get = async <T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> => {
  let url = `${BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    }
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const res = await fetch(url)
  if (!res.ok) await handleErrorResponse(res, `Error al obtener datos de ${endpoint}`)
  return res.json()
}

/**
 * POST — Crear un nuevo recurso
 */
export const post = async <TBody, TResponse>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await handleErrorResponse(res, `Error al crear en ${endpoint}`)
  return res.json()
}

/**
 * PUT — Reemplazar un recurso completo
 */
export const put = async <TBody, TResponse>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await handleErrorResponse(res, `Error al actualizar en ${endpoint}`)
  return res.json()
}

/**
 * PATCH — Actualización parcial de un recurso
 */
export const patch = async <TBody, TResponse>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await handleErrorResponse(res, `Error al actualizar en ${endpoint}`)
  return res.json()
}

/**
 * DELETE — Eliminar un recurso
 * No parsea JSON en éxito porque el backend devuelve 204 No Content
 */
export const remove = async (endpoint: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
  })
  if (!res.ok) await handleErrorResponse(res, `Error al eliminar en ${endpoint}`)
}
