import { useState, useEffect } from "react";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { NAV_LINKS } from "./data/portfolioData";
import "./styles/animations.css";

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("about");

  useEffect(() => {
    const fn = () => {
      const sections = NAV_LINKS.map((l) => l.toLowerCase());
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          background: dark
            ? "linear-gradient(135deg,#08080f 0%,#0d0d1a 50%,#080812 100%)"
            : "linear-gradient(135deg,#f8fafc 0%,#f0f4ff 50%,#fafff8 100%)",
          transition: "background 0.5s ease",
          cursor: "none",
        }}
      >
        <Cursor />
        <Navbar dark={dark} setDark={setDark} active={active} setActive={setActive} />
        <Hero dark={dark} />
        <Projects dark={dark} />
        <Experience dark={dark} />
        <Skills dark={dark} />
        <Contact dark={dark} />
        <Footer dark={dark} />
      </div>
    </>
  );
}