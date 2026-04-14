import { useState } from "react";
import { useIntersect } from "../hooks/useIntersect";
import { SOCIAL_LINKS } from "../data/portfolioData";
import emailjs from "@emailjs/browser";

export default function Contact({ dark }) {
  const [ref, visible] = useIntersect();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState(null);
  const [showSmoke, setShowSmoke] = useState(false);
  const [launchComplete, setLaunchComplete] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        "service_cs7hdru",
        "template_xr5tymt",
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        "vjk3s0BflzG7-9Z7q"
      );

      setSent(true);
      setShowSmoke(true);

      // Réinitialiser après l'animation
      setTimeout(() => {
        setSent(false);
        setShowSmoke(false);
        setLaunchComplete(false);
      }, 4000);

      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi ❌");
    }
  };

  //   const submit = (e) => {
  //   e.preventDefault();

  //   const templateParams = {
  //     name: form.name,
  //     email: form.email,
  //     message: form.message,
  //   };

  //   // 📩 1. Email vers TOI
  //   emailjs
  //     .send(
  //       "service_cs7hdru",
  //       "template_xr5tymt",
  //       templateParams,
  //       "vjk3s0BflzG7-9Z7q"
  //     )
  //     .then(() => {
  //       // 📤 2. Auto-reply vers USER
  //       return emailjs.send(
  //         "service_cs7hdru",
  //         "template_6259pd8",
  //         templateParams,
  //         "vjk3s0BflzG7-9Z7"
  //       );
  //     })
  //     .then(() => {
  //       setSent(true);
  //       setForm({ name: "", email: "", message: "" });

  //       setTimeout(() => setSent(false), 4000);
  //     })
  //     .catch((err) => {
  //       console.error("Erreur email:", err);
  //       alert("Erreur lors de l'envoi ❌");
  //     });
  // };

  // const submit = async (e) => {
  //   e.preventDefault();


  //     setSent(true);
  //     setShowSmoke(true);

  //     // Réinitialiser après l'animation
  //     setTimeout(() => {
  //       setSent(false);
  //       setShowSmoke(false);
  //       setLaunchComplete(false);
  //     }, 4000);

  //     setForm({ name: "", email: "", message: "" });

  // };

  const inputStyle = (field) => ({
    width: "100%", padding: "14px 18px", borderRadius: 10, fontSize: 14.5,
    fontFamily: "'DM Sans', sans-serif",
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(230, 213, 184, 0.15)",
    border: `1px solid ${focus === field ? "#00a8ff" : dark ? "rgba(255,255,255,0.1)" : "rgba(230, 213, 184, 0.6)"}`,
    color: dark ? "#fff" : "#0a0a0f", outline: "none",
    transition: "all 0.2s", boxSizing: "border-box",
    boxShadow: focus === field ? "0 0 0 3px rgba(0,168,255,0.1)" : "none",
  });

  return (
    <section id="contact" className="contact-section" ref={ref} style={{ padding: "120px 2rem 80px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className={dark ? "logo-shine-dark" : "logo-shine-light"} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
            // Travaillons ensemble
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 800,
            color: dark ? "#fff" : "#0a0a0f",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(40px) scale(0.9) skewY(2deg)",
            filter: visible ? "blur(0px)" : "blur(12px)",
            transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            Prendre <span style={{ color: "#00a8ff" }}>Contact</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", marginTop: 16, fontSize: 15 }}>
            Ouvert aux missions freelance, CDI et collaborations open-source.
          </p>
        </div>
        <div style={{
          background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 24, padding: 40,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          {sent ? (
            <div
              style={{
                position: "relative",
                height: 400,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Zone de lancement */}
              <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}>

                {/* Sol / base de lancement */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "linear-gradient(90deg, transparent, #00a8ff, #00d4ff, transparent)",
                  borderRadius: 2,
                }} />

                {/* Traînée de fumée principale */}
                {showSmoke && (
                  <>
                    {/* Bouffées de fumée successives */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`smoke-${i}`}
                        style={{
                          position: "absolute",
                          left: "50%",
                          bottom: 0,
                          width: `${20 + i * 5}px`,
                          height: `${20 + i * 5}px`,
                          background: `radial-gradient(circle, rgba(200,200,200,${0.6 - i * 0.05}), rgba(150,150,150,0))`,
                          borderRadius: "50%",
                          transform: "translateX(-50%)",
                          animation: `smokeRise ${1.5 + i * 0.1}s ease-out forwards`,
                          animationDelay: `${i * 0.08}s`,
                          pointerEvents: "none",
                        }}
                      />
                    ))}

                    {/* Fumée de décollage intense */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`intense-smoke-${i}`}
                        style={{
                          position: "absolute",
                          left: `calc(50% + ${(i % 2 === 0 ? -15 : 15) + (Math.random() * 10 - 5)}px)`,
                          bottom: 0,
                          width: "25px",
                          height: "25px",
                          background: `radial-gradient(circle, rgba(255,255,255,0.8), rgba(200,200,200,0.4))`,
                          borderRadius: "50%",
                          animation: `intenseSmoke ${1.2}s ease-out forwards`,
                          animationDelay: `${i * 0.05}s`,
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Fusée avec l'image PNG */}
                <img
                  src="/fusee.png"
                  alt="Fusée"
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    transform: "translateX(-50%)",
                    width: "64px",
                    height: "64px",
                    objectFit: "contain",
                    animation: "rocketLaunch 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                    zIndex: 10,
                    filter: "drop-shadow(0 0 10px rgba(0,168,255,0.5))",
                  }}
                />

              </div>

              {/* Message de confirmation */}
              <div
                style={{
                  position: "absolute",
                  bottom: 150,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  opacity: 0,
                  animation: "fadeIn 0.8s ease forwards 1.5s",
                  zIndex: 20,
                }}
              >
                <h3 style={{ color: "#00a8ff", marginBottom: 2, fontSize: 40 }}>
                  Message envoyé !
                </h3>
                <p style={{ fontSize: 25, opacity: 0.7 }}>
                  Décollage réussi ! Je vous réponds rapidement
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00a8ff", letterSpacing: "0.1em", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Nom</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocus("name")} onBlur={() => setFocus(null)}
                    placeholder="RAKOTO" required style={inputStyle("name")} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00a8ff", letterSpacing: "0.1em", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                    placeholder="nicky@gmail.com" required style={inputStyle("email")} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00a8ff", letterSpacing: "0.1em", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocus("msg")} onBlur={() => setFocus(null)}
                  placeholder="Bonjour, j'ai un projet..." required rows={5}
                  style={{ ...inputStyle("msg"), resize: "vertical", minHeight: 120 }} />
              </div>
              <button type="submit" style={{
                padding: "16px 40px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#00a8ff,#00d4ff)",
                color: "#0a0a0f", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.08em", transition: "all 0.3s",
                boxShadow: "0 0 40px rgba(0,168,255,0.25)",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                ENVOYER LE MESSAGE →
              </button>
            </form>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 48, flexWrap: "wrap" }}>
          {SOCIAL_LINKS.map((s, index) => {
            const [isHovered, setIsHovered] = useState(false);
            return (
              <a key={s.label} href={s.href}
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 12,
                  color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 40,
                  border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00a8ff";
                  e.currentTarget.style.color = "#00a8ff";
                  setIsHovered(true);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
                  e.currentTarget.style.color = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
                  setIsHovered(false);
                }}>
                {typeof s.icon === 'string' && (s.icon.endsWith('.gif') || s.icon.endsWith('.png') || s.icon.endsWith('.svg')) ? (
                  <img
                    src={isHovered ? s.iconHover || s.icon : s.iconStatic || s.icon}
                    alt={s.label}
                    style={{ width: 20, height: 20, objectFit: "contain", transition: "all 0.3s" }}
                  />
                ) : (
                  <span>{s.icon}</span>
                )}
                {s.label}
              </a>
            );
          })}
        </div>
        <style>{`
          /* Animation de la fusée - décollage bien droit */
          @keyframes rocketLaunch {
            0% {
              transform: translateX(-50%) translateY(0) scale(1);
              opacity: 1;
            }
            30% {
              transform: translateX(-50%) translateY(-80px) scale(1.05);
              opacity: 1;
            }
            70% {
              transform: translateX(-50%) translateY(-250px) scale(0.9);
              opacity: 1;
            }
            100% {
              transform: translateX(-50%) translateY(-450px) scale(0.5);
              opacity: 0;
            }
          }
          
          /* Animation de la fumée qui monte */
          @keyframes smokeRise {
            0% {
              opacity: 0.8;
              transform: translateX(-50%) translateY(0) scale(1);
            }
            50% {
              opacity: 0.6;
              transform: translateX(-50%) translateY(-60px) scale(1.5);
            }
            100% {
              opacity: 0;
              transform: translateX(-50%) translateY(-120px) scale(2.5);
            }
          }
          
          /* Fumée intense au décollage */
          @keyframes intenseSmoke {
            0% {
              opacity: 0.9;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-40px) scale(2);
            }
          }
          
          /* Flamme vacillante */
          @keyframes flameFlicker {
            0%, 100% {
              opacity: 1;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 0.7;
              transform: translateX(-50%) scale(1.2);
            }
          }
          
          /* Apparition du texte */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}