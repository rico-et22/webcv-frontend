import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import logoUrl from "@/assets/logo.svg"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: "/" })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 sm:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoUrl}
            alt="webCV"
            className="h-6 w-auto"
            width={154}
            height={38}
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">{t("nav.dashboard")}</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
              <Button
                size="sm"
                className="bg-brand-gradient border-0 text-white transition-opacity hover:opacity-90"
                asChild
              >
                <Link to="/register">{t("nav.register")}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
