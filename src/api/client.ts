import { Api } from "./index"

export const apiClient = new Api({
  baseUrl: `${import.meta.env.VITE_API_URL}/api`,
  securityWorker: (token: string | null) => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  },
})

// Export the Api class itself if types/methods are needed, but usually we use apiClient
export * from "./index"
