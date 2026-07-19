import React from 'react'
import { AlertTriangle } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-dark text-text-main p-6 border border-red-500/30 rounded-xl">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">3D Scene Failed to Render</h2>
          <p className="text-text-muted text-sm text-center max-w-md">
            {this.state.error?.message || "An unknown rendering error occurred."}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
