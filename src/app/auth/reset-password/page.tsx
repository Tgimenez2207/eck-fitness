import Link from "next/link"
import { redirect } from "next/navigation"
import { EckLogo } from "@/components/EckLogo"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { hasSupabaseConfig } from "@/lib/env"

export default async function ResetPasswordPage() {
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
              Nueva contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresá la contraseña que vas a usar de ahora en más.
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </main>
  )
}
