import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettings,
})

function DashboardSettings() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t("dashboard.menu.settings")}
        </h1>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <p className="text-gray-600">
          Treść ustawień w przygotowaniu.
        </p>
      </div>
    </div>
  )
}
