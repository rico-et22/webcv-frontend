import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { CalendarDays, Pencil, Trash2, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SiteSummaryResponseDto } from "@/api/index"

interface SiteCardProps {
  site: SiteSummaryResponseDto
  onDelete: (id: string) => void
  onPublish: (id: string) => void
}

export function SiteCard({ site, onDelete, onPublish }: SiteCardProps) {
  const { t, i18n } = useTranslation()

  const createdDate = new Date(site.createdAt).toLocaleDateString(
    i18n.language,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  )

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      {/* Avatar area */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {site.avatarUrl ? (
          <img
            src={site.avatarUrl}
            alt={site.fullName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-black/10">
            <User className="h-10 w-10 text-slate-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="text-base leading-tight font-semibold text-gray-900">
            {site.fullName}
          </h2>
          {site.jobTitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {site.jobTitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>
            {t("dashboard.sites.createdAt")} {createdDate}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            id={`edit-site-${site.id}`}
          >
            <Link to="/sites/$siteId/edit" params={{ siteId: site.id }}>
              <Pencil className="h-3.5 w-3.5" />
              {t("dashboard.sites.edit")}
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            id={`publish-site-${site.id}`}
            onClick={() => onPublish(site.id)}
          >
            <Upload className="h-3.5 w-3.5" />
            {t("dashboard.sites.publish")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            id={`delete-site-${site.id}`}
            onClick={() => onDelete(site.id)}
            className="text-destructive hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            aria-label={t("sites.deleteConfirmTitle")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
