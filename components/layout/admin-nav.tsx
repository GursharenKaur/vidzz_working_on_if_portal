"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Building2, LogOut, Home } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/companies", label: "Manage Companies", icon: Building2 },
    { href: "/admin/students", label: "Manage Students", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-cyan-400">IF Portal</h1>
        <p className="text-sm text-slate-400">Admin</p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button variant={pathname === href ? "default" : "ghost"} className="w-full justify-start">
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
