import type { Metadata, Viewport } from "next"
import { Inter, Anton } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.URL /* Netlify */) ??
  "https://eck-fitness-prode.netlify.app"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "ECK FITNESS · Prode Mundial 2026",
  description: "Sumate al prode del Mundial 2026 de ECK FITNESS. Ganá premios prediciendo los resultados.",
  applicationName: "ECK FITNESS Prode",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "ECK Fitness Prode",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a1224",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${anton.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  )
}
