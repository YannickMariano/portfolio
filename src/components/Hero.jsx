import { useState, useEffect } from "react";
import { HERO_ROLES } from "../data/portfolioData";

export default function Hero({ dark }) {
  const [typed, setTyped] = useState("");
  const [ri, setRi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = HERO_ROLES[ri];
    let timeout;
    if (!deleting && typed.length < current.length) {
      timeout = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 80);
    } else if (!deleting && typed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && typed.length > 0) {
      timeout = setTimeout(() => setTyped(typed.slice(0, -1)), 40);
    } else if (deleting && typed.length === 0) {
      setDeleting(false);
      setRi((ri + 1) % HERO_ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [typed, deleting, ri]);

  return (
    <section id="about" className="hero-section" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden", padding: "0 2rem",
    }}>
      {/* Animated BG */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${i % 2 === 0 ? "rgba(0,168,255,0.06)" : "rgba(124,58,237,0.06)"} 0%, transparent 70%)`,
            width: `${300 + i * 80}px`,
            height: `${300 + i * 80}px`,
            top: `${10 + i * 8}%`,
            left: `${-10 + i * 15}%`,
            animation: `float${i} ${6 + i * 2}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))" }}>
        <div>
          <div style={{ animation: "slideUp 0.8s ease both", animationDelay: "0.1s" }}>
            <span className={dark ? "logo-shine-dark" : "logo-shine-light"} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
              // Bonjour, je suis
            </span>
          </div>
          <div style={{ animation: "slideUp 0.8s ease both", animationDelay: "0.1s" }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "clamp(30px,5vw,40px)",
              fontWeight: 500, lineHeight: 1.3, marginBottom: 16,
              color: dark ? "#ffffff" : "#0a0a0f",
              animation: "glitch 8s ease-in-out infinite",
            }}>
              Yannick Mariano<br />
              <span style={{ color: "#00a8ff" }}>RAKOTONIHARANTSOA</span>
            </h1>
          </div>
          <div style={{ animation: "slideUp 0.8s ease both", animationDelay: "0.4s" }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: "clamp(16px,2vw,22px)",
              color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
              marginBottom: 32, minHeight: 32,
            }}>
              <span style={{ color: "#e6d5b8" }}>&gt;</span> {typed}
              <span style={{ animation: "blink 1s infinite", color: "#00a8ff" }}>█</span>
            </div>
          </div>
          <div style={{ animation: "slideUp 0.8s ease both", animationDelay: "0.55s" }}>
            <p color="#00a8ff" style={{
              fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 40,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Transformer vos reves en Réalité. <strong style={{ color: dark ? "#fff" : "#000" }}>Concevoir, Développer, Déployer </strong> votre projets.
              N'hésitez pas à me contacter.
            </p>
          </div>
          <div style={{ animation: "slideUp 0.8s ease both", animationDelay: "0.7s", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                const userConfirmed = window.confirm("Télécharger mon CV ?");
                if (userConfirmed) {
                  window.open("../../Yannick_CV.pdf", "_blank");
                }
              }}
              style={{
                padding: "14px 32px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#00a8ff,#00d4ff)",
                color: "#0a0a0f",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.05em",
                boxShadow: "0 0 30px rgba(0,168,255,0.3)",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 0 50px rgba(0,168,255,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(0,168,255,0.3)";
              }}>
              Télécharger mon CV →
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "14px 32px", borderRadius: 8,
                background: "transparent",
                border: `2px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
                color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em", transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#00a8ff"; e.currentTarget.style.color = "#00a8ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"; e.currentTarget.style.color = dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"; }}>
              Me contacter
            </button>
          </div>
        </div>

        {/* Orbital avatar - Système solaire avec 5 planètes */}
        <div className="orbital-avatar-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeIn 1.2s ease both", animationDelay: "0.5s" }}>
          <div className="orbital-avatar-system" style={{ position: "relative", width: "min(520px, 88vw)", height: 520 }}>

            {/* Soleil - Avatar avec photo */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 150, height: 150,
              zIndex: 3,
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: "linear-gradient(135deg, #00a8ff, #7c3aed, #00d4ff)",
                padding: "3px",
                animation: "pulse 4s ease-in-out infinite",
                boxShadow: "0 0 40px rgba(0,168,255,0.4)",
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  overflow: "hidden",
                  background: dark ? "#1a1a2e" : "#f0f0f0",
                }}>
                  <img
                    src="/Yannick.jpg"
                    alt="Yannick Mariano"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Orbite 1 - Mercure (très proche, très rapide) */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 220, height: 220,
              marginLeft: -110, marginTop: -110,
              borderRadius: "50%",
              animation: "spin 6s linear infinite",
            }}>
              <div style={{
                position: "absolute",
                top: -10, left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  width: 16, height: 16,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #c0c0c0, #8a8a8a)",
                  boxShadow: "0 0 15px rgba(192,192,192,0.6)",
                  animation: "float 2s ease-in-out infinite",
                }} />
              </div>
            </div>

            {/* Orbite 2 - Vénus (proche, rapide) */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 270, height: 270,
              marginLeft: -135, marginTop: -135,
              borderRadius: "50%",
              animation: "spin 9s linear infinite reverse",
            }}>
              <div style={{
                position: "absolute",
                top: -13, left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  width: 22, height: 22,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #f0c27b, #d4a373, #e8b86b)",
                  boxShadow: "0 0 18px rgba(240,194,123,0.6)",
                  animation: "float 2.5s ease-in-out infinite 0.3s",
                }} />
              </div>
            </div>

            {/* Orbite 3 - Terre (moyenne proche) */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 320, height: 320,
              marginLeft: -160, marginTop: -160,
              borderRadius: "50%",
              animation: "spin 12s linear infinite",
            }}>
              <div style={{
                position: "absolute",
                top: -15, left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  width: 26, height: 26,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #4facfe, #00f2fe)",
                  boxShadow: "0 0 22px rgba(79,172,254,0.5)",
                  animation: "float 3s ease-in-out infinite 0.6s",
                  position: "relative",
                }}>
                  {/* Petite lune */}
                  <div style={{
                    position: "absolute",
                    top: -6, right: -9,
                    width: 5, height: 5,
                    borderRadius: "50%",
                    background: "#e0e0e0",
                    boxShadow: "0 0 5px rgba(255,255,255,0.5)",
                    animation: "moonOrbit 2.5s linear infinite",
                  }} />
                </div>
              </div>
            </div>

            {/* Orbite 4 - Mars (moyenne lointaine) */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 380, height: 380,
              marginLeft: -190, marginTop: -190,
              borderRadius: "50%",
              animation: "spin 15s linear infinite reverse",
            }}>
              <div style={{
                position: "absolute",
                top: -18, left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #e57373, #c0392b, #e74c3c)",
                  boxShadow: "0 0 20px rgba(229,115,115,0.6)",
                  animation: "float 3.5s ease-in-out infinite 0.9s",
                  position: "relative",
                }}>
                  {/* Petites taches martiennes */}
                  <div style={{
                    position: "absolute",
                    top: "30%", left: "20%",
                    width: 3, height: 3,
                    borderRadius: "50%",
                    background: "#8b4513",
                    opacity: 0.6,
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: "25%", right: "25%",
                    width: 2, height: 2,
                    borderRadius: "50%",
                    background: "#8b4513",
                    opacity: 0.5,
                  }} />
                </div>
              </div>
            </div>

            {/* Orbite 5 - Jupiter (lointaine, grande) */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 450, height: 450,
              marginLeft: -225, marginTop: -225,
              borderRadius: "50%",
              animation: "spin 20s linear infinite",
            }}>
              <div style={{
                position: "absolute",
                top: -24, left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  width: 42, height: 42,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #d4a373, #b5835a, #8b5a2b)",
                  boxShadow: "0 0 28px rgba(180,130,80,0.6)",
                  animation: "float 4s ease-in-out infinite 1.2s",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Bandes de Jupiter */}
                  <div style={{
                    position: "absolute",
                    top: "30%", left: 0, right: 0,
                    height: 5,
                    background: "rgba(139,90,43,0.5)",
                  }} />
                  <div style={{
                    position: "absolute",
                    top: "55%", left: 0, right: 0,
                    height: 4,
                    background: "rgba(212,163,115,0.4)",
                  }} />
                  {/* Grande tache rouge */}
                  <div style={{
                    position: "absolute",
                    bottom: "20%", right: "25%",
                    width: 8, height: 6,
                    borderRadius: "50%",
                    background: "#c94b4b",
                    opacity: 0.7,
                  }} />
                </div>
              </div>
            </div>

            {/* Orbite 6 - Saturne (très lointaine) */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 510, height: 510,
              marginLeft: -255, marginTop: -255,
              borderRadius: "50%",
              animation: "spin 25s linear infinite reverse",
            }}>
              <div style={{
                position: "absolute",
                top: -28, left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #f5cd94, #e8b86b, #d4a06a)",
                  boxShadow: "0 0 25px rgba(245,205,148,0.5)",
                  animation: "float 4.5s ease-in-out infinite 1.5s",
                  position: "relative",
                }}>
                  {/* Anneau de Saturne */}
                  <div style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    width: 58, height: 16,
                    marginLeft: -29, marginTop: -8,
                    borderRadius: "50%",
                    border: "2px solid rgba(245,205,148,0.8)",
                    background: "transparent",
                    transform: "rotate(-20deg)",
                    boxSizing: "border-box",
                  }} />
                  <div style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    width: 50, height: 10,
                    marginLeft: -25, marginTop: -5,
                    borderRadius: "50%",
                    border: "1px solid rgba(245,205,148,0.5)",
                    background: "transparent",
                    transform: "rotate(-20deg)",
                    boxSizing: "border-box",
                  }} />
                </div>
              </div>
            </div>

            {/* Anneaux décoratifs */}
            {[180, 240, 300, 360, 420, 480, 540].map((r, i) => (
              <div key={i} style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: r, height: r,
                marginLeft: -r / 2, marginTop: -r / 2,
                borderRadius: "50%",
                border: `1px solid ${dark ? `rgba(0,168,255,${0.02 + i * 0.005})` : "rgba(0,0,0,0.01)"}`,
                pointerEvents: "none",
              }} />
            ))}

            {/* Étoiles filantes */}
            {[...Array(16)].map((_, i) => (
              <div
                key={`star-${i}`}
                style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: 2, height: 2,
                  borderRadius: "50%",
                  background: `hsl(${40 + i * 20}, 100%, 70%)`,
                  opacity: 0.5,
                  transform: `rotate(${i * 22.5}deg) translateX(260px)`,
                  animation: "starOrbit 15s linear infinite",
                  animationDelay: `${i * 0.8}s`,
                }}
              />
            ))}
          </div>
        </div>

        <style>{`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 40px rgba(0,168,255,0.4);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 0 60px rgba(0,212,255,0.6);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  @keyframes moonOrbit {
    from {
      transform: rotate(0deg) translateX(11px);
    }
    to {
      transform: rotate(360deg) translateX(11px);
    }
  }

  @keyframes starOrbit {
    from {
      transform: rotate(0deg) translateX(260px);
      opacity: 0.5;
    }
    to {
      transform: rotate(360deg) translateX(260px);
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`}</style>
      </div>
    </section>
  );
}