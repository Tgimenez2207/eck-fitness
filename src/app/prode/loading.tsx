import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <Loader2 className="size-8 text-primary animate-spin" />
    </main>
  )
}
