import { createFileRoute, Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/$")({
  component: NotFoundPage,
})

function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
        404
      </p>
      <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{t("notFound.title")}</h1>
      <Button
        size="lg"
        className="bg-brand-gradient gap-2 rounded-full px-8 text-white shadow-md transition-opacity hover:opacity-90"
        asChild
      >
        <Link to="/">
          <Home className="size-4" />
          {t("notFound.cta")}
        </Link>
      </Button>
    </div>
  )
}
