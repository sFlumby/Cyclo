import React, { useEffect } from "react"
import { type Product } from "@/data/products"
import { Trash2 } from "lucide-react"

export interface DeleteConfirmModalProps {
  product: Product
  onConfirm: () => void
  onClose: () => void
}

export function DeleteConfirmModal({
  product,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const brand = product?.brand || "Cet appareil"
  const model = product?.model || ""

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirmer la suppression"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full animate-scale-in text-center"
        style={{ maxWidth: 420, padding: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#fee2e2" }}
          >
            <Trash2 className="w-8 h-8 text-rose-600" />
          </div>
        </div>

        <h3
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: 10,
          }}
        >
          Supprimer cet appareil ?
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 700 }}>
            {brand} {model}
          </span>{" "}
          sera définitivement supprimé de votre catalogue.
        </p>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 26 }}>
          Cette action est irréversible.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer"
            style={{
              background: "#ef4444",
              boxShadow: "0 4px 14px rgba(239,68,68,0.25)",
            }}
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  )
}

