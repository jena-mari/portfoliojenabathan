import Nav from "./components/Nav"
import TrainDoors from "./components/TrainDoors"
import Hero from "./components/Hero"
import TechStack from "./components/TechStack"
import Projects from "./components/Projects"
import Journey from "./components/Journey"
import Photobooth from "./components/Photobooth"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <TrainDoors />
      <Nav />
      <Hero />
      <TechStack />
      <Projects />
      <Journey />
      <Photobooth />
      <Contact />
      <Footer />
    </>
  )
}
