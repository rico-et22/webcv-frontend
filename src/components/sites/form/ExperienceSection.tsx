import { useTranslation } from "react-i18next"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "./Field"
import type { SiteFormValues } from "./types"

export function ExperienceSection() {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SiteFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
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
              aria-label={t("sites.form.removeExperience")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 items-end gap-3">
            <Field
              label={t("sites.form.company")}
              htmlFor={`exp-${field.id}-company`}
              required
              error={errors.experience?.[i]?.company?.message}
              className="col-span-2"
            >
              <Input
                id={`exp-${field.id}-company`}
                {...register(`experience.${i}.company`, {
                  required: t("sites.form.required"),
                })}
              />
            </Field>
            <Field
              label={t("sites.form.role")}
              htmlFor={`exp-${field.id}-role`}
              required
              error={errors.experience?.[i]?.role?.message}
              className="col-span-2"
            >
              <Input
                id={`exp-${field.id}-role`}
                {...register(`experience.${i}.role`, {
                  required: t("sites.form.required"),
                })}
              />
            </Field>
            <Field
              label={t("sites.form.startDate")}
              htmlFor={`exp-${field.id}-start`}
              required
              error={errors.experience?.[i]?.startDate?.message}
            >
              <Input
                id={`exp-${field.id}-start`}
                {...register(`experience.${i}.startDate`, {
                  required: t("sites.form.required"),
                })}
                placeholder="2022-01"
              />
            </Field>
            <Field
              label={t("sites.form.endDateOptional")}
              htmlFor={`exp-${field.id}-end`}
            >
              <Input
                id={`exp-${field.id}-end`}
                {...register(`experience.${i}.endDate`)}
                placeholder="2024-06"
              />
            </Field>
          </div>
          <Field
            label={t("sites.form.description")}
            htmlFor={`exp-${field.id}-desc`}
          >
            <Textarea
              id={`exp-${field.id}-desc`}
              {...register(`experience.${i}.description`)}
              rows={3}
              className="resize-none"
            />
          </Field>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ company: "", role: "", startDate: "" })}
        className="w-full gap-2"
        id="add-experience-btn"
      >
        <Plus className="h-4 w-4" />
        {t("sites.form.addExperience")}
      </Button>
    </div>
  )
}
