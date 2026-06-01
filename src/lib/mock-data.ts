import type { ProdeMatch } from "@/types/database"

const baseDate = "2026-06-"

function iso(day: number, hour: number, min = 0) {
  const d = day.toString().padStart(2, "0")
  const h = hour.toString().padStart(2, "0")
  const m = min.toString().padStart(2, "0")
  return `2026-06-${d}T${h}:${m}:00.000-03:00`
}

export const MOCK_MATCHES: ProdeMatch[] = [
  // Grupo A
  { id: "m1",  phase: "grupos", group_name: "A", home_team: "México",    away_team: "Canadá",        match_date: iso(11, 21), home_score: 2, away_score: 1, is_closed: true,  created_at: baseDate },
  { id: "m2",  phase: "grupos", group_name: "A", home_team: "EEUU",      away_team: "Jamaica",       match_date: iso(12, 21), home_score: 3, away_score: 0, is_closed: true,  created_at: baseDate },
  { id: "m3",  phase: "grupos", group_name: "A", home_team: "México",    away_team: "Jamaica",       match_date: iso(16, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m4",  phase: "grupos", group_name: "A", home_team: "EEUU",      away_team: "Canadá",        match_date: iso(17, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Grupo B
  { id: "m5",  phase: "grupos", group_name: "B", home_team: "Argentina", away_team: "Marruecos",     match_date: iso(13, 18), home_score: 2, away_score: 0, is_closed: true,  created_at: baseDate },
  { id: "m6",  phase: "grupos", group_name: "B", home_team: "España",    away_team: "Senegal",       match_date: iso(13, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m7",  phase: "grupos", group_name: "B", home_team: "Argentina", away_team: "España",        match_date: iso(18, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m8",  phase: "grupos", group_name: "B", home_team: "Marruecos", away_team: "Senegal",       match_date: iso(18, 18), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Grupo C
  { id: "m9",  phase: "grupos", group_name: "C", home_team: "Brasil",    away_team: "Japón",         match_date: iso(14, 18), home_score: 1, away_score: 1, is_closed: true,  created_at: baseDate },
  { id: "m10", phase: "grupos", group_name: "C", home_team: "Francia",   away_team: "Nigeria",       match_date: iso(14, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m11", phase: "grupos", group_name: "C", home_team: "Brasil",    away_team: "Nigeria",       match_date: iso(19, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m12", phase: "grupos", group_name: "C", home_team: "Francia",   away_team: "Japón",         match_date: iso(19, 18), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Grupo D
  { id: "m13", phase: "grupos", group_name: "D", home_team: "Uruguay",   away_team: "Ecuador",       match_date: iso(15, 18), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m14", phase: "grupos", group_name: "D", home_team: "Portugal",  away_team: "Corea del Sur", match_date: iso(15, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m15", phase: "grupos", group_name: "D", home_team: "Uruguay",   away_team: "Portugal",      match_date: iso(20, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m16", phase: "grupos", group_name: "D", home_team: "Ecuador",   away_team: "Corea del Sur", match_date: iso(20, 18), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Grupo E
  { id: "m17", phase: "grupos", group_name: "E", home_team: "Alemania",  away_team: "Australia",     match_date: iso(15, 12), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m18", phase: "grupos", group_name: "E", home_team: "Inglaterra",away_team: "Túnez",         match_date: iso(15, 15), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m19", phase: "grupos", group_name: "E", home_team: "Alemania",  away_team: "Inglaterra",    match_date: iso(20, 12), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m20", phase: "grupos", group_name: "E", home_team: "Australia", away_team: "Túnez",         match_date: iso(20, 15), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Grupo F
  { id: "m21", phase: "grupos", group_name: "F", home_team: "Colombia",  away_team: "Egipto",        match_date: iso(16, 12), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m22", phase: "grupos", group_name: "F", home_team: "Países Bajos", away_team: "Irán",       match_date: iso(16, 15), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m23", phase: "grupos", group_name: "F", home_team: "Colombia",  away_team: "Países Bajos",  match_date: iso(21, 12), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m24", phase: "grupos", group_name: "F", home_team: "Egipto",    away_team: "Irán",          match_date: iso(21, 15), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Octavos
  { id: "m25", phase: "octavos", group_name: null, home_team: "1° A",  away_team: "2° B",  match_date: iso(28, 16), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m26", phase: "octavos", group_name: null, home_team: "1° C",  away_team: "2° D",  match_date: iso(28, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m27", phase: "octavos", group_name: null, home_team: "1° E",  away_team: "2° F",  match_date: iso(29, 16), home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m28", phase: "octavos", group_name: null, home_team: "1° B",  away_team: "2° A",  match_date: iso(29, 21), home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Cuartos
  { id: "m29", phase: "cuartos", group_name: null, home_team: "Ganador O1", away_team: "Ganador O3", match_date: "2026-07-04T16:00:00.000-03:00", home_score: null, away_score: null, is_closed: false, created_at: baseDate },
  { id: "m30", phase: "cuartos", group_name: null, home_team: "Ganador O2", away_team: "Ganador O4", match_date: "2026-07-04T21:00:00.000-03:00", home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Semifinal
  { id: "m31", phase: "semifinal", group_name: null, home_team: "Ganador C1", away_team: "Ganador C2", match_date: "2026-07-08T16:00:00.000-03:00", home_score: null, away_score: null, is_closed: false, created_at: baseDate },

  // Final
  { id: "m32", phase: "final", group_name: null, home_team: "Finalista 1", away_team: "Finalista 2", match_date: "2026-07-19T17:00:00.000-03:00", home_score: null, away_score: null, is_closed: false, created_at: baseDate },
]

export const MOCK_LEADERBOARD = [
  { userId: "demo-1", name: "Sofi Pérez",     memberNumber: "0142", points: 14, exact: 3, correct: 5, preds: 8 },
  { userId: "demo-2", name: "Bruno Lacuesta", memberNumber: "0087", points: 12, exact: 2, correct: 6, preds: 8 },
  { userId: "demo-3", name: "Mateo Iriarte",  memberNumber: "0211", points: 9,  exact: 2, correct: 3, preds: 7 },
  { userId: "demo-4", name: "Lucía Romero",   memberNumber: null,    points: 7,  exact: 1, correct: 4, preds: 8 },
  { userId: "demo-5", name: "Tomi Salinas",   memberNumber: "0099", points: 4,  exact: 0, correct: 4, preds: 6 },
]
