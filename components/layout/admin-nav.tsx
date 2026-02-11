"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/lib/store/auth"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Building2, LogOut, Home, LayoutDashboard, Database, Activity, ShieldAlert, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/shared/theme-toggle"

import { cn } from "@/lib/utils"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/companies", label: "Companies", icon: Building2 },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <aside className="w-80 h-screen bg-hsl(var(--sidebar-background)) text-hsl(var(--sidebar-foreground)) border-r border-hsl(var(--sidebar-border)) flex flex-col relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="p-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center">
            <Image 
              src={theme === 'dark' ? "/TVC logo white.png" : "/TVC Logo Black.png"}
              alt="TVC Logo" 
              width={40} 
              height={40}
              className="h-8 w-8"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tighter">IF<span className="text-blue-500 text-sm ml-1 uppercase">Portal</span></h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldAlert className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Global Admin</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 relative z-10 mt-2">
        <div className="mb-6 px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Command Control</p>
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href} className="block group relative">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-14 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-blue-500/10 text-blue-500 font-bold"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavAdmin"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full shadow-[4px_0_12px_rgba(59,130,246,0.5)]"
                  />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="text-xs uppercase tracking-widest font-black">{label}</span>

                {isActive && (
                  <div className="ml-auto">
                    <Activity className="h-3 w-3 text-blue-500 animate-pulse" />
                  </div>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-8 relative z-10 border-t border-hsl(var(--sidebar-border)) space-y-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Interface Theme</span>
          <ThemeToggle />
        </div>

        <div className="bg-foreground/[0.03] rounded-2xl p-4 border border-hsl(var(--sidebar-border)) transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Grid Status</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Connected</p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full h-12 justify-start gap-4 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all rounded-xl group"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout Protocol</span>
        </Button>
      </div>
    </aside>
  )
}

