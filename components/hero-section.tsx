"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    // Show text after a short delay
    const textTimeout = setTimeout(() => {
      setShowText(true)
    }, 500)

    return () => {
      clearInterval(cursorInterval)
      clearTimeout(textTimeout)
    }
  }, [])

  // Don't render animations until after hydration
  if (!mounted) {
    return (
      <div className="hero-section">
        <div className="pixel-corner pixel-corner-tl" />
        <div className="pixel-corner pixel-corner-tr" />
        <div className="pixel-corner pixel-corner-bl" />
        <div className="pixel-corner pixel-corner-br" />
        
        <div className="hero-content">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <div className="terminal-button terminal-button-close" />
              <div className="terminal-button terminal-button-minimize" />
              <div className="terminal-button terminal-button-maximize" />
            </div>
            <div className="terminal-title">42_TERMINAL</div>
          </div>
          
          <div className="terminal-body">
            <div className="terminal-text">
              <span className="terminal-prompt">$</span>
              <span>Al Ain, are you ready?</span>
            </div>
            <div className="terminal-subtitle">
              42 Abu Dhabi's Piscine is landing June 16th!
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-section">
      <div className="pixel-corner pixel-corner-tl" />
      <div className="pixel-corner pixel-corner-tr" />
      <div className="pixel-corner pixel-corner-bl" />
      <div className="pixel-corner pixel-corner-br" />
      
      <div className="hero-content">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button terminal-button-close" />
            <div className="terminal-button terminal-button-minimize" />
            <div className="terminal-button terminal-button-maximize" />
          </div>
          <div className="terminal-title">42_TERMINAL</div>
        </div>
        
        <div className="terminal-body">
          <div className="terminal-text">
            <span className="terminal-prompt">$</span>
            <span className={cn("terminal-typing", showText && "show")}>
              Al Ain, are you ready?
            </span>
            <span className={cn("terminal-cursor", showCursor && "show")}>_</span>
          </div>
          <div className="terminal-subtitle">
            42 Abu Dhabi's Piscine is landing June 16th!
          </div>
        </div>
      </div>
    </div>
  )
} 