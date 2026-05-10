import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
      <div className="flex min-h-[100svh] flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <Footer />
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
