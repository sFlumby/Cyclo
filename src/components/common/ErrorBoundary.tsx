import React, { Component, ErrorInfo, ReactNode } from "react"
import { RotateCcw, AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Cyclo ErrorBoundary a capturé une erreur :", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-xl p-8 max-w-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {this.props.fallbackTitle ?? "Une erreur inattendue est survenue"}
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              L'affichage de cette section a rencontré un problème technique. Vos données locales restent sécurisées.
            </p>
            {this.state.error && (
              <p className="text-[11px] font-mono text-rose-700 bg-rose-50 p-3 rounded-xl mb-6 text-left overflow-x-auto">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer"
              style={{ background: "#047857" }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recharger l'application</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

