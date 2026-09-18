import { useState, useRef, useEffect, useMemo } from "react"
import { PRODUCTS, ALL_CATEGORIES, type Product } from "@/data/products"
import { CategoryIcon } from "@/components/ui/CategoryIcon"
import { EnergyBadge } from "@/components/ui/EnergyBadge"
import { matchProduct, normalizeStr, ENERGY_CONFIG } from "@/lib/utils"
import {
  Search,
  X,
  Tag,
  Building2,
  Zap,
  Lightbulb,
  Package,
  Wrench,
} from "lucide-react"
import logoCycloIcon from "@/imports/Logo_Cyclo_Haut_Page.png"

export interface SmartSearchBarProps {
  catalog: Product[]
  initialQuery?: string
  onSearch: (query: string) => void
  onSelectProduct?: (product: Product) => void
  onSelectCategory?: (category: string) => void
  placeholder?: string
  size?: "large" | "medium"
  autoFocus?: boolean
  className?: string
}

export function SmartSearchBar({
  catalog,
  initialQuery = "",
  onSearch,
  onSelectProduct,
  onSelectCategory,
  placeholder = "Rechercher Samsung, Bosch, lave-linge, classe A...",
  size = "large",
  autoFocus = false,
  className = "",
}: SmartSearchBarProps) {
  const [inputVal, setInputVal] = useState(initialQuery)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputVal(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const allBrands = useMemo(
    () => Array.from(new Set((catalog ?? []).map((p) => p.brand))),
    [catalog],
  )

  const trimmed = inputVal.trim()
  const normQuery = useMemo(() => normalizeStr(trimmed), [trimmed])

  // Matching categories
  const matchingCategories = useMemo(
    () =>
      trimmed
        ? ALL_CATEGORIES.filter((cat) => normalizeStr(cat).includes(normQuery))
        : [],
    [trimmed, normQuery],
  )

  // Matching brands
  const matchingBrands = useMemo(
    () =>
      trimmed
        ? allBrands.filter((brand) => normalizeStr(brand).includes(normQuery))
        : [],
    [trimmed, allBrands, normQuery],
  )

  // Matching products
  const matchingProducts = useMemo(
    () => (trimmed ? (catalog ?? []).filter((p) => matchProduct(p, trimmed)) : []),
    [trimmed, catalog],
  )

  const topProducts = useMemo(
    () => matchingProducts.slice(0, 5),
    [matchingProducts],
  )

  type NavItem =
    | { kind: "category"; value: string }
    | { kind: "brand"; value: string }
    | { kind: "product"; product: Product }
    | { kind: "search"; query: string }

  const navItems = useMemo<NavItem[]>(
    () =>
      trimmed
        ? [
            ...matchingCategories.map((c) => ({
              kind: "category" as const,
              value: c,
            })),
            ...matchingBrands.map((b) => ({ kind: "brand" as const, value: b })),
            ...topProducts.map((p) => ({ kind: "product" as const, product: p })),
            { kind: "search" as const, query: trimmed },
          ]
        : [],
    [trimmed, matchingCategories, matchingBrands, topProducts],
  )

  const handleExecuteSearch = (q: string) => {
    setIsOpen(false)
    onSearch(q)
  }

  const handleSelectProduct = (p: Product) => {
    setIsOpen(false)
    if (onSelectProduct) {
      onSelectProduct(p)
    } else {
      onSearch(`${p.brand} ${p.model}`)
    }
  }

  const handleSelectCategory = (cat: string) => {
    setIsOpen(false)
    if (onSelectCategory) {
      onSelectCategory(cat)
    } else {
      onSearch(cat)
    }
  }

  const handleSelectBrand = (brand: string) => {
    setInputVal(brand)
    setIsOpen(false)
    onSearch(brand)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      if (navItems.length > 0) {
        setHighlightedIndex((prev) => (prev >= navItems.length - 1 ? 0 : prev + 1))
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!isOpen) return
      if (navItems.length > 0) {
        setHighlightedIndex((prev) => (prev <= 0 ? navItems.length - 1 : prev - 1))
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (
        isOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < navItems.length
      ) {
        const item = navItems[highlightedIndex]
        if (item.kind === "category") handleSelectCategory(item.value)
        else if (item.kind === "brand") handleSelectBrand(item.value)
        else if (item.kind === "product") handleSelectProduct(item.product)
        else if (item.kind === "search") handleExecuteSearch(item.query)
      } else {
        handleExecuteSearch(inputVal)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const isLarge = size === "large"

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div
        className={`flex items-center bg-white rounded-2xl transition-all ${
          isLarge
            ? "shadow-lg border border-slate-200 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 overflow-hidden"
            : "border border-slate-200 hover:border-emerald-300 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 overflow-hidden shadow-xs"
        }`}
      >
        {isLarge ? (
          <div className="flex items-center gap-2 px-4 border-r border-slate-100 py-3 flex-shrink-0">
            <img
              src={logoCycloIcon}
              alt="Cyclo"
              className="h-7 w-auto object-contain"
            />
          </div>
        ) : (
          <div className="pl-3.5 pr-1 text-slate-400 flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        )}

        <input
          type="text"
          value={inputVal}
          autoFocus={autoFocus}
          aria-label={placeholder}
          onChange={(e) => {
            setInputVal(e.target.value)
            setHighlightedIndex(-1)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none min-w-0 ${
            isLarge ? "px-4 py-4 text-base sm:text-sm" : "px-3 py-2 text-sm"
          }`}
        />

        {inputVal && (
          <button
            type="button"
            onClick={() => {
              setInputVal("")
              onSearch("")
              setHighlightedIndex(-1)
            }}
            aria-label="Effacer la recherche"
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {isLarge && (
          <button
            type="button"
            onClick={() => handleExecuteSearch(inputVal)}
            className="m-1.5 px-6 py-3 rounded-xl text-white text-sm font-bold flex-shrink-0 transition-all hover:scale-[1.02] hover:shadow-md active:scale-95"
            style={{
              background: "linear-gradient(135deg, #047857, #065f46)",
            }}
          >
            Rechercher
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden text-left divide-y divide-slate-100 animate-fade-in max-h-[75vh] overflow-y-auto">
          {trimmed.length === 0 ? (
            <div className="p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Catégories suggérées</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 transition-all text-xs font-medium text-slate-700"
                  >
                    <CategoryIcon
                      category={cat}
                      className="w-4 h-4 text-emerald-700 flex-shrink-0"
                    />
                    <span className="truncate">{cat}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                <span className="font-medium text-slate-400">
                  Marques phares :
                </span>
                {allBrands.slice(0, 5).map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => handleSelectBrand(brand)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 font-semibold text-slate-700 transition-colors"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Catégories */}
              {matchingCategories.length > 0 && (
                <div className="p-3 bg-slate-50/70">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Catégories correspondantes</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {matchingCategories.map((cat) => {
                      const count = (catalog ?? []).filter(
                        (p) => p && p.category === cat,
                      ).length
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleSelectCategory(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 shadow-2xs transition-all"
                        >
                          <CategoryIcon
                            category={cat}
                            className="w-3.5 h-3.5 text-emerald-700"
                          />
                          <span>{cat}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({count})
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Marques */}
              {matchingBrands.length > 0 && (
                <div className="p-3 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Marques correspondantes</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {matchingBrands.map((brand) => {
                      const count = (catalog ?? []).filter(
                        (p) => p && p.brand === brand,
                      ).length
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleSelectBrand(brand)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 transition-all"
                        >
                          <span className="font-bold text-emerald-800">
                            {brand}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({count} modèle{count > 1 ? "s" : ""})
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Appareils */}
              {topProducts.length > 0 && (
                <div className="py-2 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-4 py-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                      <span>Appareils suggérés</span>
                    </span>
                    <span className="text-[10px] font-normal text-slate-400">
                      {topProducts.length} sur {matchingProducts.length}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {topProducts.map((product, idx) => {
                      const itemIdx =
                        matchingCategories.length + matchingBrands.length + idx
                      const isHighlighted = highlightedIndex === itemIdx
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          onMouseEnter={() => setHighlightedIndex(itemIdx)}
                          className={`px-4 py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                            isHighlighted
                              ? "bg-emerald-50/90 border-l-4 border-emerald-600 pl-3"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0 text-slate-700">
                              <CategoryIcon
                                category={product.category}
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900 truncate">
                                <span className="font-black text-emerald-800 mr-1.5">
                                  {product.brand}
                                </span>
                                {product.model}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{product.category}</span>
                                <span>·</span>
                                <span className="font-mono text-[11px]">
                                  {product.certRef}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <span
                              className="text-[11px] font-black px-2 py-0.5 rounded shadow-2xs"
                              style={{
                                background:
                                  ENERGY_CONFIG[product.energyGrade]?.bg ||
                                  "#64748b",
                                color:
                                  ENERGY_CONFIG[product.energyGrade]?.text ||
                                  "#fff",
                              }}
                            >
                              {product.energyGrade}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {product.price}
                            </span>
                            <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1 font-medium">
                              <Wrench className="w-3 h-3 text-slate-400" />
                              <span>{product.repairability}/10</span>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Aucun résultat */}
              {matchingCategories.length === 0 &&
                matchingBrands.length === 0 &&
                matchingProducts.length === 0 && (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="text-sm font-bold text-slate-800">
                      Aucun résultat pour « {trimmed} »
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Vérifiez l'orthographe ou essayez une marque (ex:{" "}
                      <em>Samsung</em>, <em>Bosch</em>), un appareil ou une
                      catégorie.
                    </p>
                  </div>
                )}

              {/* Action globale */}
              <div
                onClick={() => handleExecuteSearch(inputVal)}
                className={`px-4 py-3 bg-slate-50 hover:bg-emerald-100/60 cursor-pointer flex items-center justify-between transition-colors ${
                  highlightedIndex === navItems.length - 1
                    ? "bg-emerald-100/70"
                    : ""
                }`}
              >
                <div className="text-xs font-semibold text-emerald-900 flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>
                    Afficher tous les résultats pour «{" "}
                    <strong className="text-slate-900">{trimmed}</strong> »
                  </span>
                  <span className="text-slate-500 font-normal">
                    ({matchingProducts.length} appareil
                    {matchingProducts.length > 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs flex-shrink-0">
                  <span className="hidden sm:inline">Appuyer sur</span>
                  <kbd className="font-mono font-bold text-slate-700">
                    Entrée ↵
                  </kbd>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
