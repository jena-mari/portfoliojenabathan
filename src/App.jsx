import Nav from "./components/Nav"
import Hero from "./components/Hero"
import TechStack from "./components/TechStack"
import Projects from "./components/Projects"
import Journey from "./components/Journey"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function TornEdge() {
  return (
    <svg
      className="block w-full h-[60px] -mt-px relative z-[4]"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,20 L40,32 L80,12 L120,28 L160,8 L200,26 L240,14 L280,30 L320,10 L360,24 L400,6 L440,22 L480,16 L520,32 L560,8 L600,26 L640,12 L680,28 L720,10 L760,24 L800,6 L840,22 L880,14 L920,30 L960,10 L1000,26 L1040,12 L1080,28 L1120,8 L1160,24 L1200,14 L1200,60 L0,60 Z"
        fill="#F3EEE1"
      />
    </svg>
  )
}

export default function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <Hero />
      <TornEdge />
      <TechStack />
      <Projects />
      <Journey />
      <Contact />
      <Footer />
    </>
  )
}
