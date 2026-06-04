export const dynamic = "force-dynamic"

import Link from "next/link"
import { redirect } from "next/navigation"
import { EckLogo } from "@/components/EckLogo"
import { RegisterForm } from "./RegisterForm"
import { hasSupabaseConfig } from "@/lib/env"

export default async function RegisterPage() {
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
              Sumate
            </h1>
            <p className="text-sm text-muted-foreground">
              Es gratis. Empezás a pronosticar al instante.
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-xs text-muted-foreground mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-primary hover:underline"
            >
              Ingresá
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
