import { createFileRoute, Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import leadImage from "@/assets/lead.png"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-start px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Hero section */}
      <section
        className="flex max-w-4xl flex-col items-center gap-6 text-center"
        style={{
          animation: "fade-in-up 0.6s ease-out both",
        }}
      >
        <h1 className="text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {t("landing.headline")}
          <br />
          <span className="text-gradient">
            {t("landing.headlineHighlight")}
          </span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
          {t("landing.subtitle")}
        </p>

        <Button
          size="lg"
          className="bg-brand-gradient mt-2 h-12 gap-2 rounded-full border-0 px-8 text-base text-white shadow-lg transition-opacity hover:opacity-90"
          asChild
        >
          <Link to="/">
            {t("landing.cta")}
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </section>

      {/* Lead image */}
      <div
        className="mt-16 w-full max-w-[1200px] sm:mt-20"
        style={{
          animation: "fade-in-up 0.7s 0.15s ease-out both",
        }}
      >
        <img
          src={leadImage}
          alt={t("landing.leadImageAlt")}
          className="w-full rounded-2xl shadow-2xl ring-1 shadow-black/10 ring-border"
          width={1400}
          height={700}
        />
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
