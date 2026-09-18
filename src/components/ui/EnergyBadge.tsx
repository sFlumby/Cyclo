import React from "react"
import { ENERGY_CONFIG } from "@/lib/utils"
export { ENERGY_CONFIG }

const BADGE_SIZES = {
  sm: "text-sm px-2 py-0.5 min-w-[36px]",
  md: "text-base px-3 py-1 min-w-[48px]",
  lg: "text-2xl px-4 py-2 min-w-[64px]",
  xl: "text-4xl px-6 py-3 min-w-[88px]",
} as const

export const EnergyBadge = React.memo(function EnergyBadge({
  grade,
  size = "md",
}: {
  grade: string
  size?: "sm" | "md" | "lg" | "xl"
}) {
  const normalizedGrade = (grade || "D").trim().toUpperCase()
  const cfg = ENERGY_CONFIG[normalizedGrade] ?? ENERGY_CONFIG["D"]
  return (
    <div
      role="img"
      aria-label={`Classe énergétique ${normalizedGrade}`}
      className={`energy-arrow inline-flex items-center justify-center font-black rounded-l-sm ${BADGE_SIZES[size]}`}
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {normalizedGrade}
    </div>
  )
})

const SCALE_GRADES = ["A", "B", "C", "D", "E", "F", "G"] as const
const SCALE_WIDTHS = ["62%", "68%", "74%", "80%", "86%", "92%", "100%"] as const

export const EnergyScale = React.memo(function EnergyScale({ current }: { current: string }) {
  const normCurrent = (current || "").trim().toUpperCase()
  return (
    <div
      className="flex flex-col gap-0.5 w-full"
      role="img"
      aria-label={`Échelle énergétique européenne, classe actuelle : ${normCurrent || "Non spécifiée"}`}
    >
      {SCALE_GRADES.map((g, i) => {
        const cfg = ENERGY_CONFIG[g] ?? ENERGY_CONFIG["D"]
        const active = g === normCurrent
        return (
          <div key={g} className="flex items-center gap-1">
            <div
              className="energy-arrow flex items-center justify-between pr-3 pl-2 rounded-l-sm text-xs font-black transition-all duration-300"
              style={{
                width: SCALE_WIDTHS[i],
                height: active ? 20 : 14,
                backgroundColor: cfg.bg,
                color: cfg.text,
                opacity: active ? 1 : 0.5,
                transform: active ? "scaleX(1.04)" : "scaleX(1)",
              }}
            >
              <span>{g}</span>
              {active && <span className="ml-2 text-[10px]">◀</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
})
