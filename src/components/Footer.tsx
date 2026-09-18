import React from "react"
import logoCyclo from "@/imports/Logo_Cyclo_Banière.png"
import { Leaf } from "lucide-react"

export function Footer() {
  const links = [
    "Mentions légales",
    "RGPD / CNIL",
    "API Docs",
    "Contact",
    "Sources EU",
  ]

  return (
    <footer className="bg-slate-900 py-10 px-4 sm:px-6 mt-16 no-print hidden sm:block">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <img
            src={logoCyclo}
            alt="Cyclo"
            className="h-8 w-auto object-contain brightness-0 invert opacity-85"
          />
        </div>
        <div className="flex flex-wrap gap-5 justify-center">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
        <div className="text-xs text-slate-600 text-center flex items-center justify-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Hébergé en France · Serveurs bas-carbone</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-600">
        © 2024 Cyclo SAS · Données : ADEME, Commission EU, INEC · Tous droits
        réservés
      </div>
    </footer>
  )
}

