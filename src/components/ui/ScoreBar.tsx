import React from "react"

export const ScoreBar = React.memo(function ScoreBar({
  label,
  value,
  max = 100,
  color = "#047857",
  unit = "%",
}: {
  label: string
  value: number
  max?: number
  color?: string
  unit?: string
}) {
  const safeMax = typeof max === "number" && max > 0 ? max : 100
  const safeVal = typeof value === "number" && !isNaN(value) ? value : 0
  const pct = Math.min(100, Math.max(0, Math.round((safeVal / safeMax) * 100)))

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-label={label}
      aria-valuenow={safeVal}
      aria-valuemin={0}
      aria-valuemax={safeMax}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>
          {safeVal}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
})

export const RepairabilityScore = React.memo(function RepairabilityScore({
  score,
}: {
  score: number
}) {
  const safeScore = typeof score === "number" && !isNaN(score) ? score : 0
  const color =
    safeScore >= 8 ? "#047857" : safeScore >= 6 ? "#f59e0b" : "#ef4444"
  return (
    <div className="flex items-end gap-1">
      <span className="font-black text-3xl leading-none" style={{ color }}>
        {safeScore.toFixed(1)}
      </span>
      <span className="text-slate-400 text-sm mb-0.5">/ 10</span>
    </div>
  )
})
