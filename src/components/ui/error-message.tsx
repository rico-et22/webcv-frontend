import * as React from "react"
import { cn } from "@/lib/utils"

export const ErrorMessage = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  if (!children) return null

  if (typeof children === "string" && children.includes("\n")) {
    return (
      <ul
        ref={ref as React.Ref<HTMLUListElement>}
        className={cn(
          "mt-2 list-disc space-y-1 pl-4 text-sm font-medium text-destructive",
          className
        )}
        {...props}
      >
        {children.split("\n").map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    )
  }

  return (
    <p
      ref={ref as React.Ref<HTMLParagraphElement>}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
})
ErrorMessage.displayName = "ErrorMessage"
