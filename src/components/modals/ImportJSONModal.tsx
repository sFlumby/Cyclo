import React, { useState, useEffect, useRef } from "react"
import { type Product } from "@/data/products"
import { ENERGY_CONFIG, getEnergyConfig } from "@/lib/utils"
import { X, CheckCircle, Check } from "lucide-react"

export type ImportStep = "idle" | "loading" | "preview" | "saved"

export interface ImportJSONModalProps {
  onClose: () => void
  onAddToCatalog: (p: Product) => void
}

export function ImportJSONModal({
  onClose,
  onAddToCatalog,
}: ImportJSONModalProps) {
  const [step, setStep] = useState<ImportStep>("idle")
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [parsedProduct, setParsedProduct] = useState<Product | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [onClose])

  const numOr = (val: unknown, fallback: number): number => {
    const n = Number(val)
    return typeof val !== "undefined" && val !== null && !isNaN(n) ? n : fallback
  }

  const processFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setErrorMsg("Veuillez sélectionner un fichier .json.")
      return
    }

    setFileName(file.name)
    setFileSize(`${(file.size / 1024).toFixed(1)} Ko`)
    setStep("loading")
    setErrorMsg(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string
        const data = JSON.parse(raw)
        const p = Array.isArray(data) ? data[0] : data

        if (!p || !p.brand || !p.model) {
          throw new Error(
            "Le fichier ne contient pas les propriétés attendues (brand, model).",
          )
        }

        let priceStr = "N/C"
        if (typeof p.price === "number") {
          priceStr = `${p.price} €`
        } else if (typeof p.price === "string" && p.price.trim()) {
          priceStr = p.price.trim()
        }

        const validProduct: Product = {
          id: p.id || Date.now(),
          category: p.category || "Électroménager",
          brand: p.brand || "Marque",
          model: p.model || "Modèle",
          supplier: p.supplier || "Import certifié UE",
          energyGrade: String(p.energyGrade || "D").trim().toUpperCase(),
          repairability: numOr(p.repairability, 7.0),
          noise: numOr(p.noise, 0),
          warranty: numOr(p.warranty, 2),
          consumption: numOr(p.consumption, 0),
          weight: numOr(p.weight, 0),
          recyclability: numOr(p.recyclability, 80),
          spareParts: numOr(p.spareParts, 5),
          carbon: numOr(p.carbon, 200),
          lca: {
            reliability: numOr(p.lca?.reliability, 75),
            repairability: numOr(
              p.lca?.repairability,
              Math.round(numOr(p.repairability, 7.5) * 10),
            ),
            spareParts: numOr(p.lca?.spareParts, 70),
          },
          certRef: p.certRef || `EU-EPREL-${p.model}`,
          price: priceStr,
        }

        setParsedProduct(validProduct)
        setStep("preview")
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Fichier JSON invalide."
        setErrorMsg(message)
        setStep("idle")
      }
    }

    reader.onerror = () => {
      setErrorMsg("Impossible de lire ce fichier.")
      setStep("idle")
    }

    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleValidate = () => {
    if (parsedProduct) {
      onAddToCatalog(parsedProduct)
      setStep("saved")
      timeoutRef.current = setTimeout(() => {
        onClose()
      }, 1000)
    }
  }

  const showPreview =
    (step === "preview" || step === "saved") && parsedProduct !== null
  const energyCfg = parsedProduct
    ? getEnergyConfig(parsedProduct.energyGrade)
    : ENERGY_CONFIG["D"]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,0.60)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Importer un appareil au format JSON"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full animate-scale-in"
        style={{ maxWidth: 540, padding: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              Importer un appareil
            </h2>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              Fichier .json généré par le script d'extraction
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center">
            {errorMsg}
          </div>
        )}

        {!showPreview ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 py-8 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: isDragOver ? "#047857" : "#6ee7b7",
              background: isDragOver
                ? "rgba(4,120,87,0.06)"
                : "rgba(236,253,245,0.50)",
              minHeight: 168,
            }}
            onClick={() =>
              step === "idle" &&
              document.getElementById("json-file-input")?.click()
            }
          >
            <input
              id="json-file-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInput}
            />

            {step === "idle" && (
              <>
                <div className="relative mb-4">
                  <div
                    className="w-14 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center"
                    style={{ border: "1.5px solid #e2e8f0" }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-md text-white"
                    style={{ background: "#047857" }}
                  >
                    .json
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.5,
                    marginBottom: 4,
                  }}
                >
                  Glissez votre fichier{" "}
                  <span style={{ color: "#047857" }}>produit.json</span> ici
                  <br />
                  ou parcourez vos dossiers
                </p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>
                  Format standard Cyclo v1 (EPREL & AGEC)
                </p>
              </>
            )}

            {step === "loading" && (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
                  Lecture du fichier JSON…
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    fontFamily: "monospace",
                  }}
                >
                  {fileName}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 animate-fade-in"
            style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#065f46" }}>
              {fileName} ({fileSize}) validé · Sauvegarde locale prête
            </span>
          </div>
        )}

        {showPreview && parsedProduct && (
          <div
            className="mt-4 animate-fade-in"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Aperçu du produit importé
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#065f46",
                  background: "#d1fae5",
                  borderRadius: 999,
                  padding: "2px 10px",
                }}
              >
                {parsedProduct.category}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg"
                style={{
                  width: 44,
                  height: 44,
                  background: energyCfg.bg,
                  color: energyCfg.text,
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                {parsedProduct.energyGrade}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {parsedProduct.brand}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#475569",
                    lineHeight: 1.3,
                  }}
                >
                  {parsedProduct.model}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  {parsedProduct.certRef}
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div
                  style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}
                >
                  Réparabilité
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#047857",
                    lineHeight: 1,
                  }}
                >
                  {parsedProduct.repairability.toFixed(1)}
                  <span
                    style={{ fontSize: 12, fontWeight: 400, color: "#94a3b8" }}
                  >
                    /10
                  </span>
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-3"
              style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}
            >
              {[
                {
                  label: "Fiabilité",
                  value: `${parsedProduct.lca.reliability}%`,
                  bar: parsedProduct.lca.reliability,
                },
                {
                  label: "Démontage",
                  value: `${parsedProduct.lca.repairability}%`,
                  bar: parsedProduct.lca.repairability,
                },
                {
                  label: "Pièces",
                  value: `${parsedProduct.spareParts} ans`,
                  bar: Math.min(parsedProduct.spareParts * 8, 100),
                },
              ].map((col, i) => (
                <div
                  key={col.label}
                  className="flex flex-col gap-1.5 px-3"
                  style={{ borderLeft: i > 0 ? "1px solid #e2e8f0" : "none" }}
                >
                  <span
                    style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}
                  >
                    {col.label}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}
                  >
                    {col.value}
                  </span>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 99,
                      background: "#e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="bar-fill"
                      style={{
                        height: "100%",
                        borderRadius: 99,
                        width: `${col.bar}%`,
                        background: "#047857",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="flex items-center justify-end gap-3 mt-6 pt-5"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Annuler
          </button>

          {step === "saved" ? (
            <div className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 animate-fade-in flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Enregistré dans l'application</span>
            </div>
          ) : (
            <button
              onClick={handleValidate}
              disabled={!showPreview}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              style={{
                background: "#047857",
                boxShadow: showPreview
                  ? "0 4px 14px rgba(4,120,87,0.28)"
                  : "none",
              }}
            >
              Valider et enregistrer dans l'application →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

