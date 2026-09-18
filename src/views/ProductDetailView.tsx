import React, { useState, useMemo } from "react"
import { PRODUCTS, ALTERNATIVES, type Product } from "@/data/products"
import { CategoryIcon } from "@/components/ui/CategoryIcon"
import { EnergyBadge, EnergyScale } from "@/components/ui/EnergyBadge"
import { ScoreBar, RepairabilityScore } from "@/components/ui/ScoreBar"
import { QRCode } from "@/components/ui/QRCode"
import {
  ProductAdviceCard,
  getProductAdvice,
} from "@/components/ProductAdviceCard"
import {
  getConsumptionDisplay,
  getNoiseDisplay,
  getSpecEvaluation,
} from "@/lib/utils"
import {
  Zap,
  Volume2,
  ShieldCheck,
  Euro,
  Wrench,
  Scale,
  Recycle,
  Globe,
  Leaf,
  CheckCircle,
  Check,
  Store,
  Printer,
  Tag,
  Building2,
  SlidersHorizontal,
  Lightbulb,
  Pencil,
  User,
} from "lucide-react"

export function ProductDetailView({
  product,
  catalog = PRODUCTS,
  onBack,
  onShelf,
  onSelectProduct,
  onEdit,
  onDelete,
}: {
  product: Product
  catalog?: Product[]
  onBack: () => void
  onShelf: () => void
  onSelectProduct: (p: Product) => void
  onEdit?: (p: Product) => void
  onDelete?: (p: Product) => void
}) {
  const [viewMode, setViewMode] = useState<"client" | "pro">("client")
  const currentProduct = product ?? catalog?.[0] ?? PRODUCTS[0]

  const advice = useMemo(() => getProductAdvice(currentProduct), [currentProduct])
  const conso = useMemo(
    () => getConsumptionDisplay(currentProduct?.category, currentProduct?.consumption),
    [currentProduct?.category, currentProduct?.consumption],
  )
  const noise = useMemo(
    () => getNoiseDisplay(currentProduct?.category, currentProduct?.noise),
    [currentProduct?.category, currentProduct?.noise],
  )
  const specEval = useMemo(() => getSpecEvaluation(currentProduct), [currentProduct])

  const specItems = useMemo(
    () => [
      {
        icon: <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />,
        label: conso.label,
        value: conso.value,
        status: specEval.conso.status,
        statusLabel: specEval.conso.label,
        group: "energy",
      },
      {
        icon: <Volume2 className="w-4 h-4 text-blue-500 flex-shrink-0" />,
        label: "Niveau sonore",
        value: noise,
        status: specEval.noise.status,
        statusLabel: specEval.noise.label,
        group: "energy",
      },
      {
        icon: <Scale className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
        label: "Poids de l'appareil",
        value: `${currentProduct?.weight ?? 0} kg`,
        status: "neutral" as const,
        statusLabel: "",
        group: "energy",
      },
      {
        icon: <Euro className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
        label: "Prix indicatif",
        value: currentProduct?.price || "N/C",
        status: "neutral" as const,
        statusLabel: "",
        group: "energy",
      },
      {
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
        label: "Garantie constructeur",
        value: `${currentProduct?.warranty ?? 2} ans`,
        status: specEval.warranty.status,
        statusLabel: specEval.warranty.label,
        group: "durability",
      },
      {
        icon: <Wrench className="w-4 h-4 text-teal-600 flex-shrink-0" />,
        label: "Disponibilité pièces",
        value: `${currentProduct?.spareParts ?? 5} ans`,
        status: (currentProduct?.spareParts ?? 5) >= 10 ? "good" : "average",
        statusLabel: (currentProduct?.spareParts ?? 5) >= 10 ? "Excellente" : "Standard",
        group: "durability",
      },
      {
        icon: <Recycle className="w-4 h-4 text-teal-500 flex-shrink-0" />,
        label: "Recyclabilité matériaux",
        value: `${currentProduct?.recyclability ?? 80}%`,
        status: specEval.recyclability.status,
        statusLabel: specEval.recyclability.label,
        group: "durability",
      },
      {
        icon: <Globe className="w-4 h-4 text-cyan-600 flex-shrink-0" />,
        label: "Carbone fabrication",
        value: `${currentProduct?.carbon ?? 0} kg CO₂eq`,
        status: specEval.carbon.status,
        statusLabel: specEval.carbon.label,
        group: "durability",
      },
    ],
    [
      conso,
      noise,
      specEval,
      currentProduct?.weight,
      currentProduct?.price,
      currentProduct?.warranty,
      currentProduct?.spareParts,
      currentProduct?.recyclability,
      currentProduct?.carbon,
    ],
  )

  const alternatives = useMemo(() => {
    if (!currentProduct) return []
    const pool = catalog && catalog.length > 0 ? catalog : PRODUCTS
    const sameCat = pool.filter(
      (p) => p && p.category === currentProduct.category && p.id !== currentProduct.id,
    )
    if (sameCat.length === 0) return ALTERNATIVES.slice(0, 2)

    return [...sameCat]
      .sort(
        (a, b) =>
          ((b?.repairability ?? 0) + (b?.lca?.reliability ?? 0)) -
          ((a?.repairability ?? 0) + (a?.lca?.reliability ?? 0)),
      )
      .slice(0, 2)
      .map((alt) => {
        const diff = (
          (alt?.repairability ?? 0) - (currentProduct.repairability ?? 0)
        ).toFixed(1)
        const gain =
          parseFloat(diff) > 0
            ? `+${diff} pts sur la réparabilité`
            : `Pièces détachées ${alt?.spareParts ?? 5} ans`
        const gainAlt =
          (alt?.energyGrade || "") < (currentProduct.energyGrade || "")
            ? `Classe Énergie ${alt.energyGrade} vs ${currentProduct.energyGrade}`
            : (alt?.warranty ?? 0) > (currentProduct.warranty ?? 0)
              ? `Garantie ${alt.warranty} ans vs ${currentProduct.warranty} ans`
              : alt?.lca?.reliability
                ? `Score fiabilité ${alt.lca.reliability}%`
                : `Pièces garanties ${alt.spareParts ?? 5} ans`
        return { id: alt.id, product: alt, gain, gainAlt }
      })
  }, [catalog, currentProduct])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Appareil non trouvé</h2>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm cursor-pointer"
        >
          ← Retour aux résultats
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar with back button only */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          ← Retour aux résultats
        </button>
      </div>

      {/* Product Hero Banner: Identity + Key Official Environmental Ratings & Passport */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Left: Product identification, price & official guarantee vignettes */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-emerald-100">
                <CategoryIcon
                  category={product.category}
                  className="w-3.5 h-3.5"
                />
                {product.category}
              </span>
              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Modifier ce produit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Modifier</span>
                </button>
              )}
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {product.brand} {product.model}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
              <span>
                Fournisseur :{" "}
                <strong className="text-slate-600 font-semibold">
                  {product.supplier}
                </strong>
              </span>
              <span>•</span>
              <span className="font-mono">
                Réf certifiée : {product.certRef}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {product.price}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                TTC conseillé
              </span>
            </div>

            {/* Garanties & Données Officielles directement avec les vignettes */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-full font-medium border border-slate-200/60 shadow-2xs">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                Pièces détachées {product.spareParts} ans
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-full font-medium border border-slate-200/60 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Garantie constructeur {product.warranty} ans
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-full font-medium border border-slate-200/60 shadow-2xs">
                <Recycle className="w-3.5 h-3.5 text-teal-600" />
                Recyclable {product.recyclability}%
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200 shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Conforme EU ESPR 2024
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1 rounded-full font-medium border border-slate-200 shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Loi AGEC & Décret 2021-1040
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1 rounded-full font-medium border border-slate-200 shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                Vérifié ADEME · INEC
              </span>
            </div>
          </div>

          {/* Right: 3 cards side-by-side (Énergie EU, Indice Réparabilité, Passeport Numérique) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6 items-stretch">
            {/* 1. Étiquette Énergie EU */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                Étiquette Énergie EU
              </div>
              <div className="flex items-center gap-3">
                <EnergyBadge grade={product.energyGrade} size="lg" />
                <div className="flex-1 min-w-0">
                  <EnergyScale current={product.energyGrade} />
                </div>
              </div>
            </div>

            {/* 2. Indice Réparabilité officiel */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                Indice Réparabilité
              </div>
              <div>
                <RepairabilityScore score={product.repairability} />
                <div className="mt-2.5 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bar-fill"
                    style={{
                      width: `${product.repairability * 10}%`,
                      background:
                        product.repairability >= 8
                          ? "linear-gradient(90deg, #047857, #10b981)"
                          : product.repairability >= 6
                            ? "linear-gradient(90deg, #d97706, #f59e0b)"
                            : "linear-gradient(90deg, #dc2626, #ef4444)",
                    }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
                  Décret FR 2021-1040
                </div>
              </div>
            </div>

            {/* 3. Passeport Numérique Circulaire */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                Passeport Numérique
              </div>
              <div className="flex flex-col items-center justify-center flex-1 py-0.5">
                <div className="border border-slate-200 rounded-xl p-1.5 bg-white shadow-2xs qr-code-box">
                  <QRCode
                    size={80}
                    value={`https://cyclo.eu/p/${product.id}`}
                  />
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
                EU ESPR 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de mode : Vue consommateur / Vue partenaire */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-8 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 w-full sm:w-auto sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => setViewMode("client")}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
              viewMode === "client"
                ? "bg-white text-emerald-800 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User
              className={`w-4 h-4 flex-shrink-0 ${
                viewMode === "client" ? "text-emerald-700" : "text-slate-400"
              }`}
            />
            <span className="truncate">
              <span className="hidden sm:inline">Vue </span>Consommateur
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("pro")}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
              viewMode === "pro"
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Store
              className={`w-4 h-4 flex-shrink-0 ${
                viewMode === "pro" ? "text-emerald-200" : "text-slate-400"
              }`}
            />
            <span className="truncate">
              <span className="hidden sm:inline">Vue </span>Partenaire
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${
                viewMode === "pro"
                  ? "bg-emerald-950/80 text-emerald-200 border border-emerald-600/50"
                  : "bg-slate-200/60 text-slate-500"
              }`}
            >
              B2B<span className="hidden md:inline"> / Magasins</span>
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-start sm:items-center gap-2 px-1 sm:px-2">
          {viewMode === "client" ? (
            <span className="flex items-start sm:items-center gap-1.5 leading-snug sm:leading-normal">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1 sm:mt-0" />
              <span>
                <strong>Vue consommateur :</strong> Analyse d'usage, décryptage des notes & conseils durables
              </span>
            </span>
          ) : (
            <span className="flex items-start sm:items-center gap-1.5 leading-snug sm:leading-normal">
              <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1 sm:mt-0" />
              <span>
                <strong>Vue partenaire :</strong> Outils de vente en rayon, fiches étiquettes & conformité juridique
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="w-full space-y-6 mb-10">
        {/* VUE CLIENT : Conseil & Analyse Expert en premier plan */}
        {viewMode === "client" && (
          <ProductAdviceCard product={product} />
        )}

        {/* VUE PROFESSIONNELLE : Outils Rayon, Discours Vendeur & Conformité B2B */}
        {viewMode === "pro" && (
          <div className="space-y-6">
            {/* En-tête Espace Pro avec action Fiche Rayon directe */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/15">
                    <Store className="w-3.5 h-3.5" />
                    <span>Espace Partenaire & Merchandising</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-200/80 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    Réf certifiée : {product.certRef}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Outils Rayon, Discours Vendeur & Conformité
                </h2>
                <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
                  L'ensemble des arguments de vente, des réponses aux objections
                  clients et des pièces réglementaires certifiées pour ce
                  produit.
                </p>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={onShelf}
                  className="py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-white text-emerald-950 hover:bg-emerald-50 hover:scale-[1.02] active:scale-98 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4.5 h-4.5 text-emerald-700" />
                  <span>Ouvrir & Imprimer la Fiche Rayon</span>
                </button>
              </div>
            </div>

              {/* Argumentaire Vendeur en Rayon */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Argumentaire Vendeur en Rayon</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Aide à la vente directe
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Pitch conseiller de vente à destination du client
                    </span>
                  </div>
                  <blockquote className="text-sm sm:text-base font-bold text-emerald-950 italic leading-relaxed">
                    {advice.retailTip}
                  </blockquote>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Comment lever les 3 principales objections clients ?
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                        <span>"La note énergie semble basse"</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Expliquez la refonte de l'étiquette UE 2021 qui a durci
                        les critères. La consommation réelle ne représente que
                        quelques euros par an.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span>"Combien de temps va-t-il durer ?"</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Mettez en avant les {product.spareParts} ans de pièces
                        détachées garanties d'origine constructeur et l'indice
                        de réparabilité de {(Number(product.repairability) || 0).toFixed(1)}
                        /10.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                        <span>"Le prix est-il justifié ?"</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Misez sur le coût global de possession (TCO) : sa
                        sobriété et sa réparabilité évitent un renouvellement
                        prématuré dans 3 ans.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conformité Réglementaire & Audits B2B */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      Conformité Réglementaire & Audits Juridiques B2B
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    Tiers de confiance ADEME · UE
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "EU ESPR 2024 (Ecodesign)",
                      desc: "Règlement européen sur l'écoconception des produits durables",
                    },
                    {
                      label: "Loi AGEC & Décret 2021-1040",
                      desc: "Indice de réparabilité officiel français certifié",
                    },
                    {
                      label: "Green Claims Directive UE 2023/0085",
                      desc: "Allégations environnementales vérifiées sans greenwashing",
                    },
                    {
                      label: "Règlement EU 2017/1369",
                      desc: "Étiquetage énergétique officiel et enregistrement base EPREL",
                    },
                    {
                      label: "Norme ACV ISO 14040/44",
                      desc: "Bilan complet de cycle de vie vérifié par organisme indépendant",
                    },
                    {
                      label: "Base Empreinte ADEME & INEC",
                      desc: "Facteurs d'émission et données carbone validés en France",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Données B2B Logistiques & Fournisseur */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Données Logistiques & Traçabilité Fournisseur</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Fournisseur
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 mt-1 truncate">
                      {product.supplier}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Référence EPREL
                    </div>
                    <div className="font-mono font-bold text-xs sm:text-sm text-emerald-700 mt-1 truncate">
                      {product.certRef}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Garantie B2B
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 mt-1">
                      {product.warranty} ans
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Poids Logistique
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 mt-1">
                      {product.weight} kg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. Spécifications & Caractéristiques Techniques (consultables dans les deux vues) */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Spécifications & Caractéristiques Techniques</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Bon
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Moyen
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Faible
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Groupe 1 : Énergie & Performances */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Énergie & Performances
                  </div>
                  {specItems
                    .filter((s) => s.group === "energy")
                    .map(({ icon, label, value, status, statusLabel }) => (
                      <div
                        key={label}
                        className="spec-item-row flex items-center justify-between py-2.5 px-3.5 rounded-xl gap-3"
                      >
                        <span className="flex items-center gap-2.5 text-slate-700 font-medium text-xs sm:text-sm truncate">
                          {icon}
                          <span className="truncate">{label}</span>
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`font-bold text-xs sm:text-sm whitespace-nowrap ${
                              status === "good"
                                ? "text-emerald-700"
                                : status === "weak"
                                  ? "text-rose-600"
                                  : status === "average"
                                    ? "text-amber-700"
                                    : "text-slate-800"
                            }`}
                          >
                            {value}
                          </span>
                          {statusLabel && status !== "neutral" && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border whitespace-nowrap leading-none ${
                                status === "good"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : status === "weak"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  status === "good"
                                    ? "bg-emerald-500"
                                    : status === "weak"
                                      ? "bg-rose-500"
                                      : "bg-amber-500"
                                }`}
                              />
                              {statusLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Groupe 2 : Durabilité & Environnement */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Durabilité & Environnement
                  </div>
                  {specItems
                    .filter((s) => s.group === "durability")
                    .map(({ icon, label, value, status, statusLabel }) => (
                      <div
                        key={label}
                        className="spec-item-row flex items-center justify-between py-2.5 px-3.5 rounded-xl gap-3"
                      >
                        <span className="flex items-center gap-2.5 text-slate-700 font-medium text-xs sm:text-sm truncate">
                          {icon}
                          <span className="truncate">{label}</span>
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`font-bold text-xs sm:text-sm whitespace-nowrap ${
                              status === "good"
                                ? "text-emerald-700"
                                : status === "weak"
                                  ? "text-rose-600"
                                  : status === "average"
                                    ? "text-amber-700"
                                    : "text-slate-800"
                            }`}
                          >
                            {value}
                          </span>
                          {statusLabel && status !== "neutral" && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border whitespace-nowrap leading-none ${
                                status === "good"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : status === "weak"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  status === "good"
                                    ? "bg-emerald-500"
                                    : status === "weak"
                                      ? "bg-rose-500"
                                      : "bg-amber-500"
                                }`}
                              />
                              {statusLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* 2. Cycle de Vie (ACV) */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Cycle de Vie (ACV) & Durabilité Environnementale</span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  Méthodologie ISO 14040/44
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Gauche : Scores ACV */}
                <div className="space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Indicateurs ACV Normalisés
                  </div>
                  <ScoreBar
                    label="Fiabilité produit"
                    value={product.lca.reliability}
                    color="#047857"
                  />
                  <ScoreBar
                    label="Réparabilité / Démontage"
                    value={product.lca.repairability}
                    color="#065f46"
                  />
                  <ScoreBar
                    label={`Disponibilité pièces (${product.spareParts} ans)`}
                    value={product.lca.spareParts}
                    color="#10b981"
                  />
                  <ScoreBar
                    label="Recyclabilité matériaux"
                    value={product.recyclability}
                    color="#6ee7b7"
                  />
                </div>

                {/* Droite : Pièces détachées & Empreinte de fabrication */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pièces détachées d'origine</span>
                      </div>
                      <div className="text-xs text-emerald-900 font-medium">
                        Disponibilité minimale garantie constructeur
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-emerald-800">
                        {product.spareParts}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 ml-1">
                        ans
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-cyan-600" />
                        <span>Empreinte carbone</span>
                      </div>
                      <div className="text-lg font-black text-slate-800">
                        {product.carbon}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          kg CO₂e
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <Recycle className="w-3 h-3 text-teal-600" />
                        <span>Taux recyclabilité</span>
                      </div>
                      <div className="text-lg font-black text-slate-800">
                        {product.recyclability} %
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">
                      Norme ISO 14040/44 :
                    </span>{" "}
                    L'analyse quantifie les impacts environnementaux sur
                    l'ensemble du cycle de vie, de l'extraction des matières
                    premières jusqu'au recyclage en filière certifiée.
                  </div>
                </div>
              </div>
            </div>
          </div>

      <div className="alternatives-card rounded-2xl overflow-hidden border border-emerald-200">
        <div className="alternatives-card-header px-7 py-5 border-b border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <h3 className="font-black text-lg text-slate-900">
              Alternatives plus durables recommandées par Cyclo
            </h3>
          </div>
          <p className="text-sm text-slate-500">
            Produits de la même catégorie avec un meilleur score environnemental
            global
          </p>
        </div>
        <div className="p-7 grid sm:grid-cols-2 gap-4">
          {alternatives.map((alt) => (
            <div
              key={alt.id}
                onClick={() => {
                  onSelectProduct(alt.product)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelectProduct(alt.product)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                }}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 hover:shadow-lg hover:border-emerald-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      ↑ {alt.gain}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {alt.gainAlt}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {alt.product.brand} {alt.product.model}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {alt.product.category} · {alt.product.price}
                      </div>
                    </div>
                    <EnergyBadge grade={alt.product.energyGrade} size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500 font-medium">
                      Réparabilité
                    </div>
                    <RepairabilityScore score={alt.product.repairability} />
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 flex items-center gap-1 shadow-xs"
                    aria-hidden="true"
                  >
                    <span>Voir cette fiche</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
