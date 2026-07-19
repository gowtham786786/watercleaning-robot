import React, { Suspense } from 'react'
import { Hero } from './components/Hero'
import { Dashboard } from './components/Dashboard'
import { InfoPanel } from './components/InfoPanel'
import { Engineering } from './components/Engineering'
import { Content } from './components/Content'
import { Gallery } from './components/Gallery'
import { ErrorBoundary } from './components/ErrorBoundary'
import Scene from './three/Scene'

function App() {
  return (
    <div className="w-full min-h-screen bg-dark text-text-main font-sans selection:bg-primary/30 flex flex-col">
      <Hero />
      
      {/* 3D Viewer Section */}
      <section id="digital-twin" className="relative w-full h-[80vh] min-h-[700px] border-y border-border bg-marine overflow-hidden block">
        
        {/* Canvas Engine */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-marine text-primary gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <span className="text-sm font-mono tracking-widest uppercase">Loading 3D Engine...</span>
              </div>
            }>
              <Scene />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* InfoPanel Overlay */}
        <div className="absolute top-6 right-6 z-10 w-full max-w-[320px] pointer-events-auto">
          <InfoPanel />
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="w-full bg-marine border-b border-border py-12 px-6">
        <div className="max-w-screen-2xl mx-auto">
           <Dashboard />
        </div>
      </section>

      <Engineering />
      <Gallery />
      <Content />
    </div>
  )
}

export default App
