"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setSent(true)
    toast.success("Mail enviado 📨")
  }

  if (sent) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="size-14 mx-auto rounded-full bg-primary/15 border border-primary/30 grid place-items-center">
          <MailCheck className="size-7 text-primary" />
        </div>
        <div>
          <p className="font-heading text-xl text-foreground mb-1">
            Revisá tu inbox
          </p>
          <p className="text-sm text-muted-foreground">
            Te mandamos un link a <span className="font-bold text-foreground">{email}</span>.
            Hacé click ahí para setear una nueva contraseña.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSent(false)
            setEmail("")
          }}
          className="text-xs"
        >
          Mandar a otra dirección
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Mandarme el link"
        )}
      </Button>
    </form>
  )
}
