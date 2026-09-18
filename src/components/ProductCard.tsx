import React from "react"
import { type Product } from "@/data/products"
import { CategoryIcon } from "@/components/ui/CategoryIcon"
import { EnergyBadge } from "@/components/ui/EnergyBadge"
import { RepairabilityScore } from "@/components/ui/ScoreBar"
import { Volume2, ShieldCheck, Euro, Wrench, Recycle } from "lucide-react"
import { getConsumptionDisplay, getNoiseDisplay } from "@/lib/utils"

export const ProductCard = React.memo(function ProductCard({
  product,
  onSelect,
}: {
  product: Product
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Consulter la fiche ${product.brand} ${product.model}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <CategoryIcon category={product.category} className="w-3 h-3" />
              {product.category}
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-tight mt-2 group-hover:text-emerald-800 transition-colors">
              {product.brand} {product.model}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{product.supplier}</p>
          </div>
          <EnergyBadge grade={product.energyGrade} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-emerald-100 transition-colors">
            <div className="text-[10px] text-slate-400 font-medium mb-1">
              Réparabilité
            </div>
            <RepairabilityScore score={product.repairability} />
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-emerald-100 transition-colors">
            <div className="text-[10px] text-slate-400 font-medium mb-1">
              Pièces détachées
            </div>
            <div className="font-black text-lg text-slate-800 leading-none">
              {product.spareParts}{" "}
              <span className="text-xs font-normal text-slate-400">ans</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            {getNoiseDisplay(product.category, product.noise)}
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            {product.warranty} ans garanti
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Euro className="w-3.5 h-3.5 text-slate-400" />
            {product.price}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 group-hover:bg-emerald-50/60 transition-colors flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-700 group-hover:text-emerald-900 transition-colors">
          Consulter la fiche ACV & alternatives
        </span>
        <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform text-xs">
          →
        </span>
      </div>
    </div>
  )
})
