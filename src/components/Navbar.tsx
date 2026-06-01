import Link from "next/link"
import { EckLogo } from "./EckLogo"
import { Button } from "./ui/button"
import { hasSupabaseConfig } from "@/lib/env"
import { LogOut, User as UserIcon } from "lucide-react"

async function getCurrentUser() {
  if (!hasSupabaseConfig()) return null
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function Navbar() {
  const user = await getCurrentUser()
  const hasAuth = hasSupabaseConfig()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <EckLogo size="md" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href={hasAuth ? "/prode" : "/demo"}
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Prode
          </Link>
          <Link
            href="/reglamento"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Reglas
          </Link>
          {user ? (
            <>
              <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <UserIcon className="size-3.5" />
                {user.email?.split("@")[0]}
              </span>
              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="text-xs"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </form>
            </>
          ) : hasAuth ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Ingresar
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sumate</Button>
              </Link>
            </>
          ) : (
            <Link href="/demo">
              <Button size="sm">Probar demo</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
