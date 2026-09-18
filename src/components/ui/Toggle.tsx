import React from "react"

export function Toggle({
  on,
  onChange,
  label,
  description,
}: {
  on: boolean
  onChange: () => void
  label: string
  description: string
}) {
  return (
    <div
      onClick={onChange}
      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer select-none hover:bg-slate-100/60 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-slate-800">{label}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              on
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {on ? "Activé" : "Inactif"}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation()
          onChange()
        }}
        className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 cursor-pointer"
        style={{ backgroundColor: on ? "#047857" : "#cbd5e1" }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
          style={{ transform: on ? "translateX(24px)" : "translateX(0)" }}
        />
      </button>
    </div>
  )
}
