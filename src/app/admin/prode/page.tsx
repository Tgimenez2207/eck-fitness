export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { ProdeAdminClient } from "./ProdeAdminClient"
import { hasSupabaseConfig } from "@/lib/env"
import { createClient } from "@/lib/supabase/server"

export default async function ProdeAdminPage() {
  if (!hasSupabaseConfig()) redirect("/demo")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") redirect("/prode")

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <ProdeAdminClient />
        </div>
      </main>
    </>
  )
}
