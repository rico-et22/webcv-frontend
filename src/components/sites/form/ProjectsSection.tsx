import { useTranslation } from "react-i18next"
import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "./Field"
import { ImageUploader } from "./ImageUploader"
import type { SiteFormValues } from "./types"

function ProjectItem({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  const { t } = useTranslation()
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<SiteFormValues>()
  const storagePath = useWatch({
    name: `projects.${index}.imageStoragePath` as const,
  }) as string | undefined
  // Use the signed URL from form state (populated by reset(siteData) on edit load,
  // or set directly after a fresh upload via onUploaded).
  const imageUrl = useWatch({
    name: `projects.${index}.imageUrl` as const,
  }) as string | undefined

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          #{index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
          aria-label={t("sites.form.removeProject")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Field
          label={t("sites.form.projectName")}
          htmlFor={`proj-${index}-name`}
          required
          error={errors.projects?.[index]?.name?.message}
        >
          <Input
            id={`proj-${index}-name`}
            {...register(`projects.${index}.name`, {
              required: t("sites.form.required"),
            })}
          />
        </Field>
        <Field label={t("sites.form.projectUrl")} htmlFor={`proj-${index}-url`}>
          <Input
            id={`proj-${index}-url`}
            {...register(`projects.${index}.url`)}
            type="url"
          />
        </Field>
      </div>
      <Field label={t("sites.form.description")} htmlFor={`proj-${index}-desc`}>
        <Textarea
          id={`proj-${index}-desc`}
          {...register(`projects.${index}.description`)}
          rows={2}
          className="resize-none"
        />
      </Field>
      <Field label={t("sites.form.projectImage")}>
        <input
          type="hidden"
          {...register(`projects.${index}.imageStoragePath` as const)}
        />
        <ImageUploader
          label={t("sites.form.uploadImage")}
          currentPath={storagePath}
          currentUrl={imageUrl}
          bucket="screenshots"
          onUploaded={(url, path) => {
            setValue(`projects.${index}.imageUrl`, url)
            setValue(`projects.${index}.imageStoragePath`, path, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          onRemoved={() => {
            setValue(`projects.${index}.imageUrl`, undefined)
            setValue(`projects.${index}.imageStoragePath`, undefined, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
        />
      </Field>
    </div>
  )
}

export function ProjectsSection() {
  const { t } = useTranslation()
  const { control } = useFormContext<SiteFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  })

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, i) => (
        <ProjectItem key={field.id} index={i} onRemove={() => remove(i)} />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "" })}
        className="w-full gap-2"
        id="add-project-btn"
      >
        <Plus className="h-4 w-4" />
        {t("sites.form.addProject")}
      </Button>
    </div>
  )
}
