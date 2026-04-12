// ============================================================
// App.jsx — Racine de l'application
// ============================================================
import { useState } from "react";
import { useTheme }         from "./theme/useTheme";
import { useActiveSection } from "./hooks/index.js";

import ParticleLoader from "./components/ParticleLoader.jsx";
import NameLoader       from "./components/NameLoader.jsx";
import SpaceLoader      from "./components/SpaceLoader.jsx";
import OvniLoader       from "./components/OvniLoader";
import WindowsLoader       from "./components/BSODLoader.jsx";
import SpaceBackground  from "./components/SpaceBackground";
import Cursor           from "./components/Cursor";
import Navbar           from "./components/Navbar";
import Hero             from "./components/Hero";
import Projects         from "./components/Projects";
import Experience       from "./components/Experience";
import Skills           from "./components/Skills";
import Contact          from "./components/Contact";
import Footer           from "./components/Footer";

const SECTIONS = ["about", "projets", "experience", "skills", "contact"];

export default function App() {
  const { dark, toggleDark } = useTheme();
  const [active, setActive]  = useActiveSection(SECTIONS);
  const [loaded, setLoaded]  = useState(false);

  return (
    <>
      {/* ── Loader Espace (se retire seul après l'animation) ── */}
      {!loaded && <ParticleLoader onDone={() => setLoaded(true)} />}

      {/* ── App principale ── */}
      <div
        className="min-h-screen transition-colors duration-500 md:cursor-none"
        style={{
          position: "relative",
          color: dark ? "#ffffff" : "#0a0a0f",
          // Fond de base — le canvas Space le recouvre en dark mode
          background: dark
            ? "#03000f"
            : "linear-gradient(135deg,#f8fafc 0%,#f0f4ff 40%,#fafff8 100%)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Canvas étoiles (dark mode uniquement) */}
        <SpaceBackground dark={dark} />

        {/* Tout le contenu passe au-dessus du canvas */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Cursor />
          <Navbar dark={dark} setDark={toggleDark} active={active} setActive={setActive} />
          <main>
            <Hero       dark={dark} />
            <Projects   dark={dark} />
            <Experience dark={dark} />
            <Skills     dark={dark} />
            <Contact    dark={dark} />
          </main>
          <Footer dark={dark} />
        </div>
      </div>
    </>
  );
}
