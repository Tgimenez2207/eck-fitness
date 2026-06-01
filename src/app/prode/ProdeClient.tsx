"use client"

import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ProdeBoard } from "@/components/ProdeBoard"
import type {
  ProdeMatch,
  ProdePrediction,
  LeaderboardRow,
} from "@/types/database"

interface Props {
  userId: string
  userName: string
  matches: ProdeMatch[]
  predictions: ProdePrediction[]
  leaderboard: LeaderboardRow[]
}

export function ProdeClient(props: Props) {
  const supabase = createClient()

  async function handleSave(
    matchId: string,
    homeScore: number,
    awayScore: number
  ): Promise<ProdePrediction> {
    const { data, error } = await supabase
      .from("prode_predictions")
      .upsert(
        {
          user_id: props.userId,
          match_id: matchId,
          home_score: homeScore,
          away_score: awayScore,
        },
        { onConflict: "user_id,match_id" }
      )
      .select()
      .single()

    if (error) {
      toast.error("No se pudo guardar")
      throw error
    }
    toast.success("Pronóstico guardado 💪")
    return data as ProdePrediction
  }

  return <ProdeBoard {...props} onSavePrediction={handleSave} />
}
