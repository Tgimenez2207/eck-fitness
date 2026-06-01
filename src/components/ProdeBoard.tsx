"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Trophy } from "lucide-react"
import { MatchCard } from "./MatchCard"
import { PHASES, type Phase, isMatchClosed } from "@/lib/prode-utils"
import { useNow } from "@/lib/use-now"
import type { ProdeMatch, ProdePrediction, LeaderboardRow } from "@/types/database"

interface Props {
  userId: string
  userName: string
  matches: ProdeMatch[]
  predictions: ProdePrediction[]
  leaderboard: LeaderboardRow[]
  onSavePrediction: (
    matchId: string,
    homeScore: number,
    awayScore: number
  ) => Promise<ProdePrediction>
}

export function ProdeBoard({
  userId,
  userName,
  matches,
  predictions,
  leaderboard,
  onSavePrediction,
}: Props) {
  const now = useNow(30_000)
  const firstPhaseWithMatches = PHASES.find((p) =>
    matches.some((m) => m.phase === p.key)
  )
  const [activePhase, setActivePhase] = useState<Phase>(
    firstPhaseWithMatches?.key ?? "grupos"
  )

  const [inputs, setInputs] = useState<
    Record<string, { home: number; away: number }>
  >(() => {
    const map: Record<string, { home: number; away: number }> = {}
    for (const pred of predictions)
      map[pred.match_id] = { home: pred.home_score, away: pred.away_score }
    return map
  })

  const [saved, setSaved] = useState<Record<string, ProdePrediction>>(() => {
    const map: Record<string, ProdePrediction> = {}
    for (const pred of predictions) map[pred.match_id] = pred
    return map
  })

  const [saving, setSaving] = useState<Set<string>>(new Set())

  async function savePrediction(matchId: string) {
    const match = matches.find((m) => m.id === matchId)
    if (match && isMatchClosed(match, Date.now())) {
      toast.error("Este partido ya está cerrado")
      return
    }
    const input = inputs[matchId] ?? { home: 0, away: 0 }
    setSaving((prev) => new Set([...prev, matchId]))
    try {
      const newPred = await onSavePrediction(matchId, input.home, input.away)
      setSaved((prev) => ({ ...prev, [matchId]: newPred }))
    } finally {
      setSaving((prev) => {
        const s = new Set(prev)
        s.delete(matchId)
        return s
      })
    }
  }

  const phaseMatches = matches.filter((m) => m.phase === activePhase)

  const groupedMatches = useMemo(() => {
    if (activePhase !== "grupos") return null
    return phaseMatches.reduce(
      (acc, m) => {
        const g = m.group_name ?? "?"
        if (!acc[g]) acc[g] = []
        acc[g].push(m)
        return acc
      },
      {} as Record<string, ProdeMatch[]>
    )
  }, [phaseMatches, activePhase])

  const myRank = leaderboard.findIndex((l) => l.userId === userId) + 1
  const myPoints = leaderboard.find((l) => l.userId === userId)?.points ?? 0

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-8 pb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-3xl leading-none">🌍</span>
                <h1 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground">
                  Prode Mundial 2026
                </h1>
              </div>
              <p className="text-xs text-muted-foreground font-semibold">
                Hola, <span className="text-foreground">{userName}</span> · Exacto 3 pts · Resultado 1 pt
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 text-right shrink-0 shadow-glow-blue">
              <p className="font-heading text-2xl text-primary leading-none">
                {myPoints}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mt-1">
                pts {myRank > 0 ? `· #${myRank}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-border/60">
        <div
          className="mx-auto max-w-2xl flex overflow-x-auto scrollbar-thin px-4 sm:px-6 gap-1 py-3"
          style={{ scrollbarWidth: "none" }}
        >
          {PHASES.map((p) => {
            if (!matches.some((m) => m.phase === p.key)) return null
            return (
              <button
                key={p.key}
                onClick={() => setActivePhase(p.key)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activePhase === p.key
                    ? "bg-primary text-primary-foreground shadow-glow-blue"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-6 pb-12 space-y-7">
        {phaseMatches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">⚽</p>
            <p className="font-bold text-muted-foreground uppercase tracking-wider text-sm">
              Sin partidos en esta fase todavía
            </p>
          </div>
        )}

        {/* Grupos agrupados */}
        {activePhase === "grupos" &&
          groupedMatches &&
          Object.entries(groupedMatches)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, gMatches]) => (
              <div key={group} className="space-y-2.5">
                <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-primary px-1">
                  Grupo {group}
                </p>
                {gMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    input={inputs[m.id] ?? { home: 0, away: 0 }}
                    savedPred={saved[m.id]}
                    isSaving={saving.has(m.id)}
                    now={now}
                    onInputChange={(h, a) =>
                      setInputs((prev) => ({
                        ...prev,
                        [m.id]: { home: h, away: a },
                      }))
                    }
                    onSave={() => savePrediction(m.id)}
                  />
                ))}
              </div>
            ))}

        {/* Knockout */}
        {activePhase !== "grupos" &&
          phaseMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              input={inputs[m.id] ?? { home: 0, away: 0 }}
              savedPred={saved[m.id]}
              isSaving={saving.has(m.id)}
              now={now}
              onInputChange={(h, a) =>
                setInputs((prev) => ({
                  ...prev,
                  [m.id]: { home: h, away: a },
                }))
              }
              onSave={() => savePrediction(m.id)}
            />
          ))}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2 px-1">
              <Trophy className="size-4 text-primary" />
              <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-primary">
                Tabla de posiciones
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden divide-y divide-border/50">
              {leaderboard.slice(0, 20).map((l, i) => (
                <div
                  key={l.userId}
                  className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 transition-colors ${
                    l.userId === userId
                      ? "bg-primary/[0.06] border-l-2 border-l-primary"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <span
                    className={`w-7 text-center font-heading text-lg shrink-0 ${
                      i === 0
                        ? "text-yellow-400"
                        : i === 1
                          ? "text-slate-300"
                          : i === 2
                            ? "text-amber-600"
                            : "text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${l.userId === userId ? "text-primary" : "text-foreground"}`}
                    >
                      {l.name}
                    </p>
                    {l.memberNumber && (
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Socio N° {l.memberNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading text-xl text-foreground leading-none">
                      {l.points}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
