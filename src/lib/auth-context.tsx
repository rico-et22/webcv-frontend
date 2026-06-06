import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { UserResponseDto } from "@/api"

interface AuthSession {
  accessToken: string | null
  refreshToken: string | null
  user: UserResponseDto | null
}

interface AuthContextType extends AuthSession {
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: UserResponseDto
  ) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession>({
    accessToken: null,
    refreshToken: null,
    user: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load session from localStorage on init
    const storedAccessToken = localStorage.getItem("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")
    const storedUser = localStorage.getItem("user")

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        setSessionState({
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          user: JSON.parse(storedUser),
        })
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const setSession = (
    accessToken: string,
    refreshToken: string,
    user: UserResponseDto
  ) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("user", JSON.stringify(user))

    setSessionState({ accessToken, refreshToken, user })
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")

    setSessionState({ accessToken: null, refreshToken: null, user: null })
  }

  return (
    <AuthContext.Provider value={{ ...session, setSession, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
