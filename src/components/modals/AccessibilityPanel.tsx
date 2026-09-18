import React, { useEffect } from "react"
import { Accessibility, X, Sun, Contrast, Moon, Check } from "lucide-react"
import { Toggle } from "@/components/ui/Toggle"
import { type ThemeMode } from "@/lib/utils"

export interface AccessibilityPanelProps {
  open: boolean
  onClose: () => void
  theme: ThemeMode
  setTheme: (v: ThemeMode) => void
  dyslexic: boolean
  setDyslexic: (v: boolean) => void
  largeText: boolean
  setLargeText: (v: boolean) => void
}

export function AccessibilityPanel({
  open,
  onClose,
  theme,
  setTheme,
  dyslexic,
  setDyslexic,
  largeText,
  setLargeText,
}: AccessibilityPanelProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 no-print"
      style={{ background: "rgba(15,23,42,0.6)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Options d'accessibilité"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-slide-up border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-emerald-700" />
              <span>Accessibilité</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Options d'affichage, thème et lecture
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 leading-none p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Sélecteur de Thème Visuel ───────────────────────────────────── */}
        <div className="mb-5 pb-5 border-b border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Thème visuel
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Clair Standard */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
              className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                theme === "light"
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center mb-1.5 text-amber-500">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-xs">Clair</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Standard
              </span>
              {theme === "light" && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>

            {/* 2. Clair Contrasté */}
            <button
              type="button"
              onClick={() => setTheme("contrast")}
              aria-pressed={theme === "contrast"}
              className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                theme === "contrast"
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-700 shadow-2xs flex items-center justify-center mb-1.5 text-slate-800">
                <Contrast className="w-4 h-4" />
              </div>
              <span className="text-xs">Contrasté</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Gris & Blancs
              </span>
              {theme === "contrast" && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>

            {/* 3. Sombre */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
              className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                theme === "dark"
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 shadow-2xs flex items-center justify-center mb-1.5 text-blue-300">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-xs">Sombre</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Mode nuit
              </span>
              {theme === "dark" && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ─── Options Typographie & Lecture ───────────────────────────────── */}
        <div className="space-y-3">
          <Toggle
            on={dyslexic}
            onChange={() => setDyslexic(!dyslexic)}
            label="Police OpenDyslexic"
            description="Typographie adaptée pour faciliter la lecture pour les personnes dyslexiques."
          />
          <Toggle
            on={largeText}
            onChange={() => setLargeText(!largeText)}
            label="Texte agrandi (+25%)"
            description="Augmente la taille de base du texte sur toute l'interface."
          />
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          Cyclo respecte les normes d'accessibilité WCAG 2.1 (AA / AAA)
        </div>
      </div>
    </div>
  )
}
