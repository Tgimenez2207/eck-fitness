"use client"

import { useEffect, useState } from "react"

/**
 * Devuelve `Date.now()` y se re-renderiza cada `intervalMs` milisegundos.
 * Usado para que los match cards pasen de "abierto" a "cerrado" sin necesidad
 * de refrescar la página cuando el partido empieza.
 *
 * En el primer render (server o cliente) devuelve `0`, así evitamos hydration
 * mismatch. El primer tick real ocurre apenas montamos.
 */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(0)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
