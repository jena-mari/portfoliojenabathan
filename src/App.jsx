import Nav from "./components/Nav"
import TrainDoors from "./components/TrainDoors"
import Hero from "./components/Hero"
import TechStack from "./components/TechStack"
import Projects from "./components/Projects"
import Journey from "./components/Journey"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import { ScrollBackground, SectionConnector } from "./components/ScrollSurface"

export default function App() {
  return (
    <>
      <ScrollBackground />
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <TrainDoors />
      <main className="site-content">
        <Hero />
        <SectionConnector stamp />
        <TechStack />
        <SectionConnector flip />
        <Projects />
        <SectionConnector stamp flip />
        <Journey />
        <SectionConnector />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
