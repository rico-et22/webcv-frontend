import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  User,
  Phone,
  Wrench,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Trophy,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { apiClient } from "@/api/client"
import type { CreateSiteDto } from "@/api/index"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"
import { AiAnalyzer } from "@/components/sites/AiAnalyzer"
import { cn } from "@/lib/utils"

// ------- Section wrapper -------
function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-gradient">
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
      </div>
      <Separator />
      {children}
    </section>
  )
}

// ------- Field row helper -------
function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>
        {label}
        {required && (
          <span className="ml-1 text-xs text-destructive">
            ({t("sites.form.required")})
          </span>
        )}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ------- Image uploader with thumbnail -------
function ImageUploader({
  label,
  currentPath,
  bucket,
  onUploaded,
  onRemoved,
}: {
  label: string
  currentPath?: string
  bucket: "avatars" | "screenshots"
  onUploaded: (url: string, storagePath: string) => void
  onRemoved: () => void
}) {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const currentUrl = currentPath
    ? `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${bucket}/${currentPath}`
    : undefined

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await apiClient.storage.storageControllerUpload({
        file,
        bucket,
      })
      onUploaded(res.data.data.url, res.data.data.storagePath)
    } catch {
      toast.error(t("sites.form.imageError"))
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (currentPath) {
      try {
        await apiClient.storage.storageControllerDeleteFile({
          path: currentPath,
          bucket,
        })
      } catch {
        // Silent — we still clear the field
      }
    }
    onRemoved()
  }

  if (currentUrl) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10">
          <img
            src={currentUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="gap-1.5 text-destructive hover:border-destructive/40 hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" />
          {t("sites.form.removeImage")}
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {uploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <FileUpload
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        maxBytes={50 * 1024 * 1024}
        label={label}
        hint={t("sites.upload.imageOnly")}
        onFile={handleUpload}
      />
    </div>
  )
}

// ------- Skills -------
function SkillsField() {
  const { t } = useTranslation()
  const { watch, setValue } = useFormContext<CreateSiteDto>()
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
          placeholder={t("sites.form.skillPlaceholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addSkill()
            }
          }}
          id="skill-input"
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
                className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5"
                aria-label={`Usuń umiejętność ${skill}`}
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

// ------- Experience -------
function ExperienceSection() {
  const { t } = useTranslation()
  const { register, control, formState: { errors } } = useFormContext<CreateSiteDto>()
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
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label={t("sites.form.company")} className="col-span-2">
              <Input {...register(`experience.${i}.company`)} />
            </Field>
            <Field label={t("sites.form.role")} className="col-span-2">
              <Input {...register(`experience.${i}.role`)} />
            </Field>
            <Field label={t("sites.form.startDate")}>
              <Input {...register(`experience.${i}.startDate`)} placeholder="2022-01" />
            </Field>
            <Field label={t("sites.form.endDateOptional")}>
              <Input {...register(`experience.${i}.endDate`)} placeholder="2024-06" />
            </Field>
          </div>
          <Field label={t("sites.form.description")}>
            <Textarea
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

// ------- Education -------
function EducationSection() {
  const { t } = useTranslation()
  const { register, control } = useFormContext<CreateSiteDto>()
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
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label={t("sites.form.institution")} className="col-span-2 ">
              <Input {...register(`education.${i}.institution`)} />
            </Field>
            <Field label={t("sites.form.degree")} className="col-span-2">
              <Input {...register(`education.${i}.degree`)} />
            </Field>
            <Field label={t("sites.form.startDate")}>
              <Input {...register(`education.${i}.startDate`)} placeholder="2023-10" />
            </Field>
            <Field label={t("sites.form.endDateOptional")}>
              <Input {...register(`education.${i}.endDate`)} placeholder="2027-06" />
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

// ------- Projects -------
function ProjectItem({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  const { t } = useTranslation()
  const { register, setValue } = useFormContext<CreateSiteDto>()
  const storagePath = useWatch({
    name: `projects.${index}.imageStoragePath` as const,
  }) as string | undefined

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Field label={t("sites.form.projectName")} >
          <Input {...register(`projects.${index}.name`)} />
        </Field>
        <Field label={t("sites.form.projectUrl")}>
          <Input {...register(`projects.${index}.url`)} type="url" />
        </Field>
      </div>
      <Field label={t("sites.form.description")}>
        <Textarea {...register(`projects.${index}.description`)} rows={2} className="resize-none" />
      </Field>
      <Field label={t("sites.form.projectImage")}>
        <input type="hidden" {...register(`projects.${index}.imageStoragePath` as const)} />
        <ImageUploader
          label={t("sites.form.uploadImage")}
          currentPath={storagePath}
          bucket="screenshots"
          onUploaded={(url, path) => {
            setValue(`projects.${index}.imageStoragePath`, path, { shouldDirty: true, shouldValidate: true })
          }}
          onRemoved={() => {
            setValue(`projects.${index}.imageStoragePath`, undefined, { shouldDirty: true, shouldValidate: true })
          }}
        />
      </Field>
    </div>
  )
}

function ProjectsSection() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateSiteDto>()
  const { fields, append, remove } = useFieldArray({ control, name: "projects" })

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

// ------- Achievements -------
function AchievementsSection() {
  const { t } = useTranslation()
  const { register, control } = useFormContext<CreateSiteDto>()
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
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Field label={t("sites.form.achievementTitle")}>
            <Input {...register(`achievements.${i}.title`)} />
          </Field>
          <Field label={t("sites.form.description")}>
            <Textarea
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

// ------- Main SiteForm -------
export interface SiteFormHandles {
  getValues: () => CreateSiteDto
}

interface SiteFormProps {
  onAiApply: (data: Partial<CreateSiteDto>) => void
}

export function SiteForm({ onAiApply }: SiteFormProps) {
  const { t } = useTranslation()
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CreateSiteDto>()

  // Track avatar preview URL in local state (full public URL from storage)
  const avatarStoragePath = useWatch({ name: "avatarStoragePath" }) as string | undefined

  return (
    <div className="flex flex-col gap-8">
      {/* AI Analyzer */}
      <AiAnalyzer onApply={onAiApply} />

      {/* Basic data */}
      <FormSection icon={User} title={t("sites.form.basicData")}>
        <Field
          label={t("sites.form.avatar")}
        >
          <input type="hidden" {...register("avatarUrl")} />
          <input type="hidden" {...register("avatarStoragePath")} />
          <ImageUploader
            label={t("sites.form.uploadAvatar")}
            currentPath={avatarStoragePath}
            bucket="avatars"
            onUploaded={(url, path) => {
              setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true })
              setValue("avatarStoragePath", path, { shouldDirty: true, shouldValidate: true })
            }}
            onRemoved={() => {
              setValue("avatarUrl", undefined, { shouldDirty: true, shouldValidate: true })
              setValue("avatarStoragePath", undefined, { shouldDirty: true, shouldValidate: true })
            }}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label={t("sites.form.fullName")}
            required
            error={errors.fullName?.message}
            className="col-span-2 sm:col-span-1"
          >
            <Input
              {...register("fullName", {
                required: t("sites.form.fullNameRequired"),
              })}
              id="full-name-input"
            />
          </Field>
          <Field label={t("sites.form.jobTitle")} className="col-span-2 sm:col-span-1">
            <Input {...register("jobTitle")} id="job-title-input" />
          </Field>
          <Field label={t("sites.form.location")} className="col-span-2">
            <Input {...register("location")} id="location-input" />
          </Field>
        </div>

        <Field label={t("sites.form.bio")}>
          <Textarea
            {...register("bio")}
            rows={4}
            className="resize-none"
            id="bio-input"
          />
        </Field>
      </FormSection>

      {/* Contact */}
      <FormSection icon={Phone} title={t("sites.form.contacts")}>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("sites.form.email")} className="col-span-2 sm:col-span-1">
            <Input {...register("contacts.email")} type="email" />
          </Field>
          <Field label={t("sites.form.phone")} className="col-span-2 sm:col-span-1">
            <Input {...register("contacts.phone")} type="tel" />
          </Field>
          <Field label={t("sites.form.linkedin")} className="col-span-2 sm:col-span-1">
            <Input {...register("contacts.linkedin")} type="url" />
          </Field>
          <Field label={t("sites.form.github")} className="col-span-2 sm:col-span-1">
            <Input {...register("contacts.github")} type="url" />
          </Field>
          <Field label={t("sites.form.website")} className="col-span-2">
            <Input {...register("contacts.website")} type="url" />
          </Field>
        </div>
      </FormSection>

      {/* Skills */}
      <FormSection icon={Wrench} title={t("sites.form.skills")}>
        <SkillsField />
      </FormSection>

      {/* Experience */}
      <FormSection icon={Briefcase} title={t("sites.form.experience")}>
        <ExperienceSection />
      </FormSection>

      {/* Education */}
      <FormSection icon={GraduationCap} title={t("sites.form.education")}>
        <EducationSection />
      </FormSection>

      {/* Projects */}
      <FormSection icon={FolderGit2} title={t("sites.form.projects")}>
        <ProjectsSection />
      </FormSection>

      {/* Achievements */}
      <FormSection icon={Trophy} title={t("sites.form.achievements")}>
        <AchievementsSection />
      </FormSection>
    </div>
  )
}
