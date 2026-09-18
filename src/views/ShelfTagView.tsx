import React, { useState, useMemo, useEffect, useRef } from "react"
import { type Product } from "@/data/products"
import { EnergyBadge, EnergyScale } from "@/components/ui/EnergyBadge"
import { QRCode } from "@/components/ui/QRCode"
import { getProductAdvice } from "@/components/ProductAdviceCard"
import { getConsumptionDisplay, getNoiseDisplay, type ThemeMode } from "@/lib/utils"
import {
  Printer,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Scissors,
  Wrench,
  Recycle,
  ShieldCheck,
  Zap,
  Package,
  Layers,
  Sliders,
  Info,
  Lightbulb,
  Accessibility,
} from "lucide-react"
import logoCycloIcon from "@/imports/Logo_Cyclo_Haut_Page.png"
import logoCyclo from "@/imports/Logo_Cyclo_Baniere.png"

export type TagFormat = "a6" | "a5" | "strip"
export type StyleTheme = "standard" | "light" | "eco" | "dark"

export function ShelfTagView({
  product,
  onBack,
  theme = "light",
  onAccessibility,
}: {
  product: Product
  onBack: () => void
  theme?: ThemeMode
  onAccessibility?: () => void
}) {
  // Thème d'affichage du studio directement piloté par le thème de l'application
  const studioTheme: "light" | "dark" = theme === "dark" ? "dark" : "light"

  // Données dérivées du produit
  const conso = useMemo(
    () => getConsumptionDisplay(product.category, product.consumption),
    [product],
  )
  const noise = useMemo(
    () => getNoiseDisplay(product.category, product.noise),
    [product],
  )
  const advice = useMemo(() => getProductAdvice(product), [product])

  // Conseil éco-usage consommateur par défaut
  const defaultConsumerTip = useMemo(() => {
    if (advice.usageTips && advice.usageTips.length > 0) {
      return `${advice.usageTips[0].title} : ${advice.usageTips[0].description}`
    }
    return (
      advice.paradoxTakeaway ||
      "Privilégiez les cycles et modes Éco pour réduire la facture d'énergie et prolonger la durée de vie de l'appareil."
    )
  }, [advice])

  // ─── États du Studio d'Impression ──────────────────────────────────────────
  const [format, setFormat] = useState<TagFormat>("a6")
  const [styleTheme, setStyleTheme] = useState<StyleTheme>("standard")
  const [showPrice, setShowPrice] = useState<boolean>(true)
  const [customPrice, setCustomPrice] = useState<string>(product.price || "499 €")
  const [showCropMarks, setShowCropMarks] = useState<boolean>(false)
  const [showConsumerTip, setShowConsumerTip] = useState<boolean>(true)
  const [consumerTipText, setConsumerTipText] = useState<string>(defaultConsumerTip)
  const [mobileTab, setMobileTab] = useState<"preview" | "options">("preview")
  const [zoom, setZoom] = useState<number>(100)
  const [copiedToast, setCopiedToast] = useState<boolean>(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Ajustement automatique de l'échelle sur mobile pour que l'affiche tienne sans déborder
  useEffect(() => {
    const handleAutoFit = () => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        const targetW = format === "strip" ? 760 : format === "a5" ? 560 : 430
        const availableW = Math.max(260, window.innerWidth - 32)
        const fitZoom = Math.min(100, Math.floor((availableW / targetW) * 96))
        setZoom(Math.max(35, fitZoom))
      }
    }
    handleAutoFit()
    window.addEventListener("resize", handleAutoFit)
    return () => window.removeEventListener("resize", handleAutoFit)
  }, [format])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  // Copie de l'URL courte
  const handleCopyLink = async () => {
    const url = `https://cyclo.eu/p/${product.id}`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setCopiedToast(true)
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
        copyTimeoutRef.current = setTimeout(() => setCopiedToast(false), 2500)
      }
    } catch {
      // Ignorer silencieusement si la permission de presse-papier est refusée
    }
  }

  // Déclencheur d'impression natif
  const handlePrint = () => {
    window.print()
  }

  // ─── Thèmes de Couleurs de la Carte ──────────────────────────────────────
  const themeStyles = useMemo(() => {
    if (styleTheme === "light") {
      // Thème Clair / Blanc Épuré (Élégant, vert doux, économique en toner)
      return {
        headerBg: "#f0fdf4",
        headerText: "#064e3b",
        headerSub: "#047857",
        border: "#047857",
        accent: "#047857",
        badgeBg: "#d1fae5",
        badgeText: "#065f46",
        isHeaderLight: true,
      }
    }
    if (styleTheme === "eco") {
      return {
        headerBg: "#f8fafc",
        headerText: "#0f172a",
        headerSub: "#64748b",
        border: "#0f172a",
        accent: "#0f172a",
        badgeBg: "#e2e8f0",
        badgeText: "#0f172a",
        isHeaderLight: true,
      }
    }
    if (styleTheme === "dark") {
      return {
        headerBg: "#0f172a",
        headerText: "#f8fafc",
        headerSub: "#94a3b8",
        border: "#0f172a",
        accent: "#059669",
        badgeBg: "#1e293b",
        badgeText: "#34d399",
        isHeaderLight: false,
      }
    }
    // Standard Cyclo
    return {
      headerBg: "#065f46",
      headerText: "#ffffff",
      headerSub: "#a7f3d0",
      border: "#0f172a",
      accent: "#047857",
      badgeBg: "#ecfdf5",
      badgeText: "#047857",
      isHeaderLight: false,
    }
  }, [styleTheme])

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        studioTheme === "light"
          ? "bg-slate-100 text-slate-800"
          : "bg-slate-900 text-slate-100"
      }`}
    >
      {/* Style d'impression injecté pour garantir un rendu papier parfait */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .shelf-print-area {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            min-height: auto !important;
          }
          #printable-shelf-tag {
            box-shadow: none !important;
            transform: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ─── BARRE SUPÉRIEURE DU STUDIO (no-print) ────────────────────────── */}
      <header
        className={`no-print px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between gap-4 flex-wrap backdrop-blur-md border-b transition-colors duration-200 ${
          studioTheme === "light"
            ? "bg-white/95 border-slate-200 shadow-xs"
            : "bg-slate-950/90 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              studioTheme === "light"
                ? "text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-300 shadow-2xs"
                : "text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 shadow-xs"
            }`}
          >
            ← Retour fiche
          </button>
          <div
            className={`h-4 w-px hidden sm:block ${
              studioTheme === "light" ? "bg-slate-300" : "bg-slate-800"
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold tracking-wide ${
                  studioTheme === "light" ? "text-slate-900" : "text-white"
                }`}
              >
                Studio Fiche Rayon
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  studioTheme === "light"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}
              >
                ESPR 2024 Conforme
              </span>
            </div>
            <div
              className={`text-[11px] truncate max-w-[280px] sm:max-w-md ${
                studioTheme === "light" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {product.brand} {product.model} · Réf. {product.certRef}
            </div>
          </div>
        </div>

        {/* Boutons d'action centraux & d'export */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
          {/* Bouton Accessibilité */}
          <button
            onClick={onAccessibility}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              studioTheme === "light"
                ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs hover:border-emerald-300 hover:text-emerald-700"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-emerald-500/50 hover:text-white"
            }`}
            title="Options d'accessibilité et thèmes"
          >
            <Accessibility className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Accessibilité</span>
          </button>

          {/* Copier QR Code Link */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer relative ${
              studioTheme === "light"
                ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700"
            }`}
            title="Copier l'URL directe du QR code"
          >
            {copiedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold hidden sm:inline">Lien copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Lien QR code</span>
              </>
            )}
          </button>

          {/* Bouton d'impression principal */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer<span className="hidden sm:inline"> la Fiche</span></span>
            <span className="hidden md:inline-block text-[10px] bg-emerald-700/60 px-1.5 py-0.5 rounded text-emerald-200">
              Ctrl+P
            </span>
          </button>
        </div>
      </header>

      {/* ─── SÉLECTEUR D'ONGLETS MOBILE (no-print) ────────────────────────── */}
      <div
        className={`lg:hidden no-print border-b px-3 py-2 flex items-center gap-2 sticky top-[57px] z-20 ${
          studioTheme === "light"
            ? "bg-slate-100/95 backdrop-blur border-slate-200"
            : "bg-slate-900/95 backdrop-blur border-slate-800"
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "preview"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
              : studioTheme === "light"
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
          }`}
        >
          <Printer className="w-3.5 h-3.5 text-emerald-600" />
          <span>Aperçu de l'affiche</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("options")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "options"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
              : studioTheme === "light"
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-600" />
          <span>Options & Réglages</span>
        </button>
      </div>

      {/* ─── CORPS DU STUDIO : CONTROLES + ESPACE DE VISUALISATION ──────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* ─── PANNEAU LATÉRAL DE CONTRÔLE (no-print) ────────────────────── */}
        <aside
          className={`no-print w-full lg:w-80 border-b lg:border-b-0 lg:border-r p-5 space-y-6 overflow-y-auto ${
            mobileTab === "options" ? "block" : "hidden lg:block"
          } lg:max-h-[calc(100vh-60px)] flex-shrink-0 transition-colors duration-200 ${
            studioTheme === "light"
              ? "bg-white/85 border-slate-200 text-slate-800 shadow-xs"
              : "bg-slate-950/60 border-slate-800 text-slate-200"
          }`}
        >
          {/* Section 1 : Format de l'étiquette */}
          <div className="space-y-2.5">
            <div
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                studioTheme === "light" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <Layers
                className={`w-3.5 h-3.5 ${
                  studioTheme === "light" ? "text-emerald-700" : "text-emerald-400"
                }`}
              />
              <span>Format d'impression</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat("a6")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === "a6"
                    ? studioTheme === "light"
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-2xs ring-1 ring-emerald-600"
                      : "bg-emerald-500/15 border-emerald-500 text-white font-semibold"
                    : studioTheme === "light"
                      ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="font-bold text-xs">Format A6</div>
                <div
                  className={`text-[10px] ${
                    studioTheme === "light" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  105 × 148 mm
                </div>
                <div
                  className={`text-[9px] mt-1 font-semibold ${
                    studioTheme === "light"
                      ? "text-emerald-700"
                      : "text-emerald-400"
                  }`}
                >
                  Chevalet
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("a5")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === "a5"
                    ? studioTheme === "light"
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-2xs ring-1 ring-emerald-600"
                      : "bg-emerald-500/15 border-emerald-500 text-white font-semibold"
                    : studioTheme === "light"
                      ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="font-bold text-xs">Format A5</div>
                <div
                  className={`text-[10px] ${
                    studioTheme === "light" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  148 × 210 mm
                </div>
                <div
                  className={`text-[9px] mt-1 font-semibold ${
                    studioTheme === "light"
                      ? "text-emerald-700"
                      : "text-emerald-400"
                  }`}
                >
                  Kakemono
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("strip")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === "strip"
                    ? studioTheme === "light"
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-2xs ring-1 ring-emerald-600"
                      : "bg-emerald-500/15 border-emerald-500 text-white font-semibold"
                    : studioTheme === "light"
                      ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="font-bold text-xs">Bandeau</div>
                <div
                  className={`text-[10px] ${
                    studioTheme === "light" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  320 × 90 mm
                </div>
                <div
                  className={`text-[9px] mt-1 font-semibold ${
                    studioTheme === "light"
                      ? "text-emerald-700"
                      : "text-emerald-400"
                  }`}
                >
                  Réglette
                </div>
              </button>
            </div>
          </div>

          {/* Section 2 : Palette d'impression (Styles de Rendu) */}
          <div className="space-y-2.5">
            <div
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                studioTheme === "light" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <Sliders
                className={`w-3.5 h-3.5 ${
                  studioTheme === "light" ? "text-emerald-700" : "text-emerald-400"
                }`}
              />
              <span>Style de rendu de la carte</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: "standard",
                  label: "Émeraude",
                  desc: "Officiel Cyclo",
                },
                {
                  id: "light",
                  label: "Thème Clair",
                  desc: "Blanc & menthe",
                },
                {
                  id: "eco",
                  label: "Éco-Print",
                  desc: "Éco toner",
                },
                {
                  id: "dark",
                  label: "Ardoise",
                  desc: "Mode contrasté",
                },
              ].map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() => setStyleTheme(thm.id as StyleTheme)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    styleTheme === thm.id
                      ? "bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs ring-1 ring-emerald-700"
                      : studioTheme === "light"
                        ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-semibold">{thm.label}</div>
                  <div
                    className={`text-[9px] ${
                      styleTheme === thm.id ? "text-emerald-100" : "opacity-75"
                    }`}
                  >
                    {thm.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3 : Options d'affichage & Prix magasin */}
          <div
            className={`space-y-3 pt-2 border-t ${
              studioTheme === "light" ? "border-slate-200" : "border-slate-800"
            }`}
          >
            <div
              className={`text-[11px] font-bold uppercase tracking-wider ${
                studioTheme === "light" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Contenus & Repères
            </div>

            {/* Toggle Prix */}
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between text-xs cursor-pointer ${
                  studioTheme === "light" ? "text-slate-700" : "text-slate-300"
                }`}
              >
                <span>Afficher le prix de vente</span>
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  className="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                />
              </label>
              {showPrice && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] ${
                      studioTheme === "light"
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    Prix public :
                  </span>
                  <input
                    type="text"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className={`flex-1 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-500 border ${
                      studioTheme === "light"
                        ? "bg-white border-slate-300 text-slate-900"
                        : "bg-slate-900 border-slate-700 text-white"
                    }`}
                    placeholder="Ex: 599 €"
                  />
                </div>
              )}
            </div>

            {/* Toggle Repères de coupe */}
            <label
              className={`flex items-center justify-between text-xs cursor-pointer ${
                studioTheme === "light" ? "text-slate-700" : "text-slate-300"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Scissors
                  className={`w-3.5 h-3.5 ${
                    studioTheme === "light"
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                />
                <span>Traits de coupe massicot</span>
              </span>
              <input
                type="checkbox"
                checked={showCropMarks}
                onChange={(e) => setShowCropMarks(e.target.checked)}
                className="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
              />
            </label>

            {/* Option : Conseil pour le consommateur */}
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between text-xs cursor-pointer ${
                  studioTheme === "light" ? "text-slate-700" : "text-slate-300"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Lightbulb
                    className={`w-3.5 h-3.5 ${
                      studioTheme === "light"
                        ? "text-emerald-700"
                        : "text-emerald-400"
                    }`}
                  />
                  <span>Conseil pour le consommateur</span>
                </span>
                <input
                  type="checkbox"
                  checked={showConsumerTip}
                  onChange={(e) => setShowConsumerTip(e.target.checked)}
                  className="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                />
              </label>

              {showConsumerTip && (
                <div className="space-y-2 pl-5">
                  <textarea
                    value={consumerTipText}
                    onChange={(e) => setConsumerTipText(e.target.value)}
                    rows={2}
                    className={`w-full rounded-lg p-2 text-[11px] focus:outline-none focus:border-emerald-500 leading-relaxed resize-none border ${
                      studioTheme === "light"
                        ? "bg-white border-slate-300 text-slate-900"
                        : "bg-slate-900 border-slate-700 text-white"
                    }`}
                    placeholder="Conseil éco-usage à destination de l'acheteur..."
                  />
                  {advice.usageTips && advice.usageTips.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span
                        className={`text-[10px] ${
                          studioTheme === "light"
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        Idées :
                      </span>
                      {advice.usageTips.map((tip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setConsumerTipText(
                              `${tip.title} : ${tip.description}`,
                            )
                          }
                          className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-colors border ${
                            studioTheme === "light"
                              ? "text-emerald-800 hover:text-emerald-900 bg-emerald-50 border-emerald-200"
                              : "text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border-emerald-800/60"
                          }`}
                          title={tip.title}
                        >
                          Astuce {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 4 : Conseils d'impression */}
          <div
            className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
              studioTheme === "light"
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                : "bg-emerald-950/40 border-emerald-800/40 text-emerald-200/90"
            }`}
          >
            <div
              className={`font-bold flex items-center gap-1.5 ${
                studioTheme === "light"
                  ? "text-emerald-800"
                  : "text-emerald-300"
              }`}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Conseils d'impression magasin</span>
            </div>
            <p
              className={`text-[11px] leading-relaxed ${
                studioTheme === "light"
                  ? "text-emerald-900/80"
                  : "text-emerald-100/70"
              }`}
            >
              Utilisez un papier blanc 200 à 250 g/m² couché mat. Pour une découpe
              optimale, activez les traits de coupe massicot.
            </p>
          </div>
        </aside>

        {/* ─── ZONE CENTRALE DE PRÉVISUALISATION ──────────────────────────── */}
        <main
          className={`shelf-print-area flex-1 p-3 sm:p-6 lg:p-10 overflow-auto ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          } flex-col items-center justify-start sm:justify-center min-h-[400px] relative transition-colors duration-200 ${
            studioTheme === "light"
              ? "bg-slate-200/80"
              : "bg-slate-900/90"
          }`}
        >
          {/* Barre d'actions rapides sur mobile (Formats & Thèmes directs sans quitter l'aperçu) */}
          <div className="lg:hidden no-print w-full max-w-sm mb-3 flex flex-col gap-1.5">
            {/* Formats rapides */}
            <div
              className={`flex items-center justify-between p-1 rounded-xl border shadow-2xs ${
                studioTheme === "light"
                  ? "bg-white/90 backdrop-blur border-slate-300"
                  : "bg-slate-900/90 backdrop-blur border-slate-700"
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">Format :</span>
              <div className="flex items-center gap-1">
                {(["a6", "a5", "strip"] as TagFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      format === fmt
                        ? "bg-emerald-700 text-white shadow-xs"
                        : studioTheme === "light"
                          ? "text-slate-600 hover:bg-slate-100"
                          : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {fmt === "a6" ? "A6 Chevalet" : fmt === "a5" ? "A5 Affiche" : "Bandeau"}
                  </button>
                ))}
              </div>
            </div>

            {/* Thèmes rapides */}
            <div
              className={`flex items-center justify-between p-1 rounded-xl border shadow-2xs ${
                studioTheme === "light"
                  ? "bg-white/90 backdrop-blur border-slate-300"
                  : "bg-slate-900/90 backdrop-blur border-slate-700"
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">Style :</span>
              <div className="flex items-center gap-1">
                {[
                  { id: "standard", label: "Émeraude" },
                  { id: "light", label: "Clair" },
                  { id: "eco", label: "Éco" },
                  { id: "dark", label: "Ardoise" },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setStyleTheme(th.id as StyleTheme)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      styleTheme === th.id
                        ? "bg-emerald-700 text-white font-bold shadow-xs"
                        : studioTheme === "light"
                          ? "text-slate-600 hover:bg-slate-100"
                          : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contrôles de zoom flottants (no-print) */}
          <div
            className={`no-print fixed sm:absolute bottom-4 sm:bottom-5 right-4 sm:right-5 z-20 flex items-center gap-1 backdrop-blur-md px-2 py-1.5 rounded-xl border shadow-lg text-xs ${
              studioTheme === "light"
                ? "bg-white/95 border-slate-300 text-slate-700"
                : "bg-slate-950/80 border-slate-800 text-slate-300"
            }`}
          >
            <button
              onClick={() => setZoom((z) => Math.max(30, z - 10))}
              className={`p-1.5 rounded-lg cursor-pointer ${
                studioTheme === "light"
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Zoom arrière"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span
              className={`font-mono font-bold px-1.5 text-xs ${
                studioTheme === "light" ? "text-slate-800" : "text-slate-300"
              }`}
            >
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className={`p-1.5 rounded-lg cursor-pointer ${
                studioTheme === "light"
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Zoom avant"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  const targetW = format === "strip" ? 760 : format === "a5" ? 560 : 430
                  const fit = Math.min(100, Math.floor((Math.max(260, window.innerWidth - 32) / targetW) * 96))
                  setZoom(Math.max(35, fit))
                } else {
                  setZoom(100)
                }
              }}
              className={`p-1.5 rounded-lg cursor-pointer ml-1 ${
                studioTheme === "light"
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Ajuster à l'écran"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicateur d'échelle et format */}
          <div
            className={`no-print mb-3 hidden sm:flex items-center gap-3 text-xs ${
              studioTheme === "light" ? "text-slate-600" : "text-slate-400"
            }`}
          >
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                studioTheme === "light"
                  ? "bg-white border-slate-300 text-slate-700 shadow-2xs"
                  : "bg-slate-800/80 border-slate-700/60 text-slate-300"
              }`}
            >
              {format === "a6" && "Format A6 (105 × 148 mm)"}
              {format === "a5" && "Format A5 (148 × 210 mm)"}
              {format === "strip" && "Bandeau Linéaire (320 × 90 mm)"}
            </span>
            <span>·</span>
            <span>Échelle réelle d'impression</span>
          </div>

          {/* ─── CONTENEUR PLANCHE PAPIER AVEC REPÈRES ─────────────────────── */}
          <div
            className="transition-transform duration-200 origin-top flex items-center justify-center my-auto max-w-full pb-16 sm:pb-0"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div className="relative">
              {/* Traits de coupe d'imprimeur pro (Crop Marks) */}
              {showCropMarks && (
                <>
                  {/* Coin haut-gauche */}
                  <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-slate-400 pointer-events-none" />
                  {/* Coin haut-droit */}
                  <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-slate-400 pointer-events-none" />
                  {/* Coin bas-gauche */}
                  <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-slate-400 pointer-events-none" />
                  {/* Coin bas-droit */}
                  <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-slate-400 pointer-events-none" />
                </>
              )}

              <ShelfTagCore
                product={product}
                format={format}
                styleTheme={styleTheme}
                themeStyles={themeStyles}
                showPrice={showPrice}
                priceText={customPrice}
                showCropMarks={showCropMarks}
                showConsumerTip={showConsumerTip}
                consumerTipText={consumerTipText}
                conso={conso}
                noise={noise}
                advice={advice}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── COMPOSANT COEUR DE L'ÉTIQUETTE RAYON (Imprimable) ──────────────────────
function ShelfTagCore({
  product,
  format,
  styleTheme,
  themeStyles,
  showPrice,
  priceText,
  showCropMarks,
  showConsumerTip,
  consumerTipText,
  conso,
  noise,
  advice,
}: {
  product: Product
  format: TagFormat
  styleTheme: StyleTheme
  themeStyles: {
    headerBg: string
    headerText: string
    headerSub: string
    border: string
    accent: string
    badgeBg: string
    badgeText: string
    isHeaderLight?: boolean
  }
  showPrice: boolean
  priceText: string
  showCropMarks: boolean
  showConsumerTip: boolean
  consumerTipText: string
  conso: { label: string; value: string }
  noise: string
  advice: ReturnType<typeof getProductAdvice>
}) {
  // ─── VARIATION FORMAT BANDEAU LINÉAIRE (320 × 90 mm) ─────────────────────
  if (format === "strip") {
    return (
      <div
        id="printable-shelf-tag"
        className="bg-white text-slate-900 shadow-2xl relative overflow-hidden font-sans"
        style={{
          width: 760,
          border: `2px solid ${themeStyles.border}`,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* Bandeau supérieur décoratif */}
        <div
          className="h-2 w-full"
          style={{ background: themeStyles.headerBg }}
        />

        <div className="p-4 grid grid-cols-12 gap-4 items-center">
          {/* Col 1 : Identité & Marque (4 cols) */}
          <div className="col-span-4 border-r pr-4 border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <img
                src={logoCyclo}
                alt="Cyclo"
                className="h-5 w-auto object-contain"
              />
              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ESPR 2024
              </span>
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              {product.category}
            </div>
            <div className="font-black text-base text-slate-900 leading-tight">
              {product.brand} {product.model}
            </div>
            {showPrice && (
              <div
                className="text-lg font-black mt-1"
                style={{ color: themeStyles.accent }}
              >
                {priceText}{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  TTC
                </span>
              </div>
            )}
          </div>

          {/* Col 2 : Notations officielles (5 cols) */}
          <div className="col-span-5 border-r pr-4 border-slate-200 flex items-center justify-around gap-3">
            <div className="text-center">
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                Énergie EU
              </div>
              <EnergyBadge grade={product.energyGrade} size="md" />
            </div>

            <div className="text-center">
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                Réparabilité
              </div>
              <div
                className="font-black text-xl leading-none"
                style={{ color: themeStyles.accent }}
              >
                {(Number(product.repairability) || 0).toFixed(1)}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </div>
              <div className="text-[8px] text-slate-400 mt-0.5">Loi AGEC</div>
            </div>

            <div className="text-center">
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                Pièces
              </div>
              <div className="font-black text-xl leading-none text-slate-800">
                {product.spareParts}
                <span className="text-xs font-normal text-slate-400">ans</span>
              </div>
              <div className="text-[8px] text-slate-400 mt-0.5">Garanties</div>
            </div>
          </div>

          {/* Col 3 : QR Code Passeport Numérique (3 cols) */}
          <div className="col-span-3 flex items-center gap-3">
            <div className="border border-slate-300 rounded-lg p-1 bg-white flex-shrink-0 shadow-2xs">
              <QRCode size={46} value={`https://cyclo.eu/p/${product.id}`} />
            </div>
            <div className="text-[8px] text-slate-500 leading-tight">
              <div className="font-bold text-slate-800 uppercase">
                Passeport ACV
              </div>
              <div className="text-emerald-700 font-bold mt-0.5">
                cyclo.eu/p/{product.id}
              </div>
              <div className="text-slate-400 text-[7px] mt-1">
                EU ESPR 2024
              </div>
            </div>
          </div>

          {/* Ligne Conseil Consommateur Optionnelle */}
          {showConsumerTip && consumerTipText && (
            <div className="col-span-12 pt-2 mt-1 border-t border-slate-100 flex items-center gap-1.5 text-[8.5px] text-emerald-950">
              <Lightbulb className="w-3 h-3 text-emerald-700 flex-shrink-0" />
              <span className="font-bold uppercase tracking-wider text-emerald-800">
                Conseil éco-usage :
              </span>
              <span className="truncate text-slate-700">{consumerTipText}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── FORMAT A6 (105 × 148 mm) & FORMAT A5 (148 × 210 mm) ──────────────────
  const isA5 = format === "a5"
  const tagWidth = isA5 ? 560 : 430

  return (
    <div
      id="printable-shelf-tag"
      className="bg-white text-slate-900 shadow-2xl relative overflow-hidden font-sans select-none"
      style={{
        width: tagWidth,
        border: `2px solid ${themeStyles.border}`,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ─── 1. EN-TÊTE DE LA FICHE RAYON ──────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          background: themeStyles.headerBg,
          color: themeStyles.headerText,
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logoCyclo}
            alt="Cyclo"
            className={`h-7 sm:h-8 w-auto object-contain ${
              themeStyles.isHeaderLight ? "" : "brightness-0 invert"
            }`}
          />
          <div
            className="h-7 w-px"
            style={{
              backgroundColor: themeStyles.isHeaderLight
                ? "rgba(6, 78, 59, 0.25)"
                : "rgba(255, 255, 255, 0.25)",
            }}
          />

          <div>
            <div className="font-black text-xs sm:text-sm tracking-wide uppercase">
              FICHE CONFORMITÉ RAYON
            </div>
            <div
              className="text-[9px] font-semibold"
              style={{ color: themeStyles.headerSub }}
            >
              Norme EU ESPR 2024 · Décret FR 2021-1040
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className="text-[8px] uppercase tracking-wider"
            style={{ color: themeStyles.headerSub }}
          >
            Certif. EPREL
          </div>
          <div className="text-[10px] font-mono font-bold">
            {(product.certRef || "").slice(-8)}
          </div>
        </div>
      </div>

      {/* ─── 2. IDENTITÉ DU PRODUIT & NOTES OFFICIELLES ────────────────────── */}
      <div
        className="flex items-start justify-between gap-4 px-5 py-4 border-b-2"
        style={{ borderColor: themeStyles.border }}
      >
        {/* Gauche : Produit & Prix */}
        <div className="flex-1 min-w-0">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            {product.category}
          </div>
          <div className="font-black text-xl text-slate-900 leading-tight">
            {product.brand}
          </div>
          <div className="font-bold text-base text-slate-700 leading-tight truncate">
            {product.model}
          </div>
          <div className="text-[9px] text-slate-400 mt-1">
            Distribué par {product.supplier}
          </div>

          {/* Prix de vente en magasin si activé */}
          {showPrice && (
            <div className="mt-2.5 inline-flex items-baseline gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
              <span
                className="font-black text-xl leading-none"
                style={{ color: themeStyles.accent }}
              >
                {priceText}
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                TTC conseillé
              </span>
            </div>
          )}
        </div>

        {/* Droite : Les 2 scores officiels légaux */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          {/* Classe énergie */}
          <div className="text-center">
            <div className="text-[8px] text-slate-400 text-center mb-0.5 font-bold uppercase tracking-widest">
              Énergie EU
            </div>
            <EnergyBadge grade={product.energyGrade} size={isA5 ? "xl" : "lg"} />
          </div>

          {/* Indice de réparabilité */}
          <div className="text-center">
            <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
              Réparabilité
            </div>
            <div
              className="font-black text-2xl leading-none"
              style={{ color: themeStyles.accent }}
            >
              {(Number(product.repairability) || 0).toFixed(1)}
              <span className="text-xs font-normal text-slate-400">/10</span>
            </div>
            <div className="text-[8px] text-slate-400 font-medium mt-0.5">
              Loi AGEC certifiée
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2.BIS Si A5 : Échelle énergétique complète ───────────────────── */}
      {isA5 && (
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Positionnement sur l'échelle officielle EU 2021
          </div>
          <EnergyScale current={product.energyGrade} />
        </div>
      )}

      {/* ─── 3. GRILLE 4 QUADRANTS TECHNIQUES ─────────────────────────────── */}
      <div
        className="grid grid-cols-2"
        style={{ borderBottom: `2px solid ${themeStyles.border}` }}
      >
        {[
          {
            icon: <Wrench className="w-3.5 h-3.5 text-slate-700" />,
            title: "Démontage & Outils",
            items: [
              "Démontage sans outil propriétaire",
              "Documentation technique ouverte",
              `Score démontage : ${product.lca?.repairability ?? 80}%`,
            ],
          },
          {
            icon: <Package className="w-3.5 h-3.5 text-slate-700" />,
            title: "Pièces de rechange",
            items: [
              `Disponibles ${product.spareParts} ans d'origine`,
              "Réseau agréé & expédition rapide",
              `Taux recyclabilité : ${product.recyclability}%`,
            ],
          },
          {
            icon: <Zap className="w-3.5 h-3.5 text-slate-700" />,
            title: "Consommation & Bruit",
            items: [
              `Classe officielle : ${product.energyGrade}`,
              `${conso.label} : ${conso.value}`,
              `Niveau sonore : ${noise}`,
            ],
          },
          {
            icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />,
            title: "Garanties & Climat",
            items: [
              `Garantie constructeur : ${product.warranty} ans`,
              "Prise en charge SAV directe",
              `Empreinte carbone : ${product.carbon} kg CO₂`,
            ],
          },
        ].map((quad, i) => (
          <div
            key={i}
            className="p-3.5"
            style={{
              borderRight: i % 2 === 0 ? "1.5px solid #e2e8f0" : "none",
              borderBottom: i < 2 ? "1.5px solid #e2e8f0" : "none",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-slate-700">{quad.icon}</span>
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wide">
                {quad.title}
              </span>
            </div>
            <ul className="space-y-1">
              {quad.items.map((item, j) => (
                <li
                  key={j}
                  className="text-[9px] text-slate-600 flex items-start gap-1 leading-tight"
                >
                  <span
                    className="mt-px flex-shrink-0 font-bold"
                    style={{ color: themeStyles.accent }}
                  >
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ─── 4. INDICATEURS ACV NORMALISÉS ────────────────────────────────── */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Scores ACV certifiés (ISO 14040/44)
          </div>
          <div className="text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Audit Tiers ADEME
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            {
              label: "Fiabilité globale appareil",
              value: product.lca?.reliability ?? 75,
            },
            {
              label: "Facilité de démontage & SAV",
              value: product.lca?.repairability ?? 80,
            },
            {
              label: `Disponibilité pièces (${product.spareParts} ans)`,
              value: product.lca?.spareParts ?? 70,
            },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 w-44 flex-shrink-0 font-medium truncate">
                {bar.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${bar.value}%`,
                    background:
                      styleTheme === "eco"
                        ? "#0f172a"
                        : "linear-gradient(90deg, #047857, #10b981)",
                  }}
                />
              </div>
              <span className="text-[9px] font-bold text-slate-700 w-7 text-right">
                {bar.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4.BIS Conseil pour le Consommateur (Optionnel) ────────────────── */}
      {showConsumerTip && consumerTipText && (
        <div className="px-5 py-2.5 bg-emerald-50/90 border-b border-emerald-200/80 text-emerald-950 text-[9px] flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold uppercase tracking-wider text-emerald-800">
              Conseil éco-usage Cyclo :
            </span>{" "}
            <span className="text-emerald-900 leading-tight">
              {consumerTipText}
            </span>
          </div>
        </div>
      )}

      {/* ─── 5. PIED DE FICHE : PASSEPORT NUMÉRIQUE & QR CODE ─────────────── */}
      <div className="flex items-center gap-4 px-5 py-3.5 bg-white">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <div className="border-2 border-slate-800 rounded-lg p-1.5 bg-white shadow-2xs">
            <QRCode
              size={isA5 ? 64 : 52}
              value={`https://cyclo.eu/p/${product.id}`}
            />
          </div>
          <span className="text-[8px] font-black text-slate-700 uppercase tracking-wider mt-0.5">
            SCANNER
          </span>
        </div>

        {/* Explication QR Code */}
        <div className="flex-1 min-w-0">
          <div className="text-[9px] text-slate-600 leading-snug">
            Scannez pour accéder au{" "}
            <span className="font-bold text-slate-800">
              Passeport Numérique Circulaire
            </span>
            , aux pièces détachées d'origine et aux alternatives durables sur :
          </div>
          <div className="mt-1 font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
            cyclo.eu/p/{product.id}
          </div>
          <div className="mt-1 text-[7.5px] text-slate-400">
            Conforme Directive Green Claims UE · Tiers ADEME & INEC
          </div>
        </div>

        {/* Marque de conformité Cyclo */}
        <div className="text-right flex-shrink-0 flex flex-col items-end">
          <div className="text-[7.5px] text-slate-400 uppercase tracking-widest font-bold mb-1">
            Certification Officielle
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg shadow-2xs">
            <img
              src={logoCycloIcon}
              alt="Cyclo"
              className="h-4 w-auto object-contain"
            />
            <span className="text-[8.5px] font-black tracking-wider text-slate-800">
              CYCLO <span className="text-emerald-700">CONFORME</span>
            </span>
          </div>
          <div className="text-[7px] text-slate-400 mt-1 font-medium">
            Tiers indépendant agréé · ESPR
          </div>
        </div>
      </div>
    </div>
  )
}
export default ShelfTagView
