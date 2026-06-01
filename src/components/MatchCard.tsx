"use client"

import { Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProdeMatch, ProdePrediction } from "@/types/database"
import { calcPoints, flag, formatMatchDate, isMatchClosed } from "@/lib/prode-utils"

function ScoreInput({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled: boolean
}) {
  return (
    <input
      type="number"
      min={0}
      max={20}
      value={value}
      onChange={(e) =>
        onChange(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))
      }
      disabled={disabled}
      className="w-12 h-12 text-center text-xl font-heading rounded-xl bg-input/60 border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-foreground"
    />
  )
}

interface Props {
  match: ProdeMatch
  input: { home: number; away: number }
  savedPred: ProdePrediction | undefined
  isSaving: boolean
  now: number
  onInputChange: (home: number, away: number) => void
  onSave: () => void
}

export function MatchCard({
  match,
  input,
  savedPred,
  isSaving,
  now,
  onInputChange,
  onSave,
}: Props) {
  const isPlayed = match.home_score != null && match.away_score != null
  // En el primer render (now=0) consideramos abierto hasta que el cliente tickee,
  // para evitar hydration mismatch con SSR.
  const isClosed = now > 0 && isMatchClosed(match, now)
  const hasPred = !!savedPred
  const points = savedPred && isPlayed ? calcPoints(savedPred, match) : null

  return (
    <div className="bg-card rounded-2xl border border-border/60 p-4 sm:p-5 shadow-card card-hover">
      {/* Meta row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
          {formatMatchDate(match.match_date)}
        </p>
        {isPlayed && points != null ? (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              points === 3
                ? "bg-primary/15 text-primary border border-primary/30"
                : points === 1
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-destructive/15 text-destructive border border-destructive/30"
            }`}
          >
            {points === 3 ? "⭐ 3 pts" : points === 1 ? "✓ 1 pt" : "✗ 0 pts"}
          </span>
        ) : isClosed ? (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
            <Lock className="size-3" /> Cerrado
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary pulse-glow" />
            Abierto
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-1">
        <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
          <span className="text-sm font-bold text-right leading-tight truncate text-foreground">
            {match.home_team}
          </span>
          {flag(match.home_team) && (
            <span className="text-2xl shrink-0">{flag(match.home_team)}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mx-2 shrink-0">
          {isPlayed ? (
            <>
              <span className="w-12 h-12 flex items-center justify-center text-xl font-heading bg-primary/10 border border-primary/20 text-primary rounded-xl">
                {match.home_score}
              </span>
              <span className="text-muted-foreground font-bold text-lg">-</span>
              <span className="w-12 h-12 flex items-center justify-center text-xl font-heading bg-primary/10 border border-primary/20 text-primary rounded-xl">
                {match.away_score}
              </span>
            </>
          ) : (
            <>
              <ScoreInput
                value={input.home}
                onChange={(h) => onInputChange(h, input.away)}
                disabled={isClosed}
              />
              <span className="text-muted-foreground font-bold text-lg">-</span>
              <ScoreInput
                value={input.away}
                onChange={(a) => onInputChange(input.home, a)}
                disabled={isClosed}
              />
            </>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2 justify-start min-w-0">
          {flag(match.away_team) && (
            <span className="text-2xl shrink-0">{flag(match.away_team)}</span>
          )}
          <span className="text-sm font-bold leading-tight truncate text-foreground">
            {match.away_team}
          </span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4">
        {isPlayed && hasPred && (
          <p className="text-center text-xs text-muted-foreground">
            Tu pronóstico:{" "}
            <span className="font-bold text-foreground">
              {savedPred!.home_score} - {savedPred!.away_score}
            </span>
          </p>
        )}
        {isPlayed && !hasPred && (
          <p className="text-center text-xs text-muted-foreground/50 italic">
            Sin pronóstico
          </p>
        )}
        {!isPlayed && !isClosed && (
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : hasPred ? (
              "Actualizar pronóstico"
            ) : (
              "Guardar pronóstico"
            )}
          </Button>
        )}
        {!isPlayed && isClosed && hasPred && (
          <p className="text-center text-xs text-muted-foreground">
            Tu pronóstico:{" "}
            <span className="font-bold text-foreground">
              {savedPred!.home_score} - {savedPred!.away_score}
            </span>
          </p>
        )}
        {!isPlayed && isClosed && !hasPred && (
          <p className="text-center text-xs text-muted-foreground/50 italic">
            No ingresaste pronóstico
          </p>
        )}
      </div>
    </div>
  )
}
