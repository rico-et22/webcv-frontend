import { createFileRoute } from "@tanstack/react-router"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/client"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
})

function DashboardIndex() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.users.usersControllerGetMe().then(r => r.data)
  })

  return (
    <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t("nav.dashboard")}
        </h1>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Witaj, {user?.email}
        </h2>
        <p className="mt-2 text-gray-600">
          To jest panel zarządzania Twoim portfolio. Treść w przygotowaniu.
        </p>
        <div className="mt-6 p-4 rounded bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Test API (/me):</h3>
          {isLoading ? (
            <p className="text-sm text-gray-500">Ładowanie profilu z API...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">Błąd autoryzacji (zobacz konsolę)</p>
          ) : (
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
