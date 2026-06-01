export type Role = "user" | "admin"

export interface Profile {
  id: string
  name: string
  email: string | null
  role: Role
  member_number: string | null
  created_at: string
}

export type ProdePhase =
  | "grupos"
  | "r32"
  | "octavos"
  | "cuartos"
  | "semifinal"
  | "tercer_puesto"
  | "final"

export interface ProdeMatch {
  id: string
  phase: ProdePhase
  group_name: string | null
  home_team: string
  away_team: string
  match_date: string
  home_score: number | null
  away_score: number | null
  is_closed: boolean
  created_at: string
}

export interface ProdePrediction {
  id: string
  user_id: string
  match_id: string
  home_score: number
  away_score: number
  points: number | null
  created_at: string
}

export interface LeaderboardRow {
  userId: string
  name: string
  memberNumber: string | null
  points: number
  exact: number
  correct: number
  preds: number
}
