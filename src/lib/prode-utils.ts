import type { ProdeMatch, ProdePrediction } from "@/types/database"

export const FLAGS: Record<string, string> = {
  Argentina: "🇦🇷", Brasil: "🇧🇷", Uruguay: "🇺🇾",
  Colombia: "🇨🇴", Ecuador: "🇪🇨", Chile: "🇨🇱",
  Paraguay: "🇵🇾", Venezuela: "🇻🇪", Perú: "🇵🇪",
  Bolivia: "🇧🇴", México: "🇲🇽", EEUU: "🇺🇸",
  Canadá: "🇨🇦", "Costa Rica": "🇨🇷", Panamá: "🇵🇦",
  Honduras: "🇭🇳", Jamaica: "🇯🇲", "El Salvador": "🇸🇻",
  España: "🇪🇸", Francia: "🇫🇷", Alemania: "🇩🇪",
  Inglaterra: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Portugal: "🇵🇹", Italia: "🇮🇹",
  "Países Bajos": "🇳🇱", Bélgica: "🇧🇪", Suiza: "🇨🇭",
  Croacia: "🇭🇷", Polonia: "🇵🇱", Serbia: "🇷🇸",
  Dinamarca: "🇩🇰", Austria: "🇦🇹", Turquía: "🇹🇷",
  Ucrania: "🇺🇦", Japón: "🇯🇵", "Corea del Sur": "🇰🇷",
  Australia: "🇦🇺", "Arabia Saudí": "🇸🇦", Irán: "🇮🇷",
  Marruecos: "🇲🇦", Senegal: "🇸🇳", Nigeria: "🇳🇬",
  Ghana: "🇬🇭", Argelia: "🇩🇿", Túnez: "🇹🇳",
  Egipto: "🇪🇬", "Costa de Marfil": "🇨🇮", Camerún: "🇨🇲",
  Sudáfrica: "🇿🇦", "Nueva Zelanda": "🇳🇿", Qatar: "🇶🇦",
}

export const PHASES = [
  { key: "grupos",         label: "Grupos" },
  { key: "r32",            label: "Ronda 32" },
  { key: "octavos",        label: "Octavos" },
  { key: "cuartos",        label: "Cuartos" },
  { key: "semifinal",      label: "Semifinal" },
  { key: "tercer_puesto",  label: "3° Puesto" },
  { key: "final",          label: "Final" },
] as const

export type Phase = (typeof PHASES)[number]["key"]

/**
 * Un partido se considera cerrado a pronósticos si:
 *   - el admin lo cerró manualmente (is_closed = true), o
 *   - ya pasó el horario de inicio (match_date <= now).
 * El backend tiene la misma regla en RLS — la UI replica para feedback inmediato.
 */
export function isMatchClosed(
  match: { is_closed: boolean; match_date: string },
  now: number = Date.now()
): boolean {
  if (match.is_closed) return true
  return new Date(match.match_date).getTime() <= now
}

export function calcPoints(
  pred: { home_score: number; away_score: number },
  match: { home_score: number | null; away_score: number | null }
): number | null {
  if (match.home_score == null || match.away_score == null) return null
  if (
    pred.home_score === match.home_score &&
    pred.away_score === match.away_score
  )
    return 3
  const pOut =
    pred.home_score > pred.away_score
      ? "H"
      : pred.home_score < pred.away_score
        ? "A"
        : "D"
  const mOut =
    match.home_score > match.away_score
      ? "H"
      : match.home_score < match.away_score
        ? "A"
        : "D"
  return pOut === mOut ? 1 : 0
}

const MONTHS_AR = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

export function formatMatchDate(dateStr: string) {
  const d = new Date(dateStr)
  // Forzamos timezone Argentina (UTC-3) de forma determinista para evitar
  // mismatches de hidratación entre server (UTC) y client (locale).
  const arDate = new Date(d.getTime() - 3 * 60 * 60 * 1000)
  const day = arDate.getUTCDate()
  const month = MONTHS_AR[arDate.getUTCMonth()]
  const hh = arDate.getUTCHours().toString().padStart(2, "0")
  const mm = arDate.getUTCMinutes().toString().padStart(2, "0")
  return `${day} ${month} · ${hh}:${mm} hs`
}

export function flag(team: string) {
  return FLAGS[team] ?? ""
}

export function buildLeaderboard(
  predictions: ProdePrediction[],
  matches: ProdeMatch[]
) {
  const matchMap = new Map(matches.map((m) => [m.id, m]))
  const scoreMap = new Map<string, { points: number; exact: number; correct: number; preds: number }>()

  for (const p of predictions) {
    const match = matchMap.get(p.match_id)
    if (!match) continue
    const points = calcPoints(p, match)
    const stats = scoreMap.get(p.user_id) ?? {
      points: 0, exact: 0, correct: 0, preds: 0,
    }
    scoreMap.set(p.user_id, {
      points: stats.points + (points ?? 0),
      exact: stats.exact + (points === 3 ? 1 : 0),
      correct: stats.correct + (points === 1 ? 1 : 0),
      preds: stats.preds + 1,
    })
  }
  return scoreMap
}
