import React from "react"
import { type View } from "@/lib/utils"

export function MobileBottomNav({
  view,
  onHome,
  onResults,
  onLogin,
  onPreview,
  onImport,
}: {
  view: View
  onHome: () => void
  onResults: () => void
  onLogin: () => void
  onPreview?: () => void
  onImport?: () => void
}) {
  const items = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      label: "Accueil",
      action: onHome,
      active: view === "home",
      primary: false,
    },
    {
      icon: (
        <svg
          width="22"
          height="22"
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
      ),
      label: "Catalogue",
      action: onResults,
      active: view === "results",
      primary: true,
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: "Compte",
      action: onLogin,
      active: false,
      primary: false,
    },
  ]
  return (
    <nav
      aria-label="Navigation principale mobile"
      className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur border-t border-slate-100 shadow-lg no-print"
      style={{
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 22px))",
      }}
    >
      <div className="flex items-stretch justify-around px-2 pt-2 pb-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            aria-current={item.active ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center py-1.5 gap-1 transition-all duration-150 relative"
            style={{
              color: item.primary || item.active ? "#047857" : "#94a3b8",
            }}
          >
            {item.primary ? (
              <div
                className="w-12 h-12 -mt-6 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-95 border-4 border-white"
                style={{
                  background: item.active
                    ? "linear-gradient(135deg, #047857, #065f46)"
                    : "linear-gradient(135deg, #059669, #047857)",
                  color: "#ffffff",
                  boxShadow: "0 6px 16px rgba(4, 120, 87, 0.4)",
                }}
              >
                {item.icon}
              </div>
            ) : (
              <div className="w-7 h-7 flex items-center justify-center">
                {item.icon}
              </div>
            )}
            <span
              className={`text-[10px] leading-none ${
                item.primary ? "font-bold text-emerald-700" : "font-semibold"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
