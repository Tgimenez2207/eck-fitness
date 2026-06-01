import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import {
  Target, Trophy, Award, Calendar, Lock, Scale,
  ChevronRight, AlertCircle,
} from "lucide-react"

export const metadata = {
  title: "Reglamento · Prode ECK FITNESS",
  description: "Cómo se juega el Prode Mundial 2026 de ECK FITNESS: puntos, fechas, premios y desempates.",
}

const RULES = [
  {
    icon: Target,
    title: "3 puntos · Resultado exacto",
    desc: "Si tu pronóstico coincide exactamente con el resultado final. Ej: pronosticás 2-1 y termina 2-1.",
  },
  {
    icon: Trophy,
    title: "1 punto · Ganador correcto",
    desc: "Si acertás quién gana (o empate) pero no el resultado exacto. Ej: pronosticás 3-1 y termina 2-0.",
  },
  {
    icon: AlertCircle,
    title: "0 puntos · Mal",
    desc: "Si te equivocás de ganador o pronosticabas empate y no fue empate.",
  },
]

const SCHEDULE = [
  { dates: "11 - 27 jun", phase: "Fase de Grupos", matches: "72 partidos" },
  { dates: "28 jun - 03 jul", phase: "Ronda de 32", matches: "16 partidos" },
  { dates: "04 - 07 jul", phase: "Octavos", matches: "8 partidos" },
  { dates: "09 - 11 jul", phase: "Cuartos", matches: "4 partidos" },
  { dates: "14 - 15 jul", phase: "Semifinales", matches: "2 partidos" },
  { dates: "18 jul", phase: "3° Puesto", matches: "1 partido" },
  { dates: "19 jul", phase: "Final", matches: "1 partido" },
]

const PRIZES = [
  { rank: "1°", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    prize: "3 meses de membresía premium + remera ECK Fitness + suplementos" },
  { rank: "2°", color: "text-slate-300 border-slate-300/30 bg-slate-300/5",
    prize: "1 mes de membresía + remera ECK Fitness" },
  { rank: "3°", color: "text-amber-600 border-amber-600/30 bg-amber-600/5",
    prize: "Remera ECK Fitness + sesión personalizada con entrenador" },
]

const TIEBREAKERS = [
  "Mayor cantidad de resultados exactos (de 3 puntos).",
  "Mayor cantidad de pronósticos hechos (más participación).",
  "Quien haya cargado primero su pronóstico de la final.",
]

const FAQS = [
  {
    q: "¿Hasta cuándo puedo cargar pronósticos?",
    a: "Hasta el horario de inicio de cada partido. Apenas suena la hora se cierra automáticamente y no se aceptan ediciones.",
  },
  {
    q: "¿Puedo cambiar mi pronóstico antes de que empiece?",
    a: "Sí, todas las veces que quieras hasta el cierre.",
  },
  {
    q: "¿Qué pasa con los partidos que se definen por penales?",
    a: "Cuenta el resultado del tiempo reglamentario (90' o 120' si hubo alargue). El score de penales no entra en el cómputo.",
  },
  {
    q: "¿Es gratis?",
    a: "Sí, 100% gratis para socios y no socios del gym.",
  },
  {
    q: "¿Cómo me entero si gané?",
    a: "Te avisamos por mail cuando termine la final. Los premios se entregan en recepción del gym.",
  },
]

export default function ReglamentoPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/60 gradient-mesh">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-12 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Scale className="size-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                Reglamento Oficial
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl text-foreground mb-3">
              Cómo se
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                juega el prode
              </span>
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Reglas claras, premios reales. Todo lo que tenés que saber para
              competir en el prode del Mundial 2026 ECK Fitness.
            </p>
          </div>
        </section>

        {/* Puntaje */}
        <section className="py-16 sm:py-20 border-b border-border/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-8">
              <Target className="size-5 text-primary" />
              <h2 className="font-heading text-2xl text-foreground">
                Sistema de puntaje
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {RULES.map((r) => (
                <div
                  key={r.title}
                  className="p-6 rounded-2xl bg-card border border-border card-hover"
                >
                  <div className="size-10 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center mb-4">
                    <r.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-base">
                    {r.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calendario */}
        <section className="py-16 sm:py-20 border-b border-border/60 gradient-mesh">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-8">
              <Calendar className="size-5 text-primary" />
              <h2 className="font-heading text-2xl text-foreground">
                Calendario
              </h2>
            </div>
            <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border/60">
              {SCHEDULE.map((s) => (
                <div
                  key={s.phase}
                  className="flex items-center justify-between p-4 sm:p-5"
                >
                  <div>
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      {s.phase}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.matches}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary text-right">
                    {s.dates}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premios */}
        <section className="py-16 sm:py-20 border-b border-border/60">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-8">
              <Award className="size-5 text-primary" />
              <h2 className="font-heading text-2xl text-foreground">Premios</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {PRIZES.map((p) => (
                <div
                  key={p.rank}
                  className={`p-6 rounded-2xl border ${p.color}`}
                >
                  <div
                    className={`font-heading text-5xl mb-3 ${p.color.split(" ")[0]}`}
                  >
                    {p.rank}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {p.prize}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              Premios sujetos a confirmación al cierre del torneo. Se entregan
              en recepción del gym.
            </p>
          </div>
        </section>

        {/* Cierre + desempate */}
        <section className="py-16 sm:py-20 border-b border-border/60 gradient-mesh">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="size-4 text-primary" />
                <h3 className="font-heading text-lg text-foreground">
                  Cierre de pronósticos
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  Cada partido cierra automáticamente al horario de inicio.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  Podés editar tu pronóstico todas las veces que quieras antes
                  del cierre.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  El admin puede cerrar pronósticos antes del horario si hay
                  alguna situación excepcional.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="size-4 text-primary" />
                <h3 className="font-heading text-lg text-foreground">
                  Desempate
                </h3>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground list-none">
                {TIEBREAKERS.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-heading text-primary shrink-0">
                      {i + 1}°
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-heading text-2xl text-foreground mb-8">
              Preguntas frecuentes
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <div
                  key={f.q}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <p className="font-bold text-foreground text-sm mb-2">
                    {f.q}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/auth/register">
                <Button size="lg" className="px-8">
                  Crear cuenta y jugar
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-heading text-sm text-foreground tracking-wider">
            ECK FITNESS · 2026
          </span>
          <p>Reglamento sujeto a cambios. Última actualización: jun 2026.</p>
        </div>
      </footer>
    </>
  )
}
