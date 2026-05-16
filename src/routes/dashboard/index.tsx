import { createFileRoute, Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import { useState } from "react"
import { toast } from "sonner"
import { Globe, Plus } from "lucide-react"
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
import { PublishModal } from "@/components/sites/PublishModal"
import { SiteCard } from "@/components/sites/SiteCard"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardSites,
})

function DashboardSites() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [publishingSiteId, setPublishingSiteId] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sites"],
    queryFn: () =>
      apiClient.sites.sitesControllerFindAll().then((r) => r.data.data ?? []),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.sites.sitesControllerRemove(id),
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

  const sites = data ?? []

  return (
    <div className="animate-[fade-in-up_0.3s_ease_both] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-gradient flex h-10 w-10 items-center justify-center rounded-xl">
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
          className="bg-brand-gradient gap-2 border-0 text-white hover:opacity-90"
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
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 ring-1 ring-red-100">
          {t("dashboard.sites.error")}
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
            className="bg-brand-gradient gap-2 border-0 text-white hover:opacity-90"
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
              onPublish={() => setPublishingSiteId(site.id)}
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

      <PublishModal
        open={!!publishingSiteId}
        onClose={() => setPublishingSiteId(null)}
        siteId={publishingSiteId || ""}
      />
    </div>
  )
}
