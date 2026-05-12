import { createRootRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Hide footer on site editor views (full-screen layout)
  const isSiteEditor = location.pathname.startsWith("/sites/")

  useEffect(() => {
    const handleLogout = () => {
      toast.error(t("auth.session.expired"))
      navigate({ to: "/login" })
    }

    window.addEventListener("auth:logout", handleLogout)
    return () => window.removeEventListener("auth:logout", handleLogout)
  }, [navigate, t])

  return (
    <AuthProvider>
      <div
        className={cn(
          "flex flex-col",
          isSiteEditor ? "h-[100dvh] overflow-hidden" : "min-h-[100svh]"
        )}
      >
        {!isSiteEditor && <Header />}
        <main className="flex flex-1 flex-col min-h-0">
          <Outlet />
        </main>
        {!isSiteEditor && <Footer />}
      </div>
      <Toaster position="top-center" richColors />
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools buttonPosition="bottom-right" />
        </>
      )}
    </AuthProvider>
  )
}
