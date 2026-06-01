import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Users, Zap, Award, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden gradient-mesh">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
            <div className="text-center max-w-3xl mx-auto slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="size-1.5 rounded-full bg-primary pulse-glow" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  Mundial 2026 · Edición Especial
                </span>
              </div>

              <h1 className="font-heading text-[44px] sm:text-[72px] leading-[0.95] tracking-tight mb-6 text-foreground">
                Prode
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  ECK Fitness
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
                Predecí los resultados del Mundial, competí contra el resto del
                gym y llevate los premios. Más motivación que tu pre-workout.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto px-8 group">
                    Empezá a jugar
                    <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/prode">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8"
                  >
                    Ver partidos
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-16 sm:mt-24 max-w-3xl mx-auto fade-in delay-2">
              {[
                { value: "48", label: "Selecciones" },
                { value: "104", label: "Partidos" },
                { value: "1°", label: "Premio" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-4 sm:p-6 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-sm"
                >
                  <div className="font-heading text-3xl sm:text-5xl text-foreground">
                    {s.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="border-t border-border/60 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
                Reglas claras
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl text-foreground">
                Cómo se juega
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Target,
                  title: "Pronosticá",
                  desc: "Ingresá tu resultado para cada partido antes del horario de inicio.",
                  delay: "delay-1",
                },
                {
                  icon: Trophy,
                  title: "Sumá puntos",
                  desc: "3 puntos si pegás el resultado exacto. 1 punto si acertás el ganador.",
                  delay: "delay-2",
                },
                {
                  icon: Award,
                  title: "Llevate el premio",
                  desc: "El top 3 del ranking se lleva premios ECK Fitness al cierre del torneo.",
                  delay: "delay-3",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className={`p-6 sm:p-7 rounded-2xl bg-card border border-border card-hover slide-up ${step.delay}`}
                >
                  <div className="size-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
                    <step.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="border-t border-border/60 py-20 sm:py-28 gradient-mesh">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 grid sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
                Más que un prode
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl text-foreground mb-5">
                Energía
                <br />
                de la comunidad
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Vivilo con el resto de los socios del gym. Un torneo paralelo
                durante toda la Copa, con tabla de posiciones en vivo y premios
                semanales sorpresa.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="px-8">
                  Activate
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, value: "200+", label: "Socios" },
                { icon: Zap, value: "Live", label: "Ranking" },
                { icon: Trophy, value: "1° 2° 3°", label: "Podios" },
                { icon: Award, value: "Free", label: "Inscripción" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl card-shine border border-primary/15"
                >
                  <item.icon className="size-5 text-accent mb-3 relative z-10" />
                  <div className="font-heading text-xl text-white relative z-10">
                    {item.value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-1 relative z-10">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="font-heading text-3xl sm:text-5xl text-foreground mb-4">
              ¿Listo para sumarte?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Registrate gratis con tu mail. Te toma 30 segundos y empezás a
              pronosticar al instante.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="px-10">
                Crear cuenta gratis
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm text-foreground tracking-wider">
              ECK FITNESS
            </span>
            <span className="opacity-60">© 2026</span>
          </div>
          <p>Prode Mundial 2026 · Edición de socios</p>
        </div>
      </footer>
    </>
  )
}
