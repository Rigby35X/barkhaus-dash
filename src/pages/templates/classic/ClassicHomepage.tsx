"use client"

import React from "react"
import { useLiveSite } from "../../../contexts/LiveSiteContext"
import Hero from "./sections/Hero"
import About from "./sections/About"
import AvailablePets from "./sections/AvailablePets"
import Stats from "./sections/Stats"
import SuccessStories from "./sections/SuccessStories"
import Footer from "./sections/Footer"

const ClassicHomepage = () => {
  const { designSettings } = useLiveSite()

  // Apply design settings to CSS custom properties
  React.useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--primary-color", designSettings.primaryColor)
    root.style.setProperty("--secondary-color", designSettings.secondaryColor)
    root.style.setProperty("--accent-color", designSettings.accentColor)
    root.style.setProperty("--font-family", designSettings.fontFamily)
    root.style.setProperty("--heading-font", designSettings.headingFont)
    root.style.setProperty("--text-color", designSettings.textColor)
    root.style.setProperty("--background-color", designSettings.backgroundColor)
  }, [designSettings])

  return (
    <div className="min-h-screen" style={{ fontFamily: designSettings.fontFamily }}>
      <Hero />
      <About />
      <Stats />
      <AvailablePets />
      <SuccessStories />
      <Footer />
    </div>
  )
}

export default ClassicHomepage
