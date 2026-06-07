import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  User,
  Phone,
  Wrench,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Trophy,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AiAnalyzer } from "@/components/sites/AiAnalyzer"

import type { SiteFormValues } from "./form/types"
import { FormSection } from "./form/FormSection"
import { Field } from "./form/Field"
import { ImageUploader } from "./form/ImageUploader"
import { SkillsField } from "./form/SkillsField"
import { ExperienceSection } from "./form/ExperienceSection"
import { EducationSection } from "./form/EducationSection"
import { ProjectsSection } from "./form/ProjectsSection"
import { AchievementsSection } from "./form/AchievementsSection"

export interface SiteFormHandles {
  getValues: () => SiteFormValues
}

interface SiteFormProps {
  onAiApply: (data: Partial<SiteFormValues>) => void
}

export function SiteForm({ onAiApply }: SiteFormProps) {
  const { t } = useTranslation()
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<SiteFormValues>()

  const avatarStoragePath = useWatch({ name: "avatarStoragePath" }) as
    | string
    | undefined
  // Use the signed URL from form state — set by reset(siteData) on edit load,
  // or updated after a fresh upload via onUploaded.
  const avatarUrl = useWatch({ name: "avatarUrl" }) as string | undefined

  return (
    <div className="flex flex-col gap-8">
      {/* AI Analyzer */}
      <AiAnalyzer onApply={onAiApply} />

      {/* Basic data */}
      <FormSection icon={User} title={t("sites.form.basicData")}>
        <Field label={t("sites.form.avatar")}>
          <input type="hidden" {...register("avatarStoragePath")} />
          <ImageUploader
            label={t("sites.form.uploadAvatar")}
            currentPath={avatarStoragePath}
            currentUrl={avatarUrl}
            bucket="avatars"
            onUploaded={(url, path) => {
              setValue("avatarStoragePath", path, {
                shouldDirty: true,
                shouldValidate: true,
              })
              setValue("avatarUrl", url)
            }}
            onRemoved={() => {
              setValue("avatarStoragePath", undefined, {
                shouldDirty: true,
                shouldValidate: true,
              })
              setValue("avatarUrl", undefined)
            }}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label={t("sites.form.fullName")}
            htmlFor="full-name-input"
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
          <Field
            label={t("sites.form.jobTitle")}
            htmlFor="job-title-input"
            className="col-span-2 sm:col-span-1"
          >
            <Input {...register("jobTitle")} id="job-title-input" />
          </Field>
          <Field
            label={t("sites.form.location")}
            htmlFor="location-input"
            className="col-span-2"
          >
            <Input {...register("location")} id="location-input" />
          </Field>
        </div>

        <Field label={t("sites.form.bio")} htmlFor="bio-input">
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
          <Field
            label={t("sites.form.email")}
            htmlFor="contact-email-input"
            className="col-span-2 sm:col-span-1"
          >
            <Input
              {...register("contacts.email")}
              id="contact-email-input"
              type="email"
            />
          </Field>
          <Field
            label={t("sites.form.phone")}
            htmlFor="contact-phone-input"
            className="col-span-2 sm:col-span-1"
          >
            <Input
              {...register("contacts.phone")}
              id="contact-phone-input"
              type="tel"
            />
          </Field>
          <Field
            label={t("sites.form.linkedin")}
            htmlFor="contact-linkedin-input"
            className="col-span-2 sm:col-span-1"
          >
            <Input
              {...register("contacts.linkedin")}
              id="contact-linkedin-input"
              type="url"
            />
          </Field>
          <Field
            label={t("sites.form.github")}
            htmlFor="contact-github-input"
            className="col-span-2 sm:col-span-1"
          >
            <Input
              {...register("contacts.github")}
              id="contact-github-input"
              type="url"
            />
          </Field>
          <Field
            label={t("sites.form.website")}
            htmlFor="contact-website-input"
            className="col-span-2"
          >
            <Input
              {...register("contacts.website")}
              id="contact-website-input"
              type="url"
            />
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
