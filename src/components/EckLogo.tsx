import Image from "next/image"
import { cn } from "@/lib/utils"

interface EckLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const SIZE_PX = {
  sm: 40,
  md: 56,
  lg: 96,
  xl: 144,
}

export function EckLogo({ className, size = "md" }: EckLogoProps) {
  const px = SIZE_PX[size]
  return (
    <Image
      src="/eck-logo.svg"
      alt="ECK Fitness"
      width={px}
      height={px}
      priority
      className={cn("object-contain", className)}
    />
  )
}
