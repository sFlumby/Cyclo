import React, { useState, useMemo } from "react"
import { PRODUCTS, ALL_CATEGORIES, type Product } from "@/data/products"
import { CategoryIcon } from "@/components/ui/CategoryIcon"
import { EnergyBadge, ENERGY_CONFIG } from "@/components/ui/EnergyBadge"
import { RepairabilityScore } from "@/components/ui/ScoreBar"
import {
  Search,
  Home,
  BarChart3,
  User,
  Store,
  Leaf,
  SlidersHorizontal,
  Upload,
  X,
  Smartphone,
  Wrench,
  ShieldCheck,
  Recycle,
  ChevronDown,
  Tv,
} from "lucide-react"
import logoCyclo from "@/imports/Logo_Cyclo_Baniere.png"
import logoCycloIcon from "@/imports/Logo_Cyclo_Haut_Page.png"

function MiniProductCard({
  brand,
  model,
  category,
  grade,
  score,
}: {
  brand: string
  model: string
  category: string
  grade: string
  score: number
}) {
  const cfg = ENERGY_CONFIG[grade] ?? ENERGY_CONFIG["B"]
  const color = score >= 8 ? "#047857" : score >= 6 ? "#f59e0b" : "#ef4444"
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#047857",
              background: "#ecfdf5",
              padding: "1px 7px",
              borderRadius: 999,
              display: "inline-block",
              marginBottom: 4,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.3,
            }}
          >
            {brand}
          </div>
          <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.2 }}>
            {model}
          </div>
        </div>
        <div
          style={{
            background: cfg.bg,
            color: cfg.text,
            fontWeight: 900,
            fontSize: 12,
            width: 26,
            height: 26,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {grade}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <div
          style={{
            flex: 1,
            background: "#f8fafc",
            borderRadius: 8,
            padding: "5px 8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 8, color: "#94a3b8", marginBottom: 2 }}>
            Réparabilité
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color, lineHeight: 1 }}>
            {(typeof score === "number" && !isNaN(score) ? score : 0).toFixed(1)}
            <span style={{ fontSize: 8, fontWeight: 400, color: "#94a3b8" }}>
              /10
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "#f8fafc",
            borderRadius: 8,
            padding: "5px 8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 8, color: "#94a3b8", marginBottom: 2 }}>
            Classe EU
          </div>
          <div style={{ fontSize: 11, fontWeight: 900, color: cfg.bg }}>
            {grade}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          paddingTop: 6,
          borderTop: "1px solid #f1f5f9",
          fontSize: 9,
          color: "#047857",
          fontWeight: 600,
        }}
      >
        Voir fiche ACV →
      </div>
    </div>
  )
}

function MiniHeader({ variant }: { variant: "mobile" | "tablet" | "desktop" }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid #f1f5f9",
        padding: variant === "mobile" ? "10px 14px" : "11px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(8px)",
      }}
    >
      <img
        src={logoCyclo}
        alt="Cyclo"
        style={{ height: variant === "mobile" ? 22 : 26, objectFit: "contain" }}
      />
      {variant === "mobile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[0, 0, 0].map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 1.5,
                background: "#334155",
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}
      {variant === "tablet" && (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {["Tous les appareils", "Espace Magasins"].map((l) => (
            <span
              key={l}
              style={{ fontSize: 10, color: "#475569", fontWeight: 500 }}
            >
              {l}
            </span>
          ))}
          <div
            style={{
              background: "#047857",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 8,
            }}
          >
            Connexion
          </div>
        </div>
      )}
      {variant === "desktop" && (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {["Tous les appareils", "Espace Magasins"].map((l) => (
            <span
              key={l}
              style={{ fontSize: 10, color: "#475569", fontWeight: 500 }}
            >
              {l}
            </span>
          ))}
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#047857",
              padding: "4px 10px",
              border: "1px solid #a7f3d0",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Upload size={11} />
            <span>Importer JSON</span>
          </div>
          <div
            style={{
              background: "#047857",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 8,
            }}
          >
            Se connecter
          </div>
        </div>
      )}
    </div>
  )
}

function MiniFilterBar({ activeCat }: { activeCat: string }) {
  const cats = ["Tous", "Lave-linge", "Lave-vaisselle", "Réfrigérateur"]
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        padding: "10px 14px 0",
      }}
    >
      {cats.map((c) => (
        <div
          key={c}
          style={{
            padding: "3px 10px",
            borderRadius: 999,
            border: `1px solid ${c === activeCat ? "#047857" : "#e2e8f0"}`,
            background: c === activeCat ? "#047857" : "#fff",
            color: c === activeCat ? "#fff" : "#475569",
            fontSize: 9,
            fontWeight: 600,
          }}
        >
          {c}
        </div>
      ))}
    </div>
  )
}

export function ResponsivePreviewView({
  catalog,
  onBack,
}: {
  catalog: Product[]
  onBack: () => void
}) {
  const preview = (catalog ?? []).slice(0, 6)

  const BREAKPOINTS: {
    key: "mobile" | "tablet" | "desktop"
    label: string
    width: number
    cols: number
    note: string
    scale: number
    frameH: number
  }[] = [
    {
      key: "mobile",
      label: "Mobile",
      width: 390,
      cols: 1,
      note: "390px · 1 colonne · Nav bas",
      scale: 0.54,
      frameH: 720,
    },
    {
      key: "tablet",
      label: "Tablette",
      width: 834,
      cols: 2,
      note: "834px · 2 colonnes · Top bar",
      scale: 0.42,
      frameH: 640,
    },
    {
      key: "desktop",
      label: "Bureau",
      width: 1280,
      cols: 3,
      note: "1280px · 3 colonnes · Barre complète",
      scale: 0.31,
      frameH: 580,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: "#0f172a" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <img
            src={logoCyclo}
            alt="Cyclo"
            className="h-7 w-auto object-contain brightness-0 invert opacity-70"
          />
          <div>
            <div className="text-white font-bold text-sm">
              Aperçu Responsive
            </div>
            <div className="text-slate-500 text-xs">
              Vue "Catalogue" · 3 points de rupture simultanés
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {BREAKPOINTS.map((bp) => (
            <div
              key={bp.key}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                }}
              />
              {bp.note.split("·")[0].trim()}
            </div>
          ))}
        </div>
      </div>

      {/* 3-panel display */}
      <div className="overflow-x-auto">
        <div className="flex items-start gap-10 px-8 py-10 min-w-max mx-auto justify-center">
          {BREAKPOINTS.map((bp) => {
            const colCount = bp.cols
            const cardW = Math.floor(
              (bp.width - 32 - (colCount - 1) * 16) / colCount,
            )

            return (
              <div key={bp.key} className="flex flex-col items-center gap-4">
                {/* Label */}
                <div className="text-center">
                  <div className="text-xs font-black text-white uppercase tracking-widest mb-1">
                    {bp.label}
                  </div>
                  <div className="text-[10px] text-slate-500">{bp.note}</div>
                </div>

                {/* Device chrome */}
                <div
                  className="relative"
                  style={{
                    width:
                      bp.width * bp.scale +
                      (bp.key === "mobile"
                        ? 16
                        : bp.key === "tablet"
                          ? 20
                          : 24),
                    height:
                      bp.frameH * bp.scale +
                      (bp.key === "mobile"
                        ? 32
                        : bp.key === "tablet"
                          ? 24
                          : 40),
                  }}
                >
                  {/* Monitor/tablet/phone outline */}
                  {bp.key === "desktop" && (
                    <>
                      <div
                        className="absolute inset-0 rounded-xl border-4 border-slate-600 shadow-2xl"
                        style={{ background: "#1e293b" }}
                      />
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        style={{
                          width: 60,
                          height: 14,
                          background: "#334155",
                          borderRadius: "0 0 4px 4px",
                          transform: `translateX(-50%) translateY(100%)`,
                        }}
                      />
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        style={{
                          width: 100,
                          height: 4,
                          background: "#475569",
                          borderRadius: 2,
                          transform: `translateX(-50%) translateY(calc(100% + 14px))`,
                        }}
                      />
                    </>
                  )}
                  {bp.key === "tablet" && (
                    <div
                      className="absolute inset-0 rounded-2xl border-4 border-slate-600 shadow-2xl"
                      style={{ background: "#1e293b" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 5,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#334155",
                          transform: "translateY(-50%)",
                        }}
                      />
                    </div>
                  )}
                  {bp.key === "mobile" && (
                    <div
                      className="absolute inset-0 rounded-3xl border-4 border-slate-600 shadow-2xl"
                      style={{ background: "#1e293b" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 40,
                          height: 5,
                          borderRadius: 3,
                          background: "#334155",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 8,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 28,
                          height: 4,
                          borderRadius: 2,
                          background: "#334155",
                        }}
                      />
                    </div>
                  )}

                  {/* Scaled content window */}
                  <div
                    style={{
                      position: "absolute",
                      top:
                        bp.key === "mobile"
                          ? 22
                          : bp.key === "tablet"
                            ? 10
                            : 10,
                      left:
                        bp.key === "mobile" ? 8 : bp.key === "tablet" ? 10 : 10,
                      right:
                        bp.key === "mobile" ? 8 : bp.key === "tablet" ? 10 : 10,
                      bottom:
                        bp.key === "mobile"
                          ? 18
                          : bp.key === "tablet"
                            ? 10
                            : 10,
                      overflow: "hidden",
                      borderRadius: bp.key === "mobile" ? 14 : 8,
                      background: "#f8fafc",
                    }}
                  >
                    {/* Scale wrapper */}
                    <div
                      style={{
                        width: bp.width,
                        height: bp.frameH,
                        transform: `scale(${bp.scale})`,
                        transformOrigin: "top left",
                        overflow: "hidden",
                      }}
                    >
                      {/* Simulated page content */}
                      <div
                        style={{
                          background: "#f8fafc",
                          minHeight: bp.frameH,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <MiniHeader variant={bp.key} />

                        {/* Page title row */}
                        <div
                          style={{
                            padding:
                              bp.key === "mobile"
                                ? "14px 14px 0"
                                : "18px 24px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: bp.key === "mobile" ? 14 : 16,
                                fontWeight: 900,
                                color: "#0f172a",
                              }}
                            >
                              <span style={{ color: "#047857" }}>
                                {preview.length} appareils certifiés
                              </span>{" "}
                              dans le catalogue
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#94a3b8",
                                marginTop: 2,
                              }}
                            >
                              Résultats pour : "Lave-linge"
                            </div>
                          </div>
                          {bp.key !== "mobile" && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <div
                                style={{
                                  background: "#fff",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: 10,
                                  padding: "5px 14px",
                                  fontSize: 10,
                                  color: "#475569",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Search size={11} />
                                <span>Filtrer...</span>
                              </div>
                              <div
                                style={{
                                  background: "#ecfdf5",
                                  border: "1px solid #a7f3d0",
                                  borderRadius: 10,
                                  padding: "5px 12px",
                                  fontSize: 10,
                                  color: "#047857",
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Upload size={11} />
                                <span>Importer JSON</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <MiniFilterBar activeCat="Tous" />

                        {/* Persistence badge */}
                        <div
                          style={{
                            padding:
                              bp.key === "mobile" ? "8px 14px" : "8px 24px",
                            display: "flex",
                            justifyContent:
                              bp.key === "mobile" ? "flex-start" : "flex-end",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 10px",
                              borderRadius: 999,
                              background: "#ecfdf5",
                              border: "1px solid #a7f3d0",
                              fontSize: 8.5,
                              fontWeight: 600,
                              color: "#065f46",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "#047857",
                                display: "inline-block",
                              }}
                            />
                            Catalogue persistant · Sauvegarde locale active
                          </div>
                        </div>

                        {/* Card grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                            gap: 12,
                            padding:
                              bp.key === "mobile"
                                ? "0 14px 80px"
                                : bp.key === "tablet"
                                  ? "0 20px 24px"
                                  : "0 24px 24px",
                          }}
                        >
                          {preview.slice(0, colCount * 2).map((p) => (
                            <MiniProductCard
                              key={p.id}
                              brand={p.brand}
                              model={p.model}
                              category={p.category}
                              grade={p.energyGrade}
                              score={p.repairability}
                            />
                          ))}
                        </div>

                        {/* Mobile bottom nav */}
                        {bp.key === "mobile" && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "rgba(255,255,255,0.97)",
                              borderTop: "1px solid #f1f5f9",
                              padding: "6px 0 8px",
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                            }}
                          >
                            {[
                              [<Home size={13} />, "Accueil", false],
                              [<Search size={14} />, "Catalogue", true],
                              [<User size={13} />, "Compte", false],
                            ].map(([icon, label, isPrimary]) => (
                              <div
                                key={label as string}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 2,
                                  color: isPrimary ? "#047857" : "#64748b",
                                }}
                              >
                                {isPrimary ? (
                                  <div
                                    style={{
                                      width: 26,
                                      height: 26,
                                      marginTop: -10,
                                      borderRadius: "50%",
                                      background: "linear-gradient(135deg, #047857, #065f46)",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow: "0 3px 8px rgba(4,120,87,0.4)",
                                      border: "2px solid #fff",
                                    }}
                                  >
                                    {icon as React.ReactNode}
                                  </div>
                                ) : (
                                  <div style={{ lineHeight: 1 }}>
                                    {icon as React.ReactNode}
                                  </div>
                                )}
                                <div
                                  style={{
                                    fontSize: 8,
                                    color: isPrimary ? "#047857" : "#94a3b8",
                                    fontWeight: isPrimary ? 700 : 500,
                                  }}
                                >
                                  {label as string}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs badges */}
                <div className="flex flex-col gap-1.5 items-center">
                  {[
                    bp.key === "mobile"
                      ? ["390px", "1 col", "Nav bas", "8pt grid"]
                      : bp.key === "tablet"
                        ? ["834px", "2 cols", "Top bar", "8pt grid"]
                        : ["1280px", "3 cols", "Barre complète", "8pt grid"],
                  ][0].map((spec) => (
                    <div
                      key={spec}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        color: "#64748b",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 8pt grid reference */}
      <div className="flex items-center justify-center gap-6 px-8 py-5 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
          Système d'espacement 8pt
        </div>
        {[8, 16, 24, 32, 40, 48].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div
              style={{
                width: n / 3,
                height: 12,
                background: "#10b981",
                borderRadius: 2,
                opacity: 0.7,
              }}
            />
            <span className="text-[10px] text-slate-500 font-mono">{n}px</span>
          </div>
        ))}
        <div className="text-[10px] text-slate-600 font-mono ml-2">
          H1: 32px mobile / 48px desktop · Body: 16px
        </div>
      </div>
    </div>
  )
}
