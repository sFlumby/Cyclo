import React from "react"
import { PRODUCTS, type Product } from "@/data/products"
import { SmartSearchBar } from "@/components/SmartSearchBar"
import { CategoryIcon } from "@/components/ui/CategoryIcon"
import {
  BarChart3,
  Wrench,
  Tag,
  Globe,
  Store,
  Leaf,
  Zap,
  ShieldCheck,
  Package,
} from "lucide-react"
import logoCyclo from "@/imports/Logo_Cyclo_Baniere.png"
import logoFnac from "@/imports/Logo_Fnac.png"
import logoBoulanger from "@/imports/Logo_Boulanger.png"
import logoIfixit from "@/imports/Logo_iFixit.png"
import logoDarty from "@/imports/Logo_Darty.png"

const HOME_PILLS = [
  "Lave-linge",
  "Lave-vaisselle",
  "Réfrigérateur",
  "TV & Écrans",
  "Smartphone",
] as const

const HOME_PARTNERS = [
  {
    name: "Fnac",
    logo: logoFnac,
    tag: "Grande Distribution",
    desc: "Affichage des indicateurs de durabilité & éco-choix",
  },
  {
    name: "Darty",
    logo: logoDarty,
    tag: "Réparabilité & SAV",
    desc: "Baromètre SAV & pièces détachées garanties",
  },
  {
    name: "Boulanger",
    logo: logoBoulanger,
    tag: "Électroménager",
    desc: "Déploiement des fiches rayon certifiées en magasin",
  },
  {
    name: "iFixit",
    logo: logoIfixit,
    tag: "Expert Démontabilité",
    desc: "Référentiels et scores de démontage communautaires",
  },
] as const

export const HomeView = React.memo(function HomeView({
  catalog,
  onSearch,
  onSelectProduct,
}: {
  catalog: Product[]
  onSearch: (q: string) => void
  onSelectProduct: (p: Product) => void
}) {
  const pills = HOME_PILLS
  const partners = HOME_PARTNERS

  return (
    <div>
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
        <div className="home-hero-bg absolute inset-0 -z-10">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, #047857, transparent)",
              transform: "translate(25%, -25%)",
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="home-eu-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-7 border">
            🇪🇺 Conforme EU ESPR 2024 · ISO 14040/44 · Indice de réparabilité
            officiel
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] text-slate-900 leading-[1.06] tracking-tight mb-5">
            Analysez le cycle de vie
            <br />
            <span style={{ color: "#047857" }}>de vos appareils</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Durabilité, réparabilité, impact carbone — comparez tous vos
            électroménagers selon les référentiels réglementaires européens.
          </p>

          <div className="max-w-2xl mx-auto mb-5">
            <SmartSearchBar
              catalog={catalog}
              onSearch={onSearch}
              onSelectProduct={onSelectProduct}
              size="large"
              placeholder="Rechercher Samsung, Bosch, lave-linge, classe A..."
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {pills.map((p) => (
              <button
                key={p}
                onClick={() => onSearch(p)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <CategoryIcon
                  category={p}
                  className="w-3.5 h-3.5 text-emerald-700"
                />
                <span>{p}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: <Package className="w-6 h-6 text-emerald-600" />,
                value: "10 000+",
                label: "Produits évalués",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                value: "EU ESPR",
                label: "Normes européennes",
              },
              {
                icon: <Store className="w-6 h-6 text-emerald-600" />,
                value: "350+",
                label: "Magasins partenaires",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-xl text-slate-900">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BarChart3 className="w-5 h-5 text-emerald-700" />,
                title: "Analyse ACV complète",
                desc: "Cycle de vie ISO 14040/44 : fabrication, usage, fin de vie.",
              },
              {
                icon: <Wrench className="w-5 h-5 text-emerald-700" />,
                title: "Indice réparabilité EU",
                desc: "Score officiel + indicateur ESPR : pièces, docs, démontage.",
              },
              {
                icon: <Tag className="w-5 h-5 text-emerald-700" />,
                title: "Fiches rayon imprimables",
                desc: "Étiquettes A6 avec QR code pour vos rayons en magasin.",
              },
              {
                icon: <Globe className="w-5 h-5 text-emerald-700" />,
                title: "Conformité Green Claims",
                desc: "Données certifiées selon la directive EU 2023/0085.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 p-4 rounded-xl border border-transparent"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">
                    {f.title}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-banner-section py-16 px-4 text-center">
        <h2 className="font-extrabold text-2xl text-slate-900 mb-3">
          Tous les appareils certifiés
        </h2>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          Parcourez le catalogue complet des appareils évalués selon les normes
          EU.
        </p>
        <button
          onClick={() => onSearch("")}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 hover:shadow-md cursor-pointer"
          style={{ background: "linear-gradient(135deg, #047857, #065f46)" }}
        >
          Voir tous les appareils →
        </button>
      </section>

      {/* Section Nos Partenaires */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Store className="w-3.5 h-3.5" />
            <span>Écosystème & Distribution</span>
          </div>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
            Nos partenaires engagés
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Distributeurs et acteurs du réemploi engagés aux côtés de Cyclo pour
            une information transparente et conforme aux normes européennes.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {partners.map((p) => (
              <div
                key={p.name}
                className="partner-card rounded-2xl p-6 border shadow-2xs flex flex-col items-center justify-between"
              >
                <div className="h-16 w-full flex items-center justify-center mb-3 px-2 partner-logo-wrapper">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-12 max-w-[140px] w-auto object-contain"
                  />
                </div>
                <div className="w-full pt-3 border-t border-slate-100 text-center">
                  <div className="font-bold text-xs text-slate-800">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    {p.tag}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
})
