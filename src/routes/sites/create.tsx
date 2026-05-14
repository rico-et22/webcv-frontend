import { useEffect } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useForm, FormProvider } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import type { CreateSiteDto } from "@/api/index"
import { toast } from "sonner"
import { ArrowLeft, Save, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteForm } from "@/components/sites/SiteForm"
import { useUnsavedChangesGuard } from "@/lib/use-unsaved-changes-guard"

export const Route = createFileRoute("/sites/create")({
  component: CreateSitePage,
})

function CreateSitePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    setValue,
    trigger,
    formState: { isSubmitting, isValid },
  } = methods

  const createMutation = useMutation({
    mutationFn: (data: CreateSiteDto) =>
      apiClient.sites.sitesControllerCreate(data).then((r) => r.data),
    onSuccess: (res) => {
      const siteId = res.data?.id
      if (siteId) {
        queryClient.invalidateQueries({ queryKey: ["sites"] })
        methods.reset() // clear isDirty before navigation to prevent confirm dialog
      }
    },
    onError: () => {
      toast.error(t("sites.createError"))
    },
  })

  // Navigate after render so the guard is definitively disabled
  useEffect(() => {
    if (createMutation.isSuccess && createMutation.data?.data?.id) {
      navigate({
        to: "/sites/$siteId/edit",
        params: { siteId: createMutation.data.data.id },
      })
    }
  }, [createMutation.isSuccess, createMutation.data, navigate])

  const onSubmit = (data: CreateSiteDto) => {
    createMutation.mutate(data)
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

  const isBusy = isSubmitting || createMutation.isPending

  // Guard unsaved changes — form is dirty once any field is touched
  useUnsavedChangesGuard(methods.formState.isDirty && !createMutation.isSuccess)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top bar */}
      <div className="flex shrink-0 flex-col gap-2 border-b border-border/60 bg-white px-4 py-3 sm:px-6">
        <div className="flex shrink-0 items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            id="back-to-sites-link"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {t("sites.backToSites")}
          </Link>

          <span className="text-sm font-semibold text-gray-800">
            {t("sites.newSite")}
          </span>

          <div className="flex items-center gap-3">
            {!isValid && (
              <span className="hidden text-xs font-medium text-destructive sm:inline">
                {t("sites.form.checkForm")}
              </span>
            )}
            <Button
              form="site-form"
              type="submit"
              disabled={isBusy || !isValid}
              className="bg-brand-gradient gap-2 border-0 text-white hover:opacity-90"
              id="create-site-submit-btn"
            >
              {isBusy ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("sites.saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t("sites.save")}
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

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Form panel */}
        <FormProvider {...methods}>
          <form
            id="site-form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full overflow-y-auto p-6 lg:w-[500px] lg:shrink-0 lg:border-r lg:border-border/60 xl:w-[600px] 2xl:w-[700px]"
          >
            <SiteForm onAiApply={handleAiApply} />
          </form>
        </FormProvider>

        {/* Preview panel – desktop only, empty state on create */}
        <div className="hidden flex-1 items-center justify-center overflow-y-auto bg-slate-50 lg:flex">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <Monitor className="h-9 w-9 text-slate-300" />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("sites.previewPlaceholder")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
