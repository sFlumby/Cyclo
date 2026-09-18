import React from "react"
import { Cookie, X } from "lucide-react"

export interface CookieBannerProps {
  onDismiss: () => void
}

export function CookieBanner({ onDismiss }: CookieBannerProps) {
  return (
    <div
      role="region"
      aria-label="Information sur les cookies et la conformité RGPD"
      className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 no-print animate-slide-up"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Cookie className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span className="font-bold text-slate-900 text-sm">
              Cookies & Données — CNIL / RGPD
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              Requis
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cyclo utilise uniquement des cookies strictement nécessaires au
            fonctionnement de la plateforme. Aucune donnée n'est transmise à des
            tiers.{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-emerald-700 underline hover:text-emerald-900"
            >
              Politique de confidentialité →
            </a>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 flex-wrap">
          <button
            onClick={onDismiss}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
            style={{ background: "#0f172a" }}
          >
            <X className="w-4 h-4" />
            <span>Continuer sans accepter</span>
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

