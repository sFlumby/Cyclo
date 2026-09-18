import React, { useState, useEffect } from "react"
import { type Product, ALL_CATEGORIES } from "@/data/products"
import {
  ENERGY_CONFIG,
  ENERGY_GRADES_LIST,
  getConsumptionDisplay,
} from "@/lib/utils"
import { X, Trash2 } from "lucide-react"

export interface EditProductModalProps {
  product: Product
  onSave: (updated: Product) => void
  onClose: () => void
  onDelete?: (product: Product) => void
}

export function EditProductModal({
  product,
  onSave,
  onClose,
  onDelete,
}: EditProductModalProps) {
  const [form, setForm] = useState(() => ({
    ...product,
    lca: product.lca
      ? { ...product.lca }
      : { reliability: 75, repairability: 80, spareParts: 70 },
  }))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const set =
    (k: keyof Product) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val =
        e.target.type === "number"
          ? parseFloat(e.target.value) || 0
          : e.target.value
      setForm((f) => ({ ...f, [k]: val }))
    }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all placeholder-slate-400"
  const inputStyle = { border: "1px solid #e2e8f0" }
  const labelCls =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Modifier les caractéristiques"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full animate-scale-in my-auto"
        style={{ maxWidth: 560, padding: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
              Modifier les caractéristiques
            </h2>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              Corrigez les erreurs d'extraction avant sauvegarde
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all ml-4 flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 max-h-[62vh] overflow-y-auto pr-1">
          <div>
            <label className={labelCls}>Catégorie</label>
            <select
              value={form.category}
              onChange={set("category")}
              className={inputCls}
              style={inputStyle}
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Marque</label>
              <input
                type="text"
                value={form.brand}
                onChange={set("brand")}
                placeholder="ex: Samsung"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Modèle</label>
              <input
                type="text"
                value={form.model}
                onChange={set("model")}
                placeholder="ex: TQ55S90FAE"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Classe Énergie</label>
              <div className="relative">
                <select
                  value={form.energyGrade}
                  onChange={set("energyGrade")}
                  className={inputCls + " appearance-none pr-10"}
                  style={inputStyle}
                >
                  {ENERGY_GRADES_LIST.map((g) => (
                    <option key={g} value={g}>
                      Classe {g}
                    </option>
                  ))}
                </select>
                {form.energyGrade && (
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center text-xs font-black pointer-events-none"
                    style={{
                      background: ENERGY_CONFIG[form.energyGrade]?.bg,
                      color: ENERGY_CONFIG[form.energyGrade]?.text,
                    }}
                  >
                    {form.energyGrade}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls}>Réparabilité (/10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.repairability}
                onChange={set("repairability")}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                Consommation (
                {getConsumptionDisplay(form.category, form.consumption).label})
              </label>
              <input
                type="number"
                min="0"
                value={form.consumption}
                onChange={set("consumption")}
                placeholder="ex: 80"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Bruit (dB)</label>
              <input
                type="number"
                min="0"
                max="120"
                value={form.noise}
                onChange={set("noise")}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Prix public (€)</label>
              <input
                type="text"
                value={form.price}
                onChange={set("price")}
                placeholder="ex: 699 €"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-slate-100" />
              Scores ACV
              <span className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ["Fiabilité (%)", "reliability", 0, 100],
                  ["Démontage (%)", "repairability", 0, 100],
                  ["Pièces (ans)", "spareParts", 0, 20],
                ] as [
                  string,
                  "reliability" | "repairability" | "spareParts",
                  number,
                  number,
                ][]
              ).map(([label, key, min, max]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={
                      key === "reliability"
                        ? (form.lca?.reliability ?? 0)
                        : key === "repairability"
                          ? (form.lca?.repairability ?? 0)
                          : form.spareParts
                    }
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0
                      if (key === "reliability")
                        setForm((f) => ({
                          ...f,
                          lca: { ...f.lca, reliability: v },
                        }))
                      else if (key === "repairability")
                        setForm((f) => ({
                          ...f,
                          lca: { ...f.lca, repairability: v },
                        }))
                      else setForm((f) => ({ ...f, spareParts: v }))
                    }}
                    className={inputCls}
                    style={inputStyle}
                  />
                  <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{
                        width: `${
                          key === "reliability"
                            ? (form.lca?.reliability ?? 75)
                            : key === "repairability"
                              ? (form.lca?.repairability ?? 80)
                              : (form.spareParts ?? 5) * 5
                        }%`,
                        background: "#047857",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100">
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Supprimer le produit</span>
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(form)
                onClose()
              }}
              className="px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer"
              style={{
                background: "#047857",
                boxShadow: "0 4px 14px rgba(4,120,87,0.25)",
              }}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

