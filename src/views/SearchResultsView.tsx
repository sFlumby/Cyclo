import { useState, useMemo, useEffect } from "react"
import { ALL_CATEGORIES, type Product } from "@/data/products"
import { CategoryIcon } from "@/components/ui/CategoryIcon"
import { ProductCard } from "@/components/ProductCard"
import { SmartSearchBar } from "@/components/SmartSearchBar"
import { matchProduct, parsePrice, ENERGY_CONFIG } from "@/lib/utils"
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Upload,
  Inbox,
  X,
} from "lucide-react"

export function SearchResultsView({
  query,
  catalog,
  onSelectProduct,
  onAddAppliance,
  onSearchChange,
}: {
  query: string
  catalog: Product[]
  onSelectProduct: (p: Product) => void
  onAddAppliance: () => void
  onSearchChange?: (q: string) => void
}) {
  const isCategoryQuery = (ALL_CATEGORIES as readonly string[]).includes(query)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(
    isCategoryQuery ? query : null,
  )
  const [searchTerm, setSearchTerm] = useState(isCategoryQuery ? "" : query)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [minRepairability, setMinRepairability] = useState<number>(0)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [minSpareParts, setMinSpareParts] = useState<number>(0)
  const [minWarranty, setMinWarranty] = useState<number>(0)
  const [maxCarbon, setMaxCarbon] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)

  useEffect(() => {
    if ((ALL_CATEGORIES as readonly string[]).includes(query)) {
      setCategoryFilter(query)
      setSearchTerm("")
    } else {
      setSearchTerm(query)
      if (!query) setCategoryFilter(null)
    }
  }, [query])

  const handleSearchUpdate = (newQuery: string) => {
    setSearchTerm(newQuery)
    onSearchChange?.(newQuery)
  }

  // Marques disponibles et décompte
  const availableBrands = useMemo(() => {
    const pool = categoryFilter
      ? (catalog ?? []).filter((p) => p && p.category === categoryFilter)
      : (catalog ?? [])
    const counts: Record<string, number> = {}
    pool.forEach((p) => {
      if (!p) return
      const brand = p.brand?.trim() || "Autre"
      counts[brand] = (counts[brand] || 0) + 1
    })
    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )
  }, [catalog, categoryFilter])

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade],
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    )
  }

  const activeFilterCount =
    (categoryFilter ? 1 : 0) +
    (selectedGrades.length > 0 ? 1 : 0) +
    (minRepairability > 0 ? 1 : 0) +
    (selectedBrands.length > 0 ? 1 : 0) +
    (maxPrice !== null ? 1 : 0) +
    (minSpareParts > 0 ? 1 : 0) +
    (minWarranty > 0 ? 1 : 0) +
    (maxCarbon !== null ? 1 : 0)

  const resetFilters = () => {
    handleSearchUpdate("")
    setCategoryFilter(null)
    setSelectedGrades([])
    setMinRepairability(0)
    setSelectedBrands([])
    setMaxPrice(null)
    setMinSpareParts(0)
    setMinWarranty(0)
    setMaxCarbon(null)
    setSortBy("relevance")
  }

  const filtered = useMemo(() => {
    const list = (catalog ?? []).filter((p) => {
      if (!p) return false
      if (!matchProduct(p, searchTerm)) return false
      if (categoryFilter && p.category !== categoryFilter) return false
      if (
        selectedGrades.length > 0 &&
        !selectedGrades.includes((p.energyGrade || "").toUpperCase())
      )
        return false
      if (minRepairability > 0 && (p.repairability ?? 0) < minRepairability)
        return false
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand || ""))
        return false
      if (maxPrice !== null && parsePrice(p.price) > maxPrice) return false
      if (minSpareParts > 0 && (p.spareParts ?? 0) < minSpareParts) return false
      if (minWarranty > 0 && (p.warranty ?? 0) < minWarranty) return false
      if (maxCarbon !== null && (p.carbon ?? 0) > maxCarbon) return false
      return true
    })

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => parsePrice(a?.price) - parsePrice(b?.price))
        break
      case "price-desc":
        list.sort((a, b) => parsePrice(b?.price) - parsePrice(a?.price))
        break
      case "repairability-desc":
        list.sort(
          (a, b) => (b?.repairability ?? 0) - (a?.repairability ?? 0),
        )
        break
      case "carbon-asc":
        list.sort((a, b) => (a?.carbon ?? 0) - (b?.carbon ?? 0))
        break
      case "energy-asc":
        list.sort((a, b) =>
          (a?.energyGrade || "").localeCompare(b?.energyGrade || ""),
        )
        break
      case "relevance":
      default:
        break
    }

    return list
  }, [
    catalog,
    searchTerm,
    categoryFilter,
    selectedGrades,
    minRepairability,
    selectedBrands,
    maxPrice,
    minSpareParts,
    minWarranty,
    maxCarbon,
    sortBy,
  ])

  const SORT_OPTIONS = [
    { id: "relevance", label: "Pertinence" },
    { id: "repairability-desc", label: "Meilleure réparabilité" },
    { id: "price-asc", label: "Prix croissant" },
    { id: "price-desc", label: "Prix décroissant" },
    { id: "carbon-asc", label: "Moins de CO₂" },
    { id: "energy-asc", label: "Meilleure classe énergie" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-black text-xl sm:text-2xl text-slate-900 flex items-center gap-2 flex-wrap">
            <span className="text-emerald-700 font-extrabold">
              {filtered.length} appareil{filtered.length > 1 ? "s" : ""}{" "}
              certifié{filtered.length > 1 ? "s" : ""}
            </span>{" "}
            <span>dans le catalogue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Conforme aux directives européennes ESPR 2024 & bases ADEME
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-80">
            <SmartSearchBar
              catalog={catalog}
              initialQuery={searchTerm}
              onSearch={handleSearchUpdate}
              onSelectProduct={onSelectProduct}
              onSelectCategory={(c) => {
                setCategoryFilter(c)
                handleSearchUpdate("")
              }}
              size="medium"
              placeholder="Rechercher marque, modèle..."
            />
          </div>
          <button
            onClick={onAddAppliance}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Importer JSON</span>
          </button>
        </div>
      </div>

      {/* Barre de contrôle : Catégories + Bouton Filtres avancés + Tri */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        {/* Catégories rapides */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              !categoryFilter
                ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Tous
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setCategoryFilter(cat === categoryFilter ? null : cat)
              }
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                categoryFilter === cat
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <CategoryIcon category={cat} className="w-3.5 h-3.5" />
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Boutons d'action droite : Filtres avancés & Tri */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-2xs ${
              filtersOpen || activeFilterCount > (categoryFilter ? 1 : 0)
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filtres</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-700 text-white rounded-full text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
            {filtersOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Sélecteur de tri */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Trier les résultats"
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 pr-8 hover:border-slate-300 focus:outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Panneau déroulant de filtres par caractéristiques */}
      {filtersOpen && (
        <div className="mb-6 p-5 sm:p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm animate-fade-in space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-sm text-slate-900">
                Filtrer par caractéristiques techniques
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Classe Énergétique EU */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Classe Énergétique EU
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {["A", "B", "C", "D", "E", "F", "G"].map((g) => {
                  const active = selectedGrades.includes(g)
                  const cfg = ENERGY_CONFIG[g]
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGrade(g)}
                      className={`w-8 h-8 rounded-lg font-black text-xs transition-all flex items-center justify-center shadow-2xs border cursor-pointer ${
                        active
                          ? ""
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: cfg?.bg || "#047857",
                              color: cfg?.text || "#fff",
                              borderColor: cfg?.bg || "#047857",
                              transform: "scale(1.08)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                            }
                          : undefined
                      }
                    >
                      {g}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Indice de Réparabilité */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Indice de Réparabilité minimal
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Tous", min: 0 },
                  { label: "≥ 6/10", min: 6 },
                  { label: "≥ 7/10", min: 7 },
                  { label: "≥ 8/10", min: 8 },
                  { label: "≥ 9/10", min: 9 },
                ].map((opt) => (
                  <button
                    key={opt.min}
                    type="button"
                    onClick={() => setMinRepairability(opt.min)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      minRepairability === opt.min
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Budget maximal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Budget indicatif max
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Tous", val: null },
                  { label: "≤ 400 €", val: 400 },
                  { label: "≤ 700 €", val: 700 },
                  { label: "≤ 1 000 €", val: 1000 },
                  { label: "≤ 1 500 €", val: 1500 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setMaxPrice(opt.val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      maxPrice === opt.val
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Pièces détachées garanties */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pièces détachées disponibles
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Toutes", val: 0 },
                  { label: "≥ 10 ans", val: 10 },
                  { label: "≥ 12 ans", val: 12 },
                  { label: "≥ 14 ans", val: 14 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setMinSpareParts(opt.val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      minSpareParts === opt.val
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Garantie constructeur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Garantie constructeur
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Toutes", val: 0 },
                  { label: "≥ 2 ans", val: 2 },
                  { label: "≥ 3 ans", val: 3 },
                  { label: "≥ 5 ans", val: 5 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setMinWarranty(opt.val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      minWarranty === opt.val
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Empreinte carbone fabrication */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Empreinte carbone fabrication max
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Toutes", val: null },
                  { label: "≤ 100 kg CO₂", val: 100 },
                  { label: "≤ 200 kg CO₂", val: 200 },
                  { label: "≤ 350 kg CO₂", val: 350 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setMaxCarbon(opt.val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      maxCarbon === opt.val
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Marques disponibles */}
          {availableBrands.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Marques ({availableBrands.length})
              </label>
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pr-1">
                {availableBrands.map(([brand, count]) => {
                  const active = selectedBrands.includes(brand)
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        active
                          ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{brand}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({count})
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters chips bar */}
      {(searchTerm ||
        categoryFilter ||
        selectedGrades.length > 0 ||
        minRepairability > 0 ||
        selectedBrands.length > 0 ||
        maxPrice !== null ||
        minSpareParts > 0 ||
        minWarranty > 0 ||
        maxCarbon !== null ||
        sortBy !== "relevance") && (
        <div className="flex items-center gap-2 flex-wrap mb-5 py-2.5 px-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs animate-fade-in">
          <span className="font-bold text-emerald-800">Filtres actifs :</span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Recherche : « {searchTerm} »</span>
              <button
                type="button"
                onClick={() => handleSearchUpdate("")}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {categoryFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <CategoryIcon
                category={categoryFilter}
                className="w-3.5 h-3.5 text-emerald-700"
              />
              <span>{categoryFilter}</span>
              <button
                type="button"
                onClick={() => setCategoryFilter(null)}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer la catégorie"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedGrades.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Classe : {selectedGrades.join(", ")}</span>
              <button
                type="button"
                onClick={() => setSelectedGrades([])}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer le filtre de classe"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {minRepairability > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Réparabilité ≥ {minRepairability}/10</span>
              <button
                type="button"
                onClick={() => setMinRepairability(0)}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer le filtre de réparabilité"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedBrands.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Marques : {selectedBrands.join(", ")}</span>
              <button
                type="button"
                onClick={() => setSelectedBrands([])}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer les marques"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {maxPrice !== null && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Budget ≤ {maxPrice} €</span>
              <button
                type="button"
                onClick={() => setMaxPrice(null)}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer le budget max"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {minSpareParts > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Pièces ≥ {minSpareParts} ans</span>
              <button
                type="button"
                onClick={() => setMinSpareParts(0)}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer les pièces"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {minWarranty > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Garantie ≥ {minWarranty} ans</span>
              <button
                type="button"
                onClick={() => setMinWarranty(0)}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer la garantie"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {maxCarbon !== null && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>Carbone ≤ {maxCarbon} kg CO₂</span>
              <button
                type="button"
                onClick={() => setMaxCarbon(null)}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Supprimer le carbone max"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {sortBy !== "relevance" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
              <span>
                Tri : {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
              </span>
              <button
                type="button"
                onClick={() => setSortBy("relevance")}
                className="text-slate-400 hover:text-red-500 font-bold ml-1 p-0.5 rounded hover:bg-red-50"
                aria-label="Réinitialiser le tri"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 ml-auto text-[11px] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Tout réinitialiser</span>
          </button>
        </div>
      )}

      {/* Grille des résultats ou état vide */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <div className="font-semibold text-slate-700 text-lg">
            Aucun appareil ne correspond à ces filtres
          </div>
          <p className="text-sm mt-1 text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? `Aucun appareil ne correspond à votre recherche « ${searchTerm} » avec les critères sélectionnés.`
              : "Vos critères de filtrage sont trop restrictifs pour le catalogue actuel."}
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={() => onSelectProduct(p)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
