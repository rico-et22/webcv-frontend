import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useFormContext } from "react-hook-form"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SiteFormValues } from "./types"

export function SkillsField() {
  const { t } = useTranslation()
  const { watch, setValue } = useFormContext<SiteFormValues>()
  const skills = watch("skills") ?? []
  const inputRef = useRef<HTMLInputElement>(null)

  const addSkill = () => {
    const val = inputRef.current?.value.trim()
    if (!val) return
    if (!skills.includes(val)) {
      setValue("skills", [...skills, val])
    }
    if (inputRef.current) inputRef.current.value = ""
  }

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill)
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id="skill-input"
          aria-label={t("sites.form.skills")}
          placeholder={t("sites.form.skillPlaceholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addSkill()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSkill}
          className="shrink-0"
        >
          {t("sites.form.addSkill")}
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                aria-label={`${t("sites.form.removeSkill")} ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
