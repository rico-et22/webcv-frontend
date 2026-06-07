import { useTranslation } from "react-i18next"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "./Field"
import type { SiteFormValues } from "./types"

export function EducationSection() {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SiteFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
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
              aria-label={t("sites.form.removeEducation")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 items-end gap-3">
            <Field
              label={t("sites.form.institution")}
              htmlFor={`edu-${field.id}-inst`}
              required
              error={errors.education?.[i]?.institution?.message}
              className="col-span-2"
            >
              <Input
                id={`edu-${field.id}-inst`}
                {...register(`education.${i}.institution`, {
                  required: t("sites.form.required"),
                })}
              />
            </Field>
            <Field
              label={t("sites.form.degree")}
              htmlFor={`edu-${field.id}-degree`}
              required
              error={errors.education?.[i]?.degree?.message}
              className="col-span-2"
            >
              <Input
                id={`edu-${field.id}-degree`}
                {...register(`education.${i}.degree`, {
                  required: t("sites.form.required"),
                })}
              />
            </Field>
            <Field
              label={t("sites.form.startDate")}
              htmlFor={`edu-${field.id}-start`}
              required
              error={errors.education?.[i]?.startDate?.message}
            >
              <Input
                id={`edu-${field.id}-start`}
                {...register(`education.${i}.startDate`, {
                  required: t("sites.form.required"),
                })}
                placeholder="2023-10"
              />
            </Field>
            <Field
              label={t("sites.form.endDateOptional")}
              htmlFor={`edu-${field.id}-end`}
            >
              <Input
                id={`edu-${field.id}-end`}
                {...register(`education.${i}.endDate`)}
                placeholder="2027-06"
              />
            </Field>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ institution: "", degree: "", startDate: "" })}
        className="w-full gap-2"
        id="add-education-btn"
      >
        <Plus className="h-4 w-4" />
        {t("sites.form.addEducation")}
      </Button>
    </div>
  )
}
