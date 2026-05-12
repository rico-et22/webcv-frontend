import { useEffect } from "react"
import { useBlocker } from "@tanstack/react-router"

const CONFIRM_MESSAGE =
  "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?"

/**
 * Blocks SPA navigation and browser unload when `isDirty` is true.
 * Shows a native confirm() dialog for SPA transitions.
 * Uses the browser's built-in beforeunload prompt for tab close / refresh.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  // Block TanStack Router internal navigation
  useBlocker({
    shouldBlockFn: () => {
      if (!isDirty) return false
      return window.confirm(CONFIRM_MESSAGE)
        ? false // user confirmed → allow navigation
        : true // user cancelled → block
    },
    enableBeforeUnload: isDirty,
    disabled: !isDirty,
  })

  // Also guard browser-level navigation (refresh, tab close, address bar)
  useEffect(() => {
    if (!isDirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Modern browsers show their own generic message; returnValue still needed
      e.returnValue = CONFIRM_MESSAGE
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])
}
