import { useState, useEffect } from "react";
import { NAV_LINKS } from "../data/portfolioData";

export default function Navbar({ dark, setDark, active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? (dark ? "rgba(8,8,16,0.92)" : "rgba(250, 248, 242, 0.92)") : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${dark ? "rgba(0,168,255,0.15)" : "rgba(0,0,0,0.08)"}` : "none",
      transition: "all 0.4s ease",
      padding: "0 2rem",
    }}>
      <div className="navbar-inner" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 68 }}>
        <div className="navbar-logo" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px" }}>
          <span className={dark ? "logo-shine-dark" : "logo-shine-light"}>&lt;R.Yannick Mariano/&gt;</span>
        </div>
        <div className="navbar-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase())}
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 600,
                color: active === l.toLowerCase() ? "#00a8ff" : (dark ? "rgba(255, 255, 255, 0.8)" : "rgba(0,0,0,0.6)"),
                background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em",
                textTransform: "uppercase", position: "relative", padding: "4px 0",
                transition: "color 0.2s",
              }}>
              {l}
              {active === l.toLowerCase() && (
                <span style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 2, background: "#00a8ff", borderRadius: 2 }} />
              )}
            </button>
          ))}
          <button onClick={() => setDark(!dark)} style={{
            background: dark ? "rgba(0,168,255,0.1)" : "rgba(0,0,0,0.06)",
            border: `1px solid ${dark ? "rgba(230, 213, 184, 0.4)" : "rgba(230, 213, 184, 0.8)"}`,
            borderRadius: 40, padding: "6px 14px", cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.3s",
          }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "3px",
          width: `${scrollProgress * 100}%`,
          background: "linear-gradient(90deg, #00f5a0, #00d4ff, #7c3aed, #ec4899)",
          backgroundSize: "200% 100%",
          animation: "gradientMove 3s linear infinite",
          transition: "width 0.1s linear",
          boxShadow: "0 0 10px rgba(0,245,160,0.6)",

        }
        }

      />
    </nav>
  );
}