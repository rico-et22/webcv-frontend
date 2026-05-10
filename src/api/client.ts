import { Api } from "./index"

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: Response | PromiseLike<Response>) => void
  reject: (reason?: any) => void
  url: string | URL | Request
  options: RequestInit | undefined
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      const options = prom.options || {}
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
      prom.resolve(window.fetch(prom.url, options))
    }
  })
  failedQueue = []
}

const customFetch = async (
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> => {
  const token = localStorage.getItem("accessToken")

  // Inject the token dynamically
  const options = init || {}
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  let response = await window.fetch(input, options)

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({ resolve, reject, url: input, options })
      })
    }

    const refreshToken = localStorage.getItem("refreshToken")
    const hasAccessToken = !!localStorage.getItem("accessToken")

    // If they had no tokens to begin with, this is just a failed login or unauthenticated request.
    // Do not trigger the global "session expired" event.
    if (!hasAccessToken && !refreshToken) {
      return response
    }

    if (!refreshToken) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("auth:logout"))
      return response
    }

    isRefreshing = true

    try {
      const refreshResponse = await window.fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      )

      if (refreshResponse.ok) {
        const result = await refreshResponse.json()
        // Our backend returns { data: { access_token, refresh_token, user }, message }
        const newAccessToken = result.data.access_token
        const newRefreshToken = result.data.refresh_token
        const newUser = result.data.user

        localStorage.setItem("accessToken", newAccessToken)
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken)
        }
        if (newUser) {
          localStorage.setItem("user", JSON.stringify(newUser))
        }

        processQueue(null, newAccessToken)

        // Retry original request
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }
        response = await window.fetch(input, options)
      } else {
        throw new Error("Refresh failed")
      }
    } catch (err) {
      processQueue(err as Error, null)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("auth:logout"))
    } finally {
      isRefreshing = false
    }
  }

  return response
}

export const apiClient = new Api({
  baseUrl: `${import.meta.env.VITE_API_URL}`,
  customFetch,
  securityWorker: () => ({}), // Handled entirely in customFetch
})

export * from "./index"
