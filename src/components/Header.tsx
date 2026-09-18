import { useState } from "react"
import { type View, type LoginTab } from "@/lib/utils"
import { Accessibility } from "lucide-react"
import logoCyclo from "@/imports/Logo_Cyclo_Baniere.png"

export function Header({
  view,
  onHome,
  onResults,
  onShowAll,
  onLoginOpen,
  onAccessibility,
  onAddAppliance,
  onPreview,
}: {
  view: View
  onHome: () => void
  onResults: () => void
  onShowAll?: () => void
  onLoginOpen: (tab?: LoginTab) => void
  onAccessibility: () => void
  onAddAppliance: () => void
  onPreview?: () => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={onHome}
          aria-label="Accueil Cyclo"
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            src={logoCyclo}
            alt="Cyclo"
            className="h-9 w-auto object-contain"
          />
        </button>

        <nav className="hidden lg:flex items-center gap-7">
          <button
            onClick={onShowAll || onResults}
            className={`text-sm font-medium transition-colors ${
              view === "results"
                ? "text-emerald-700 font-semibold"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            Tous les appareils
          </button>
          <button
            onClick={() => onLoginOpen("b2b")}
            className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
          >
            Espace Magasins
          </button>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onAccessibility}
            className="text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-200 flex items-center gap-1.5"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Accessibilité</span>
          </button>
          <button
            onClick={() => onLoginOpen("b2c")}
            className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-all hover:scale-105 hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #047857, #065f46)" }}
          >
            Se connecter
          </button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu principal"
          aria-expanded={mobileOpen}
        >
          <div className="w-5 h-0.5 bg-current mb-1.5" />
          <div className="w-5 h-0.5 bg-current mb-1.5" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-3 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-2 pb-3 mb-1 border-b border-slate-100">
            <img
              src={logoCyclo}
              alt="Cyclo"
              className="h-6 w-auto object-contain"
            />
            <span className="text-xs text-slate-400 font-medium">
              Navigation
            </span>
          </div>
          {([
            ["Tous les appareils", onShowAll || onResults],
            ["Espace Magasins", () => onLoginOpen("b2b")],
          ] as [string, () => void][]).map(([label, fn]) => (
            <button
              key={label}
              onClick={() => {
                fn()
                setMobileOpen(false)
              }}
              className="text-sm font-medium text-slate-700 py-2 text-left border-b border-slate-50"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              onAccessibility()
              setMobileOpen(false)
            }}
            className="text-sm font-medium text-slate-700 py-2 text-left border-b border-slate-50 flex items-center gap-2"
          >
            <Accessibility className="w-4 h-4 text-emerald-700" />
            <span>Accessibilité</span>
          </button>
          <button
            onClick={() => {
              onLoginOpen("b2c")
              setMobileOpen(false)
            }}
            className="mt-1 text-sm font-bold px-4 py-2.5 rounded-xl text-white text-center"
            style={{ background: "#047857" }}
          >
            Se connecter
          </button>
        </div>
      )}
    </header>
  )
}
