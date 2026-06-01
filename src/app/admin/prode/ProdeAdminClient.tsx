"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2, Trophy, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calcPoints, PHASES } from "@/lib/prode-utils"
import type { ProdeMatch, ProdePhase, ProdePrediction } from "@/types/database"

const emptyForm = {
  phase: "grupos" as ProdePhase,
  group_name: "",
  home_team: "",
  away_team: "",
  match_date: "",
  is_closed: false,
}

interface LeaderboardRow {
  name: string
  memberNumber: string | null
  points: number
  exact: number
  correct: number
  preds: number
}

export function ProdeAdminClient() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<"partidos" | "posiciones">(
    "partidos"
  )
  const [matches, setMatches] = useState<ProdeMatch[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const [resultEditing, setResultEditing] = useState<string | null>(null)
  const [resultForm, setResultForm] = useState({ home: "", away: "" })

  const loadMatches = useCallback(async () => {
    const { data } = await supabase
      .from("prode_matches")
      .select("*")
      .order("match_date")
    setMatches((data ?? []) as ProdeMatch[])
  }, [supabase])

  const loadLeaderboard = useCallback(async () => {
    const [{ data: preds }, { data: profiles }] = await Promise.all([
      supabase
        .from("prode_predictions")
        .select("user_id, home_score, away_score, points"),
      supabase.from("profiles").select("id, name, member_number"),
    ])
    const profileMap = new Map(
      (profiles ?? []).map(
        (p: { id: string; name: string; member_number: string | null }) => [
          p.id,
          p,
        ]
      )
    )
    const userStats = new Map<
      string,
      { points: number; exact: number; correct: number; preds: number }
    >()
    for (const p of preds ?? []) {
      const s = userStats.get(p.user_id) ?? {
        points: 0,
        exact: 0,
        correct: 0,
        preds: 0,
      }
      userStats.set(p.user_id, {
        points: s.points + (p.points ?? 0),
        exact: s.exact + (p.points === 3 ? 1 : 0),
        correct: s.correct + (p.points === 1 ? 1 : 0),
        preds: s.preds + 1,
      })
    }
    const lb = Array.from(userStats.entries())
      .map(([userId, stats]) => {
        const profile = profileMap.get(userId)
        return {
          name: profile?.name ?? "?",
          memberNumber: profile?.member_number ?? null,
          ...stats,
        }
      })
      .sort((a, b) => b.points - a.points)
    setLeaderboard(lb)
  }, [supabase])

  useEffect(() => {
    loadMatches()
    loadLeaderboard()
  }, [loadMatches, loadLeaderboard])

  async function saveMatch() {
    if (!form.home_team || !form.away_team || !form.match_date) {
      toast.error("Completá los campos requeridos")
      return
    }
    setLoading(true)
    try {
      const payload = {
        phase: form.phase,
        group_name: form.phase === "grupos" ? form.group_name || null : null,
        home_team: form.home_team,
        away_team: form.away_team,
        match_date: new Date(form.match_date).toISOString(),
        is_closed: form.is_closed,
      }
      if (editingId) {
        const { error } = await supabase
          .from("prode_matches")
          .update(payload)
          .eq("id", editingId)
        if (error) throw error
        toast.success("Partido actualizado")
      } else {
        const { error } = await supabase.from("prode_matches").insert(payload)
        if (error) throw error
        toast.success("Partido creado")
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      loadMatches()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  async function deleteMatch(id: string) {
    if (!confirm("¿Eliminar partido y todos sus pronósticos?")) return
    const { error } = await supabase.from("prode_matches").delete().eq("id", id)
    if (error) toast.error("No se pudo eliminar")
    else {
      toast.success("Partido eliminado")
      loadMatches()
    }
  }

  async function toggleClosed(match: ProdeMatch) {
    await supabase
      .from("prode_matches")
      .update({ is_closed: !match.is_closed })
      .eq("id", match.id)
    loadMatches()
  }

  async function saveResult(matchId: string) {
    const homeScore = parseInt(resultForm.home)
    const awayScore = parseInt(resultForm.away)
    if (isNaN(homeScore) || isNaN(awayScore)) {
      toast.error("Ingresá ambos marcadores")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase
        .from("prode_matches")
        .update({
          home_score: homeScore,
          away_score: awayScore,
          is_closed: true,
        })
        .eq("id", matchId)
      if (error) throw error

      const { data: preds } = await supabase
        .from("prode_predictions")
        .select("*")
        .eq("match_id", matchId)
      for (const pred of preds ?? []) {
        const points = calcPoints(pred as ProdePrediction, {
          home_score: homeScore,
          away_score: awayScore,
        })
        await supabase
          .from("prode_predictions")
          .update({ points })
          .eq("id", pred.id)
      }

      toast.success(
        `Resultado ingresado · ${(preds ?? []).length} pronósticos calculados`
      )
      setResultEditing(null)
      loadMatches()
      loadLeaderboard()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  const matchesByPhase = PHASES.map((p) => ({
    phase: p,
    matches: matches.filter((m) => m.phase === p.key),
  })).filter((g) => g.matches.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-foreground tracking-tight">
            Admin · Prode
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {matches.length} partidos · {leaderboard.length} participantes
          </p>
        </div>
        {activeTab === "partidos" && (
          <Button
            onClick={() => {
              setForm(emptyForm)
              setEditingId(null)
              setShowForm((v) => !v)
            }}
          >
            <Plus className="size-4" /> Partido
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {(["partidos", "posiciones"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "partidos" ? "Partidos" : "Posiciones"}
          </button>
        ))}
      </div>

      {showForm && activeTab === "partidos" && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 max-w-xl">
          <h3 className="font-heading text-xl">
            {editingId ? "Editar partido" : "Nuevo partido"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fase</Label>
              <select
                className="w-full h-10 rounded-lg bg-input/60 border border-border px-3 text-sm text-foreground"
                value={form.phase}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    phase: e.target.value as ProdePhase,
                  }))
                }
              >
                {PHASES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {form.phase === "grupos" && (
              <div className="space-y-1.5">
                <Label>Grupo</Label>
                <Input
                  className="uppercase"
                  value={form.group_name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      group_name: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="A"
                  maxLength={1}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Local</Label>
              <Input
                value={form.home_team}
                onChange={(e) =>
                  setForm((f) => ({ ...f, home_team: e.target.value }))
                }
                placeholder="Argentina"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Visitante</Label>
              <Input
                value={form.away_team}
                onChange={(e) =>
                  setForm((f) => ({ ...f, away_team: e.target.value }))
                }
                placeholder="México"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Fecha y hora</Label>
              <Input
                type="datetime-local"
                value={form.match_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, match_date: e.target.value }))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_closed}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_closed: e.target.checked }))
              }
              className="rounded accent-primary"
            />
            Pronósticos cerrados
          </label>
          <div className="flex gap-3">
            <Button
              onClick={saveMatch}
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="size-4 animate-spin" />} Guardar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {activeTab === "partidos" && (
        <div className="space-y-6 max-w-3xl">
          {matchesByPhase.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">⚽</p>
              <p className="text-sm uppercase tracking-wider font-bold">
                Sin partidos · creá el primero
              </p>
            </div>
          )}
          {matchesByPhase.map(({ phase, matches: pm }) => (
            <div key={phase.key} className="space-y-2">
              <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-primary">
                {phase.label}
              </p>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border/50">
                {pm.map((m) => {
                  const isPlayed = m.home_score != null && m.away_score != null
                  return (
                    <div key={m.id} className="p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {m.group_name && (
                              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded uppercase">
                                G{m.group_name}
                              </span>
                            )}
                            <p className="text-sm font-bold text-foreground">
                              {m.home_team} vs {m.away_team}
                            </p>
                            {isPlayed && (
                              <span className="font-heading text-lg text-primary">
                                {m.home_score}-{m.away_score}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(m.match_date).toLocaleString("es-AR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            hs
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleClosed(m)}
                            title={
                              m.is_closed
                                ? "Abrir pronósticos"
                                : "Cerrar pronósticos"
                            }
                            className="size-8 grid place-items-center rounded-lg bg-muted hover:bg-secondary transition-colors text-muted-foreground"
                          >
                            {m.is_closed ? (
                              <Lock className="size-3.5" />
                            ) : (
                              <Unlock className="size-3.5" />
                            )}
                          </button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="size-8 p-0"
                            title="Resultado"
                            onClick={() => {
                              setResultEditing(
                                resultEditing === m.id ? null : m.id
                              )
                              setResultForm({
                                home: m.home_score?.toString() ?? "",
                                away: m.away_score?.toString() ?? "",
                              })
                            }}
                          >
                            <Trophy className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="size-8 p-0"
                            onClick={() => {
                              setForm({
                                phase: m.phase,
                                group_name: m.group_name ?? "",
                                home_team: m.home_team,
                                away_team: m.away_team,
                                match_date: new Date(m.match_date)
                                  .toISOString()
                                  .slice(0, 16),
                                is_closed: m.is_closed,
                              })
                              setEditingId(m.id)
                              setShowForm(true)
                            }}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="size-8 p-0 text-destructive"
                            onClick={() => deleteMatch(m.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {resultEditing === m.id && (
                        <div className="flex items-center gap-2 bg-muted/40 rounded-xl p-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                            Resultado
                          </span>
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            className="w-14 h-9 text-center font-heading text-base"
                            value={resultForm.home}
                            onChange={(e) =>
                              setResultForm((f) => ({
                                ...f,
                                home: e.target.value,
                              }))
                            }
                            placeholder="0"
                          />
                          <span className="text-sm font-bold text-muted-foreground">
                            -
                          </span>
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            className="w-14 h-9 text-center font-heading text-base"
                            value={resultForm.away}
                            onChange={(e) =>
                              setResultForm((f) => ({
                                ...f,
                                away: e.target.value,
                              }))
                            }
                            placeholder="0"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveResult(m.id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              "Guardar"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setResultEditing(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "posiciones" && (
        <div className="max-w-2xl">
          {leaderboard.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-sm uppercase tracking-wider font-bold">
                Sin pronósticos todavía
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left px-4 py-3 font-bold">#</th>
                    <th className="text-left px-4 py-3 font-bold">Socio</th>
                    <th className="text-center px-3 py-3 font-bold">J</th>
                    <th className="text-center px-3 py-3 font-bold">⭐</th>
                    <th className="text-center px-3 py-3 font-bold">✓</th>
                    <th className="text-right px-4 py-3 font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {leaderboard.map((l, i) => (
                    <tr
                      key={i}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td
                        className={`px-4 py-3 font-heading text-lg ${
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
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-foreground text-sm">
                          {l.name}
                        </p>
                        {l.memberNumber && (
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            N° {l.memberNumber}
                          </p>
                        )}
                      </td>
                      <td className="text-center px-3 py-3 text-muted-foreground font-semibold">
                        {l.preds}
                      </td>
                      <td className="text-center px-3 py-3 text-primary font-bold">
                        {l.exact}
                      </td>
                      <td className="text-center px-3 py-3 text-accent font-bold">
                        {l.correct}
                      </td>
                      <td className="text-right px-4 py-3 font-heading text-xl text-foreground">
                        {l.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
