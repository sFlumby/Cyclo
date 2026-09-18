import { useState, useEffect, useCallback, useMemo } from "react"
import { PRODUCTS, type Product } from "@/data/products"
import { type View, type LoginTab, type ThemeMode, STORAGE_KEY } from "@/lib/utils"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { MobileBottomNav } from "@/components/MobileBottomNav"
import { HomeView } from "@/views/HomeView"
import { SearchResultsView } from "@/views/SearchResultsView"
import { ProductDetailView } from "@/views/ProductDetailView"
import { ShelfTagView } from "@/views/ShelfTagView"
import { ResponsivePreviewView } from "@/views/ResponsivePreviewView"
import { LoginModal } from "@/components/modals/LoginModal"
import { ImportJSONModal } from "@/components/modals/ImportJSONModal"
import { EditProductModal } from "@/components/modals/EditProductModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { AccessibilityPanel } from "@/components/modals/AccessibilityPanel"
import { CookieBanner } from "@/components/common/CookieBanner"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { Accessibility } from "lucide-react"

export default function App() {
  const [view, setView] = useState<View>("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginInitialTab, setLoginInitialTab] = useState<LoginTab>("b2c")
  const [addOpen, setAddOpen] = useState(false)
  const [accessOpen, setAccessOpen] = useState(false)
  const [dyslexic, setDyslexic] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem("cyclo_theme")
      if (stored === "light" || stored === "contrast" || stored === "dark") {
        return stored
      }
    } catch {}
    return "light"
  })
  const [cookieDismissed, setCookieDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("cyclo_cookies_accepted") === "true"
    } catch {
      return false
    }
  })
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const [catalog, setCatalog] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : null
      if (Array.isArray(parsed) && parsed.length > 0) {
        const defaultIdSet = new Set(PRODUCTS.map((p) => p.id))
        const customProducts = parsed.filter(
          (p: unknown): p is Product =>
            Boolean(
              p &&
                typeof p === "object" &&
                typeof (p as Product).id === "number" &&
                !defaultIdSet.has((p as Product).id),
            ),
        )
        return [...PRODUCTS, ...customProducts]
      }
      return PRODUCTS
    } catch {
      return PRODUCTS
    }
  })

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    () => catalog[0] ?? PRODUCTS[0],
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
    } catch (e) {
      console.error("Erreur de sauvegarde locale :", e)
    }
  }, [catalog])

  useEffect(() => {
    try {
      localStorage.setItem("cyclo_theme", theme)
    } catch (e) {
      console.error("Erreur de sauvegarde du thème :", e)
    }
    const root = document.documentElement
    root.classList.remove("theme-light", "theme-contrast", "theme-dark", "dark")
    root.classList.add(`theme-${theme}`)
    if (theme === "dark") {
      root.classList.add("dark")
    }
    root.setAttribute("data-theme", theme)
  }, [theme])

  const handleOpenLogin = useCallback((tab: LoginTab = "b2c") => {
    setLoginInitialTab(tab)
    setLoginOpen(true)
  }, [])

  const handleCloseLogin = useCallback(() => {
    setLoginOpen(false)
    setLoginInitialTab("b2c")
  }, [])

  const handleAddProduct = useCallback((p: Product) => {
    setCatalog((c) => [p, ...c])
    setSelectedProduct(p)
    setView("detail")
  }, [])

  const handleEditProduct = useCallback((updated: Product) => {
    setCatalog((c) => c.map((p) => (p.id === updated.id ? updated : p)))
    setSelectedProduct((prev) => (prev.id === updated.id ? updated : prev))
  }, [])

  const handleDeleteProduct = useCallback((id: number) => {
    setCatalog((prevCatalog) => {
      const remaining = prevCatalog.filter((p) => p.id !== id)
      setSelectedProduct((prevSelected) => {
        if (prevSelected.id === id) {
          setView("results")
          return remaining[0] ?? PRODUCTS[0]
        }
        return prevSelected
      })
      return remaining
    })
    setDeleteTarget(null)
  }, [])

  const handleSelectProduct = useCallback((p: Product) => {
    setSelectedProduct(p)
    setView("detail")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    setView("results")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const classNames = useMemo(
    () =>
      [
        `theme-${theme}`,
        theme === "dark" && "dark",
        dyslexic && "mode-dyslexic",
        largeText && "mode-large-text",
      ]
        .filter(Boolean)
        .join(" "),
    [theme, dyslexic, largeText],
  )

  const handleDismissCookies = useCallback(() => {
    setCookieDismissed(true)
    try {
      localStorage.setItem("cyclo_cookies_accepted", "true")
    } catch {}
  }, [])

  if (view === "shelf") {
    return (
      <div className={classNames}>
        <ErrorBoundary fallbackTitle="Erreur sur le studio d'étiquettes">
          <ShelfTagView
            product={selectedProduct}
            onBack={() => setView("detail")}
            theme={theme}
            onAccessibility={() => setAccessOpen(true)}
          />
        </ErrorBoundary>
        <AccessibilityPanel
          open={accessOpen}
          onClose={() => setAccessOpen(false)}
          theme={theme}
          setTheme={setTheme}
          dyslexic={dyslexic}
          setDyslexic={setDyslexic}
          largeText={largeText}
          setLargeText={setLargeText}
        />
      </div>
    )
  }

  if (view === "preview") {
    return (
      <div className={classNames}>
        <ErrorBoundary fallbackTitle="Erreur sur l'aperçu responsive">
          <ResponsivePreviewView
            catalog={catalog}
            onBack={() => setView("results")}
          />
        </ErrorBoundary>
        <AccessibilityPanel
          open={accessOpen}
          onClose={() => setAccessOpen(false)}
          theme={theme}
          setTheme={setTheme}
          dyslexic={dyslexic}
          setDyslexic={setDyslexic}
          largeText={largeText}
          setLargeText={setLargeText}
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${classNames}`}>
      <Header
        view={view}
        onHome={() => setView("home")}
        onResults={() => setView("results")}
        onShowAll={() => {
          setSearchQuery("")
          setView("results")
        }}
        onLoginOpen={handleOpenLogin}
        onAccessibility={() => setAccessOpen(true)}
        onAddAppliance={() => setAddOpen(true)}
        onPreview={() => setView("preview")}
      />

      <main className="pb-28 sm:pb-0">
        {view === "home" && (
          <ErrorBoundary fallbackTitle="Erreur lors de l'affichage de l'accueil">
            <HomeView
              catalog={catalog}
              onSearch={handleSearch}
              onSelectProduct={handleSelectProduct}
            />
          </ErrorBoundary>
        )}
        {view === "results" && (
          <ErrorBoundary fallbackTitle="Erreur lors de l'affichage du catalogue">
            <SearchResultsView
              query={searchQuery}
              catalog={catalog}
              onSelectProduct={handleSelectProduct}
              onAddAppliance={() => setAddOpen(true)}
              onSearchChange={setSearchQuery}
            />
          </ErrorBoundary>
        )}
        {view === "detail" && (
          <ErrorBoundary fallbackTitle="Erreur lors de l'affichage de la fiche produit">
            <ProductDetailView
              product={selectedProduct}
              catalog={catalog}
              onBack={() => setView("results")}
              onShelf={() => setView("shelf")}
              onSelectProduct={handleSelectProduct}
              onEdit={(p) => setEditTarget(p)}
              onDelete={(p) => setDeleteTarget(p)}
            />
          </ErrorBoundary>
        )}
      </main>

      <Footer />

      {/* Desktop accessibility FAB */}
      <button
        onClick={() => setAccessOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={accessOpen}
        aria-label="Ouvrir les options d'accessibilité"
        className="fixed bottom-6 right-6 z-30 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-xl transition-all duration-200 no-print hidden sm:flex items-center gap-2 cursor-pointer"
        style={cookieDismissed ? {} : { bottom: "5.5rem" }}
      >
        <Accessibility className="w-4 h-4 text-emerald-700" />
        <span className="hidden sm:inline">Accessibilité</span>
      </button>

      {/* Mobile bottom navigation */}
      <MobileBottomNav
        view={view}
        onHome={() => setView("home")}
        onResults={() => setView("results")}
        onPreview={() => setView("preview")}
        onLogin={() => handleOpenLogin("b2c")}
        onImport={() => setAddOpen(true)}
      />

      {loginOpen && (
        <LoginModal
          initialTab={loginInitialTab}
          onClose={handleCloseLogin}
        />
      )}
      {addOpen && (
        <ImportJSONModal
          onClose={() => setAddOpen(false)}
          onAddToCatalog={handleAddProduct}
        />
      )}
      {editTarget && (
        <EditProductModal
          product={editTarget}
          onSave={handleEditProduct}
          onClose={() => setEditTarget(null)}
          onDelete={(p) => {
            setEditTarget(null)
            setDeleteTarget(p)
          }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          product={deleteTarget}
          onConfirm={() => handleDeleteProduct(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      <AccessibilityPanel
        open={accessOpen}
        onClose={() => setAccessOpen(false)}
        theme={theme}
        setTheme={setTheme}
        dyslexic={dyslexic}
        setDyslexic={setDyslexic}
        largeText={largeText}
        setLargeText={setLargeText}
      />
      {!cookieDismissed && (
        <CookieBanner onDismiss={handleDismissCookies} />
      )}
    </div>
  )
}
