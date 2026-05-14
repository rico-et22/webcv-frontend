import { createFileRoute, Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import type { CreateSiteDto } from "@/api/index"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { ArrowLeft, Save, Upload, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteForm } from "@/components/sites/SiteForm"
import { SitePreview } from "@/components/sites/SitePreview"
import { PublishModal } from "@/components/sites/PublishModal"
import { useUnsavedChangesGuard } from "@/lib/use-unsaved-changes-guard"

export const Route = createFileRoute("/sites/$siteId/edit")({
  component: EditSitePage,
})

function EditSitePage() {
  const { t } = useTranslation()
  const { siteId } = Route.useParams()
  const queryClient = useQueryClient()
  const [previewKey, setPreviewKey] = useState(0)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const methods = useForm<CreateSiteDto>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      jobTitle: "",
      location: "",
      bio: "",
      avatarUrl: "",
      avatarStoragePath: "",
      contacts: {},
      skills: [],
      experience: [],
      education: [],
      projects: [],
      achievements: [],
    },
  })

  const {
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { isSubmitting, isValid },
  } = methods

  // Fetch existing site data
  const { data: siteData, isLoading } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () =>
      apiClient.sites.sitesControllerFindOne(siteId).then((r) => r.data.data),
  })

  // Populate form when data arrives
  useEffect(() => {
    if (!siteData) return
    reset({
      fullName: siteData.fullName ?? "",
      jobTitle: siteData.jobTitle ?? "",
      location: siteData.location ?? "",
      bio: siteData.bio ?? "",
      avatarUrl: siteData.avatarUrl ?? undefined,
      avatarStoragePath: siteData.avatarStoragePath ?? undefined,
      contacts: siteData.contacts ?? {},
      skills: siteData.skills ?? [],
      experience: siteData.experience ?? [],
      education: siteData.education ?? [],
      projects: siteData.projects ?? [],
      achievements: siteData.achievements ?? [],
    })
  }, [siteData, reset])

  const saveMutation = useMutation({
    mutationFn: (data: CreateSiteDto) =>
      apiClient.sites.sitesControllerUpdate(siteId, data),
    onSuccess: () => {
      toast.success(t("sites.saved"))
      queryClient.invalidateQueries({ queryKey: ["site", siteId] })
      queryClient.invalidateQueries({ queryKey: ["sites"] })
      // Refresh preview after save
      setPreviewKey((k) => k + 1)
    },
    onError: () => {
      toast.error(t("sites.saveError"))
    },
  })

  const onSubmit = (data: CreateSiteDto) => {
    // Send empty strings for image fields if they are missing to clear them on the backend
    const payload = {
      ...data,
      avatarUrl: data.avatarUrl || "",
      avatarStoragePath: data.avatarStoragePath || "",
      projects: data.projects?.map((p) => ({
        ...p,
        imageStoragePath: p.imageStoragePath || "",
      })),
    }
    saveMutation.mutate(payload)
  }

  const handleAiApply = async (partial: Partial<CreateSiteDto>) => {
    for (const [key, value] of Object.entries(partial)) {
      setValue(key as keyof CreateSiteDto, value as never, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
    // Wait for the next tick so dynamically added array fields mount and register validation rules.
    setTimeout(() => {
      trigger()
    }, 100)
    toast.success(t("sites.saved"))
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/generator/zip/${siteId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-${siteId}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t("sites.saveError"))
    } finally {
      setIsDownloading(false)
    }
  }

  const fullName = useWatch({ control: methods.control, name: "fullName" })
  const siteName = fullName || t("sites.untitled")

  const isBusy = isSubmitting || saveMutation.isPending

  // Guard unsaved changes — reset to clean after successful PUT
  useUnsavedChangesGuard(methods.formState.isDirty)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top bar */}
      <div className="flex shrink-0 flex-col gap-2 border-b border-border/60 bg-white px-4 py-3 sm:px-6">
        <div className="flex shrink-0 items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            id="back-to-sites-link-edit"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("sites.backToSites")}</span>
          </Link>

          <span className="truncate text-sm font-semibold text-gray-800">
            {siteName}
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile: preview button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 lg:hidden"
              onClick={() => setMobilePreviewOpen(true)}
              id="mobile-preview-btn"
            >
              <Eye className="h-4 w-4" />
              {t("sites.preview")}
            </Button>

            {/* Export/Publish */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden gap-1.5 sm:flex"
              onClick={() => setPublishOpen(true)}
              id="publish-btn"
            >
              <Upload className="h-4 w-4" />
              {t("sites.publish")}
            </Button>

            {/* Validation Warning */}
            {!isValid && (
              <span className="hidden text-xs font-medium text-destructive sm:inline">
                {t("sites.form.checkForm")}
              </span>
            )}

            {/* Save */}
            <Button
              form="site-form-edit"
              type="submit"
              disabled={isBusy || !isValid}
              className="bg-brand-gradient gap-2 border-0 text-white hover:opacity-90"
              id="edit-site-submit-btn"
            >
              {isBusy ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="hidden sm:inline">{t("sites.saving")}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("sites.save")}</span>
                </>
              )}
            </Button>
          </div>
        </div>
        {!isValid && (
          <p className="text-right text-xs font-medium text-destructive sm:hidden">
            {t("sites.form.checkForm")}
          </p>
        )}
      </div>

      {/* Mobile publish button (below header on small screens) */}
      <div className="flex border-b border-border/60 px-4 py-2 sm:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5"
          onClick={() => setPublishOpen(true)}
          id="publish-btn-mobile"
        >
          <Upload className="h-4 w-4" />
          {t("sites.publish")}
        </Button>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Form panel */}
        <FormProvider {...methods}>
          <form
            id="site-form-edit"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full overflow-y-auto p-6 lg:w-[500px] lg:shrink-0 lg:border-r lg:border-border/60 xl:w-[600px] 2xl:w-[700px]"
          >
            <SiteForm onAiApply={handleAiApply} />
          </form>
        </FormProvider>

        {/* Single SitePreview — desktop inline + mobile modal, one fetch */}
        <SitePreview
          siteId={siteId}
          refreshKey={previewKey}
          mobileOpen={mobilePreviewOpen}
          onMobileClose={() => setMobilePreviewOpen(false)}
          className="flex-1 overflow-hidden"
        />
      </div>

      {/* Publish modal */}
      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  )
}
