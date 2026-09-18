import React, { useState, useEffect } from "react"
import { type LoginTab } from "@/lib/utils"
import logoCyclo from "@/imports/Logo_Cyclo_Baniere.png"
import { User, Store, X } from "lucide-react"

export interface LoginModalProps {
  onClose: () => void
  initialTab?: LoginTab
}

export function LoginModal({
  onClose,
  initialTab = "b2c",
}: LoginModalProps) {
  const [tab, setTab] = useState<LoginTab>(initialTab || "b2c")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [siret, setSiret] = useState("")

  useEffect(() => {
    setTab(initialTab || "b2c")
  }, [initialTab])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,0.7)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Connexion à Cyclo"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-7">
          <img
            src={logoCyclo}
            alt="Cyclo"
            className="h-10 w-auto object-contain mb-2 login-logo dark:brightness-0 dark:invert transition-all"
          />
          <p className="text-xs text-slate-400">Plateforme ACV certifiée EU</p>
        </div>

        <div
          role="tablist"
          aria-label="Sélection du profil de connexion"
          className="flex rounded-xl border border-slate-200 p-1 mb-6 bg-slate-50"
        >
          {(
            [
              ["b2c", <User className="w-4 h-4" key="b2c-icon" />, "Profil Consommateur"],
              ["b2b", <Store className="w-4 h-4" key="b2b-icon" />, "Espace Magasin / Pro"],
            ] as [LoginTab, React.ReactNode, string][]
          ).map(([t, icon, label]) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              style={
                tab === t
                  ? {
                      background: "#047857",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(4,120,87,0.2)",
                    }
                  : { color: "#64748b" }
              }
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Adresse e-mail
              </label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  tab === "b2b" ? "contact@magasin.fr" : "vous@exemple.fr"
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all"
              />
            </div>
            {tab === "b2b" && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Code Enseigne ou SIRET
                </label>
                <input
                  type="text"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                  placeholder="Ex: FNAC-PRO ou 123 456 789 00012"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Votre accès sera validé sous 24h par notre équipe B2B.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #047857, #065f46)" }}
          >
            {tab === "b2c" ? "Se connecter" : "Accéder à l'Espace Magasin"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-emerald-700 transition-colors"
          >
            Mot de passe oublié ?
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-emerald-700 transition-colors"
          >
            Créer un compte
          </a>
        </div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

