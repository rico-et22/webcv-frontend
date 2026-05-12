import { createFileRoute, Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import type { SiteSummaryResponseDto } from "@/api/index"
import { useState } from "react"
import { toast } from "sonner"
import {
  Globe,
  Plus,
  Pencil,
  Trash2,
  Upload,
  User,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardSites,
})


function SiteCard({
  site,
  onDelete,
  onPublish,
}: {
  site: SiteSummaryResponseDto
  onDelete: (id: string) => void
  onPublish: (id: string) => void
}) {
  const { t } = useTranslation()

  const createdDate = new Date(site.createdAt).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

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
          <h2 className="text-base font-semibold leading-tight text-gray-900">
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
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}

function DashboardSites() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sites"],
    queryFn: () =>
      apiClient.sites.sitesControllerFindAll().then((r) => r.data.data ?? []),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.sites.sitesControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] })
      toast.success(t("dashboard.sites.deleteSuccess"))
      setDeletingId(null)
    },
    onError: () => {
      toast.error(t("dashboard.sites.deleteError"))
      setDeletingId(null)
    },
  })

  const handlePublish = async (id: string) => {
    setPublishingId(id)
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/generator/zip/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-${id}.zip`
      a.click()
      URL.revokeObjectURL(url)
      // Show publish instructions modal (redirect to edit page with modal open)
      // For dashboard, we navigate to edit with a flag
    } catch {
      toast.error(t("sites.saveError"))
    } finally {
      setPublishingId(null)
    }
  }

  const sites = data ?? []

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease_both]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {t("dashboard.sites.title")}
            </h1>
          </div>
        </div>

        <Button
          asChild
          className="bg-brand-gradient border-0 text-white hover:opacity-90 gap-2"
          id="create-site-btn"
        >
          <Link to="/sites/create">
            <Plus className="h-4 w-4" />
            {t("dashboard.sites.create")}
          </Link>
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "h-64 animate-pulse rounded-2xl bg-gray-100",
                i === 3 && "hidden lg:block"
              )}
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 ring-1 ring-red-100">
          Nie udało się załadować stron. Spróbuj odświeżyć.
        </div>
      ) : sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
            <Globe className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {t("dashboard.sites.empty")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.sites.emptyDesc")}
            </p>
          </div>
          <Button
            asChild
            className="bg-brand-gradient border-0 text-white hover:opacity-90 gap-2"
            id="create-first-site-btn"
          >
            <Link to="/sites/create">
              <Plus className="h-4 w-4" />
              {t("dashboard.sites.create")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onDelete={setDeletingId}
              onPublish={handlePublish}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.sites.deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.sites.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("dashboard.sites.deleteConfirmCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              id="confirm-delete-site-btn"
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("dashboard.sites.deleteConfirmAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish loading indicator - invisible spinner while downloading */}
      {publishingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl ring-1 ring-black/10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium">
              {t("sites.saving")}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
