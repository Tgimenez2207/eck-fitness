import Link from "next/link"
import { redirect } from "next/navigation"
import { EckLogo } from "@/components/EckLogo"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { hasSupabaseConfig } from "@/lib/env"

export default async function ForgotPasswordPage() {
  if (!hasSupabaseConfig()) redirect("/demo")

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
              Recuperá tu cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Te mandamos un link a tu mail para resetear la contraseña.
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="text-center text-xs text-muted-foreground mt-6">
            ¿Te acordaste?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-primary hover:underline"
            >
              Volvé al login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
