// import { create } from "zustand"

// interface User {
//   id: string
//   email: string
//   name: string
//   phone?: string
//   rollNo?: string
//   year?: string
//   branch?: string
// }

// interface AuthState {
//   token: string | null
//   role: "student" | "company" | "admin" | "faculty" | null
//   user: User | null
//   setAuth: (token: string, role: "student" | "company" | "admin" | "faculty", user: User) => void
//   logout: () => void
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   token: typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
//   role: typeof window !== "undefined" ? (localStorage.getItem("auth_role") as any) : null,
//   user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth_user") || "null") : null,

//   setAuth: (token, role, user) => {
//     localStorage.setItem("auth_token", token)
//     localStorage.setItem("auth_role", role)
//     localStorage.setItem("auth_user", JSON.stringify(user))
//     set({ token, role, user })
//   },

//   logout: () => {
//     localStorage.removeItem("auth_token")
//     localStorage.removeItem("auth_role")
//     localStorage.removeItem("auth_user")
//     set({ token: null, role: null, user: null })
//   },
// }))

//lib/store/auth.ts

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
  [key: string]: any
}

interface AuthState {
  token: string | null
  role: "student" | "company" | "admin" | "faculty" | null
  user: User | null
  profile: any | null
  _hasHydrated: boolean
  setAuth: (
    token: string,
    role: "student" | "company" | "admin" | "faculty",
    user: User,
    profile?: any
  ) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      profile: null,
      _hasHydrated: false,

      setAuth: (token, role, user, profile = null) => {
        set({ token, role, user, profile })
      },

      logout: () => {
        set({ token: null, role: null, user: null, profile: null })
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage")
        }
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
