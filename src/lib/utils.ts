import { Product } from "@/data/products"

// ─── Types ────────────────────────────────────────────────────────────────────
export type View = "home" | "results" | "detail" | "shelf" | "preview"
export type LoginTab = "b2c" | "b2b"
export type ThemeMode = "light" | "contrast" | "dark"
export const STORAGE_KEY = "cyclo_catalog_v5"

const normCache = new Map<string, string>()

export function normalizeStr(str: unknown): string {
  if (!str || typeof str !== "string") return ""
  const cached = normCache.get(str)
  if (cached !== undefined) return cached
  const res = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ")
    .trim()
  if (normCache.size > 500) normCache.clear()
  normCache.set(str, res)
  return res
}

const priceCache = new Map<string, number>()

export function parsePrice(str: unknown): number {
  if (typeof str === "number" && !isNaN(str)) return Math.round(str)
  if (!str || typeof str !== "string") return 0
  const cached = priceCache.get(str)
  if (cached !== undefined) return cached
  const match = str.match(/\d[\d\s]*/)
  const res = match ? parseInt(match[0].replace(/\s/g, ""), 10) || 0 : 0
  if (priceCache.size > 500) priceCache.clear()
  priceCache.set(str, res)
  return res
}

const productSearchTextCache = new WeakMap<Product, string>()

export function getProductSearchableText(p: Product): string {
  if (!p || typeof p !== "object") return ""
  let text = productSearchTextCache.get(p)
  if (!text) {
    const brand = p.brand || ""
    const model = p.model || ""
    const category = p.category || ""
    const supplier = p.supplier || ""
    const certRef = p.certRef || ""
    const energyGrade = p.energyGrade || ""
    const price = typeof p.price === "string" ? p.price : String(p.price || "")
    text = normalizeStr(
      `${brand} ${model} ${category} ${supplier} ${certRef} classe ${energyGrade} ${price}`,
    )
    productSearchTextCache.set(p, text)
  }
  return text
}

export function matchProduct(p: Product, query: string): boolean {
  if (!p) return false
  if (!query || !query.trim()) return true
  const qNorm = normalizeStr(query)
  const tokens = qNorm.split(/\s+/).filter(Boolean)
  const searchableText = getProductSearchableText(p)
  return tokens.every((token) => searchableText.includes(token))
}

// ─── Fonctions d'adaptation des unités ────────────────────────────────────────
export function getConsumptionDisplay(category?: string, value?: number) {
  const safeVal = typeof value === "number" && !isNaN(value) ? value : 0
  switch (category) {
    case "TV & Écrans":
      return { label: "Puissance en marche", value: `${safeVal} W` }
    case "Réfrigérateur":
      return { label: "Consommation annuelle", value: `${safeVal} kWh/an` }
    case "Smartphone":
      return { label: "Autonomie batterie", value: `${safeVal} h` }
    case "Lave-vaisselle":
    case "Lave-linge":
    default:
      return { label: "Consommation cycle", value: `${safeVal} kWh` }
  }
}

export function getNoiseDisplay(category?: string, noise?: number) {
  const safeNoise = typeof noise === "number" && !isNaN(noise) ? noise : 0
  if (category === "Smartphone") return "Silencieux (N/A)"
  if (category === "TV & Écrans")
    return safeNoise > 0 ? `${safeNoise} dB(A)` : "Silencieux (N/A)"
  return `${safeNoise} dB(A)`
}

export interface SpecEvaluation {
  conso: { status: "good" | "average" | "weak"; label: string }
  noise: { status: "good" | "average" | "weak"; label: string }
  warranty: { status: "good" | "average" | "weak"; label: string }
  recyclability: { status: "good" | "average" | "weak"; label: string }
  carbon: { status: "good" | "average" | "weak"; label: string }
}

const specEvalCache = new WeakMap<Product, SpecEvaluation>()

export function getSpecEvaluation(product: Product): SpecEvaluation {
  const cached = specEvalCache.get(product)
  if (cached) return cached

  const cat = product.category

  // 1. Consommation
  let consoStatus: "good" | "average" | "weak" = "average"
  let consoLabel = "Standard"
  if (cat === "Lave-linge") {
    if (product.consumption <= 45) {
      consoStatus = "good"
      consoLabel = "Très économe"
    } else if (product.consumption <= 50) {
      consoStatus = "average"
      consoLabel = "Standard"
    } else {
      consoStatus = "weak"
      consoLabel = "Élevée"
    }
  } else if (cat === "Lave-vaisselle") {
    if (product.consumption <= 65) {
      consoStatus = "good"
      consoLabel = "Très économe"
    } else if (product.consumption <= 78) {
      consoStatus = "average"
      consoLabel = "Standard"
    } else {
      consoStatus = "weak"
      consoLabel = "Élevée"
    }
  } else if (cat === "Réfrigérateur") {
    if (product.consumption <= 135) {
      consoStatus = "good"
      consoLabel = "Très économe"
    } else if (product.consumption <= 199) {
      consoStatus = "average"
      consoLabel = "Modérée"
    } else {
      consoStatus = "weak"
      consoLabel = "Élevée"
    }
  } else if (cat === "TV & Écrans") {
    if (product.consumption <= 82) {
      consoStatus = "good"
      consoLabel = "Économe"
    } else if (product.consumption <= 95) {
      consoStatus = "average"
      consoLabel = "Standard"
    } else {
      consoStatus = "weak"
      consoLabel = "Énergivore"
    }
  } else if (cat === "Smartphone") {
    if (product.consumption >= 48) {
      consoStatus = "good"
      consoLabel = "Excellente"
    } else if (product.consumption >= 42) {
      consoStatus = "average"
      consoLabel = "Standard"
    } else {
      consoStatus = "weak"
      consoLabel = "Courte"
    }
  }

  // 2. Niveau sonore
  let noiseStatus: "good" | "average" | "weak" = "good"
  let noiseLabel = "Silencieux"
  if (cat === "Smartphone" || cat === "TV & Écrans") {
    noiseStatus = "good"
    noiseLabel = "Inaudible"
  } else if (cat === "Lave-linge") {
    if (product.noise <= 71) {
      noiseStatus = "good"
      noiseLabel = "Silencieux"
    } else if (product.noise <= 75) {
      noiseStatus = "average"
      noiseLabel = "Standard"
    } else {
      noiseStatus = "weak"
      noiseLabel = "Bruyant"
    }
  } else if (cat === "Lave-vaisselle") {
    if (product.noise <= 41) {
      noiseStatus = "good"
      noiseLabel = "Ultra-silencieux"
    } else if (product.noise <= 44) {
      noiseStatus = "average"
      noiseLabel = "Silencieux"
    } else {
      noiseStatus = "weak"
      noiseLabel = "Audible"
    }
  } else if (cat === "Réfrigérateur") {
    if (product.noise <= 35) {
      noiseStatus = "good"
      noiseLabel = "Très silencieux"
    } else if (product.noise <= 37) {
      noiseStatus = "average"
      noiseLabel = "Standard"
    } else {
      noiseStatus = "weak"
      noiseLabel = "Audible"
    }
  }

  // 3. Garantie
  let warrantyStatus: "good" | "average" | "weak" = "average"
  let warrantyLabel = "2 ans (standard)"
  if (product.warranty >= 5) {
    warrantyStatus = "good"
    warrantyLabel = `${product.warranty} ans (remarquable)`
  } else if (product.warranty >= 3) {
    warrantyStatus = "good"
    warrantyLabel = `${product.warranty} ans (étendu)`
  } else {
    warrantyStatus = "average"
    warrantyLabel = "2 ans (standard)"
  }

  // 4. Recyclabilité
  let recyStatus: "good" | "average" | "weak" = "average"
  let recyLabel = "Bonne"
  if (product.recyclability >= 88) {
    recyStatus = "good"
    recyLabel = "Très haute"
  } else if (product.recyclability >= 82) {
    recyStatus = "average"
    recyLabel = "Standard"
  } else {
    recyStatus = "weak"
    recyLabel = "Faible"
  }

  // 5. Carbone fabrication
  let carbonStatus: "good" | "average" | "weak" = "average"
  let carbonLabel = "Moyen"
  if (cat === "Smartphone") {
    if (product.carbon <= 45) {
      carbonStatus = "good"
      carbonLabel = "Très bas"
    } else if (product.carbon <= 65) {
      carbonStatus = "average"
      carbonLabel = "Modéré"
    } else {
      carbonStatus = "weak"
      carbonLabel = "Élevé"
    }
  } else if (cat === "Lave-vaisselle") {
    if (product.carbon <= 180) {
      carbonStatus = "good"
      carbonLabel = "Très bas"
    } else if (product.carbon <= 210) {
      carbonStatus = "average"
      carbonLabel = "Modéré"
    } else {
      carbonStatus = "weak"
      carbonLabel = "Élevé"
    }
  } else {
    if (product.carbon <= 275) {
      carbonStatus = "good"
      carbonLabel = "Très bas"
    } else if (product.carbon <= 340) {
      carbonStatus = "average"
      carbonLabel = "Modéré"
    } else {
      carbonStatus = "weak"
      carbonLabel = "Élevé"
    }
  }

  const result: SpecEvaluation = {
    conso: { status: consoStatus, label: consoLabel },
    noise: { status: noiseStatus, label: noiseLabel },
    warranty: { status: warrantyStatus, label: warrantyLabel },
    recyclability: { status: recyStatus, label: recyLabel },
    carbon: { status: carbonStatus, label: carbonLabel },
  }
  specEvalCache.set(product, result)
  return result
}

// ─── EU Energy Badge ───────────────────────────────────────────────────────────
export const ENERGY_CONFIG: Record<string, { bg: string; text: string }> = {
  A: { bg: "#007a3d", text: "#fff" },
  B: { bg: "#4cae33", text: "#fff" },
  C: { bg: "#b2d235", text: "#1e293b" },
  D: { bg: "#ffed00", text: "#1e293b" },
  E: { bg: "#fbb612", text: "#1e293b" },
  F: { bg: "#ee7203", text: "#fff" },
  G: { bg: "#e2001a", text: "#fff" },
}

export function getEnergyConfig(grade?: string): { bg: string; text: string } {
  const normalized = (grade || "D").trim().toUpperCase()
  return ENERGY_CONFIG[normalized] ?? ENERGY_CONFIG["D"]
}

export const ENERGY_GRADES_LIST = ["A", "B", "C", "D", "E", "F", "G"]
