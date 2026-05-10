import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken")
    if (!token) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: Dashboard,
})

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/client"

function Dashboard() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.users.usersControllerGetMe().then(r => r.data)
  })

  const handleLogout = () => {
    logout()
    navigate({ to: "/" })
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-12">
      <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t("nav.dashboard")}
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-full"
          >
            {t("nav.logout")}
          </Button>
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
    </div>
  )
}
