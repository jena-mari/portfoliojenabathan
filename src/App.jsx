import { useEffect, useState } from "react"
import Nav from "./components/Nav"
import TrainDoors from "./components/TrainDoors"
import Hero from "./components/Hero"
import TechStack from "./components/TechStack"
import Projects from "./components/Projects"
import Journey from "./components/Journey"
import { Photobooth } from "./components/Photobooth"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function getPageFromHash() {
  return window.location.hash === "#my-space" ? "my-space" : "portfolio"
}

function PortfolioPage() {
  return (
    <>
      <TrainDoors />
      <Hero />
      <TechStack />
      <Projects />
      <Journey />
      <Contact />
      <Footer />
    </>
  )
}

function MySpacePage() {
  return (
    <main id="my-space" className="min-h-screen bg-[#CCE6FC] pt-20">
      <Photobooth />
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState(() => getPageFromHash())

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    if (page !== "portfolio") return
    const hash = window.location.hash
    if (!hash || hash === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
    })
  }, [page])

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      {page === "my-space" ? <MySpacePage /> : <PortfolioPage />}
    </>
  )
}
