export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { ProdeClient } from "./ProdeClient"
import { hasSupabaseConfig } from "@/lib/env"
import { createClient } from "@/lib/supabase/server"
import { buildLeaderboard } from "@/lib/prode-utils"
import type {
  ProdeMatch,
  ProdePrediction,
  LeaderboardRow,
  Profile,
} from "@/types/database"

export default async function ProdePage() {
  if (!hasSupabaseConfig()) redirect("/demo")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [
    { data: matchesRaw },
    { data: myPredsRaw },
    { data: allPredsRaw },
    { data: profilesRaw },
  ] = await Promise.all([
    supabase.from("prode_matches").select("*").order("match_date"),
    supabase.from("prode_predictions").select("*").eq("user_id", user.id),
    supabase.from("prode_predictions").select("*"),
    supabase.from("profiles").select("id, name, member_number"),
  ])

  const matches = (matchesRaw ?? []) as ProdeMatch[]
  const myPreds = (myPredsRaw ?? []) as ProdePrediction[]
  const allPreds = (allPredsRaw ?? []) as ProdePrediction[]
  const profiles = (profilesRaw ?? []) as Pick<Profile, "id" | "name" | "member_number">[]

  const profileMap = new Map(profiles.map((p) => [p.id, p]))
  const scoreMap = buildLeaderboard(allPreds, matches)

  const leaderboard: LeaderboardRow[] = Array.from(scoreMap.entries())
    .map(([uid, stats]) => {
      const profile = profileMap.get(uid)
      return {
        userId: uid,
        name: profile?.name ?? "Anónimo",
        memberNumber: profile?.member_number ?? null,
        ...stats,
      }
    })
    .sort((a, b) => b.points - a.points)

  const userProfile = profileMap.get(user.id)
  const userName = userProfile?.name ?? user.email?.split("@")[0] ?? "Vos"

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProdeClient
          userId={user.id}
          userName={userName}
          matches={matches}
          predictions={myPreds}
          leaderboard={leaderboard}
        />
      </main>
    </>
  )
}
