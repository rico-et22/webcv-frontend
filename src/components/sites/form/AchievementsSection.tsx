import { useTranslation } from "react-i18next"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "./Field"
import type { SiteFormValues } from "./types"

export function AchievementsSection() {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SiteFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  })

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, i) => (
        <div
          key={field.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              #{i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              aria-label={t("sites.form.removeAchievement")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Field
            label={t("sites.form.achievementTitle")}
            htmlFor={`achv-${field.id}-title`}
            required
            error={errors.achievements?.[i]?.title?.message}
          >
            <Input
              id={`achv-${field.id}-title`}
              {...register(`achievements.${i}.title`, {
                required: t("sites.form.required"),
              })}
            />
          </Field>
          <Field
            label={t("sites.form.description")}
            htmlFor={`achv-${field.id}-desc`}
          >
            <Textarea
              id={`achv-${field.id}-desc`}
              {...register(`achievements.${i}.description`)}
              rows={2}
              className="resize-none"
            />
          </Field>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ title: "" })}
        className="w-full gap-2"
        id="add-achievement-btn"
      >
        <Plus className="h-4 w-4" />
        {t("sites.form.addAchievement")}
      </Button>
    </div>
  )
}
