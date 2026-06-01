"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [recoveryReady, setRecoveryReady] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    // Supabase tira el evento PASSWORD_RECOVERY cuando el usuario llega via
    // el magic link del email. Recién ahí tenemos sesión válida para hacer
    // updateUser({ password }).
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryReady(true)
    })

    // Defensa: si en 1.5s no llegó el evento, chequeamos la sesión actual.
    // (En refresh del cliente el evento no se dispara pero la sesión existe).
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setRecoveryReady(true)
      else setLinkError("Link inválido o expirado.")
    }, 1500)

    return () => {
      clearTimeout(t)
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error("Mínimo 6 caracteres")
      return
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Contraseña actualizada 🔥")
    router.push("/prode")
    router.refresh()
  }

  if (linkError) {
    return (
      <div className="text-center py-4 space-y-4">
        <p className="text-sm text-destructive">{linkError}</p>
        <Link href="/auth/forgot-password" className="block">
          <Button variant="outline" size="sm" className="w-full">
            Pedir un link nuevo
          </Button>
        </Link>
      </div>
    )
  }

  if (!recoveryReady) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="6 caracteres mínimo"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Repetí la contraseña</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repetí la nueva contraseña"
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Guardar contraseña"
        )}
      </Button>
    </form>
  )
}
