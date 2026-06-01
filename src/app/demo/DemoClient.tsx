"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ProdeBoard } from "@/components/ProdeBoard"
import { calcPoints } from "@/lib/prode-utils"
import type {
  ProdeMatch,
  ProdePrediction,
  LeaderboardRow,
} from "@/types/database"

const STORAGE_PREDS = "eck_prode_demo_preds_v1"
const STORAGE_NAME = "eck_prode_demo_name_v1"

const DEMO_USER_ID = "demo-me"

function loadPreds(): ProdePrediction[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_PREDS)
    if (!raw) return []
    return JSON.parse(raw) as ProdePrediction[]
  } catch {
    return []
  }
}

function savePreds(preds: ProdePrediction[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_PREDS, JSON.stringify(preds))
}

interface Props {
  matches: ProdeMatch[]
  baseLeaderboard: LeaderboardRow[]
}

export function DemoClient({ matches, baseLeaderboard }: Props) {
  const [predictions, setPredictions] = useState<ProdePrediction[]>([])
  const [userName, setUserName] = useState("Vos")
  const [nameModal, setNameModal] = useState(false)
  const [draftName, setDraftName] = useState("")

  useEffect(() => {
    setPredictions(loadPreds())
    const stored = localStorage.getItem(STORAGE_NAME)
    if (stored) setUserName(stored)
    else setNameModal(true)
  }, [])

  const myPoints = useMemo(() => {
    let pts = 0,
      exact = 0,
      correct = 0
    const matchMap = new Map(matches.map((m) => [m.id, m]))
    for (const p of predictions) {
      const m = matchMap.get(p.match_id)
      if (!m) continue
      const pp = calcPoints(p, m)
      if (pp === 3) exact++
      if (pp === 1) correct++
      if (pp != null) pts += pp
    }
    return { pts, exact, correct, total: predictions.length }
  }, [predictions, matches])

  const leaderboard: LeaderboardRow[] = useMemo(() => {
    const mine: LeaderboardRow = {
      userId: DEMO_USER_ID,
      name: userName,
      memberNumber: null,
      points: myPoints.pts,
      exact: myPoints.exact,
      correct: myPoints.correct,
      preds: myPoints.total,
    }
    return [...baseLeaderboard, mine].sort((a, b) => b.points - a.points)
  }, [baseLeaderboard, myPoints, userName])

  async function handleSave(
    matchId: string,
    homeScore: number,
    awayScore: number
  ): Promise<ProdePrediction> {
    const next = predictions.filter((p) => p.match_id !== matchId)
    const newPred: ProdePrediction = {
      id: `local-${matchId}`,
      user_id: DEMO_USER_ID,
      match_id: matchId,
      home_score: homeScore,
      away_score: awayScore,
      points: null,
      created_at: new Date().toISOString(),
    }
    next.push(newPred)
    savePreds(next)
    setPredictions(next)
    toast.success("Pronóstico guardado 💪 · modo demo")
    return newPred
  }

  function confirmName() {
    const v = draftName.trim() || "Vos"
    localStorage.setItem(STORAGE_NAME, v)
    setUserName(v)
    setNameModal(false)
  }

  return (
    <>
      {nameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lift slide-up">
            <h3 className="font-heading text-2xl text-foreground mb-1">
              ¿Cómo te llamamos?
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Solo para mostrarte en la tabla. Quedará guardado en este
              dispositivo.
            </p>
            <input
              autoFocus
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmName()
              }}
              placeholder="Tu nombre"
              className="w-full h-11 rounded-lg border border-border bg-input/40 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={confirmName}
              className="w-full mt-4 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors shadow-glow-blue"
            >
              Empezar
            </button>
          </div>
        </div>
      )}

      <div className="bg-accent/10 border-b border-accent/30 px-4 py-2">
        <p className="mx-auto max-w-2xl text-center text-[10px] font-bold uppercase tracking-widest text-accent">
          🎮 Modo demo · tus pronósticos quedan guardados en este dispositivo
        </p>
      </div>

      <ProdeBoard
        userId={DEMO_USER_ID}
        userName={userName}
        matches={matches}
        predictions={predictions}
        leaderboard={leaderboard}
        onSavePrediction={handleSave}
      />
    </>
  )
}
