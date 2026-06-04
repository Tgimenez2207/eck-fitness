export const dynamic = "force-dynamic"

import Link from "next/link"
import { redirect } from "next/navigation"
import { EckLogo } from "@/components/EckLogo"
import { LoginForm } from "./LoginForm"
import { hasSupabaseConfig } from "@/lib/env"

export default async function LoginPage() {
  if (!hasSupabaseConfig()) redirect("/demo")

  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect("/prode")

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 gradient-mesh">
      <div className="w-full max-w-md slide-up">
        <Link
          href="/"
          className="flex items-center justify-center mb-8 hover:opacity-90 transition-opacity"
        >
          <EckLogo size="lg" />
        </Link>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-lift">
          <div className="mb-7">
            <h1 className="font-heading text-3xl text-foreground mb-1">
              Ingresá
            </h1>
            <p className="text-sm text-muted-foreground">
              Continuá con tu prode del Mundial.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-muted-foreground mt-6">
            ¿No tenés cuenta?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-primary hover:underline"
            >
              Creá una gratis
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
