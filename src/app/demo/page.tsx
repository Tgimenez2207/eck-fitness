import { Navbar } from "@/components/Navbar"
import { DemoClient } from "./DemoClient"
import { MOCK_MATCHES, MOCK_LEADERBOARD } from "@/lib/mock-data"

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DemoClient
          matches={MOCK_MATCHES}
          baseLeaderboard={MOCK_LEADERBOARD}
        />
      </main>
    </>
  )
}
