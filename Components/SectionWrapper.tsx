import React from "react"

export function SectionFade({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "320px",
          background: "linear-gradient(to bottom, rgba(0,0,0,5) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.7) 20%, transparent 40%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "320px",
          background: "linear-gradient(to top, rgba(0,0,0,5) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.7) 20%, transparent 40%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {children}
    </div>
  )
}
