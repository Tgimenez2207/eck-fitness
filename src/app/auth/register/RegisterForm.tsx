"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [memberNumber, setMemberNumber] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, member_number: memberNumber || null },
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Cuenta creada 🔥")
    router.push("/prode")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>
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
      <div className="space-y-1.5">
        <Label htmlFor="member">
          Nº de socio <span className="text-muted-foreground/60 normal-case tracking-normal">(opcional)</span>
        </Label>
        <Input
          id="member"
          value={memberNumber}
          onChange={(e) => setMemberNumber(e.target.value)}
          placeholder="Ej: 0234"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
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
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Crear cuenta"}
      </Button>
    </form>
  )
}
