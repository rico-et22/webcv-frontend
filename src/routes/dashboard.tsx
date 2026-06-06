import {
  createFileRoute,
  redirect,
  Outlet,
  Link,
  useLocation,
} from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Globe, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

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
  component: DashboardLayout,
})

function DashboardLayout() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 sm:px-10 md:flex-row">
      {/* Sidebar */}
      <aside className="w-full shrink-0 border-b border-border/60 pb-8 md:w-[300px] md:border-r md:border-b-0 md:pr-8 md:pb-0">
        <nav className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
              location.pathname === "/dashboard"
                ? "bg-brand-gradient border-0 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            activeOptions={{ exact: true }}
          >
            <Globe className="h-5 w-5" />
            {t("dashboard.menu.sites")}
          </Link>
          <Link
            to="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
              location.pathname === "/dashboard/settings"
                ? "bg-brand-gradient border-0 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            activeOptions={{ exact: true }}
          >
            <Settings className="h-5 w-5" />
            {t("dashboard.menu.settings")}
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
