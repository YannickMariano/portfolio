import { useState, useEffect, useRef } from "react";

// ── OVNI (Soucoupe volante) ──
function UFOsvg() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" style={{ filter: "drop-shadow(0 0 10px rgba(0,255,255,0.5))" }}>
      {/* Dôme */}
      <ellipse cx="40" cy="15" rx="20" ry="12" fill="#00d4ff" opacity="0.8"/>
      <ellipse cx="40" cy="13" rx="16" ry="8" fill="#a5f3ff" opacity="0.9"/>
      
      {/* Corps principal */}
      <ellipse cx="40" cy="28" rx="35" ry="10" fill="#7c3aed"/>
      <ellipse cx="40" cy="26" rx="33" ry="8" fill="#8b5cf6"/>
      
      {/* Rebords */}
      <ellipse cx="40" cy="32" rx="38" ry="6" fill="#6d28d9"/>
      
      {/* Lumières */}
      <circle cx="15" cy="30" r="3" fill="#00f5a0">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="32" r="3" fill="#00f5a0">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="32" r="3" fill="#00f5a0">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="65" cy="30" r="3" fill="#00f5a0">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Rayon lumineux */}
      <polygon points="40,38 20,60 60,60" fill="url(#beam)" opacity="0.3"/>
      
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Étoiles filantes ──
function ShootingStar() {
  return (
    <div style={{
      position: "absolute",
      top: Math.random() * 200 + 50,
      right: 0,
      width: "2px",
      height: "2px",
      background: "white",
      boxShadow: "0 0 10px white",
      animation: `shoot ${Math.random() * 3 + 2}s linear forwards`,
      opacity: 0.8
    }} />
  );
}

export default function DinoLoader({ onDone }) {
  const [phase, setPhase] = useState("error"); // error → ufo → welcome → done
  const [ufoX, setUfoX] = useState(-100);
  const [showStars, setShowStars] = useState([]);
  const [welcomeText, setWelcomeText] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  
  const fullMessage = "BIENVENU SUR MON PORTFOLIO";
  const [messageIndex, setMessageIndex] = useState(0);

  // ── Phase 1 : Page d'erreur Opera (2.5 sec) ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("ufo");
    }, 2800);
    
    // Ajouter des étoiles filantes
    const starInterval = setInterval(() => {
      if (phase === "error") {
        setShowStars(prev => [...prev, Date.now()]);
        setTimeout(() => {
          setShowStars(prev => prev.slice(1));
        }, 3000);
      }
    }, 800);
    
    return () => {
      clearTimeout(timer);
      clearInterval(starInterval);
    };
  }, [phase]);

  // ── Phase 2 : OVNI traverse l'écran ──
  useEffect(() => {
    if (phase !== "ufo") return;
    
    let startX = -100;
    const targetX = window.innerWidth + 100;
    
    function moveUFO() {
      setUfoX(prev => {
        const next = prev + 8;
        if (next >= targetX) {
          setPhase("welcome");
          return targetX;
        }
        return next;
      });
      requestAnimationFrame(moveUFO);
    }
    
    const animation = requestAnimationFrame(moveUFO);
    return () => cancelAnimationFrame(animation);
  }, [phase]);

  // ── Phase 3 : Message de bienvenue (animation lettre par lettre) ──
  useEffect(() => {
    if (phase !== "welcome") return;
    
    setShowWelcome(true);
    
    if (messageIndex < fullMessage.length) {
      const timer = setTimeout(() => {
        setWelcomeText(prev => prev + fullMessage[messageIndex]);
        setMessageIndex(prev => prev + 1);
      }, 80);
      
      return () => clearTimeout(timer);
    } else {
      // Une fois le message complet, attendre 1.5s puis passer à done
      const timer = setTimeout(() => {
        setPhase("done");
        onDone();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [phase, messageIndex, onDone]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f142e 100%)",
        overflow: "hidden",
        fontFamily: "'Segoe UI', 'Opera', 'Arial', sans-serif",
      }}
    >
      {/* ── PAGE D'ERREUR OPERA (IDENTIQUE À LA PHOTO) ── */}
      {phase === "error" && (
        <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}>
          <div style={{
            maxWidth: "700px",
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            padding: "40px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            {/* Titre principal */}
            <h1 style={{
              fontSize: "32px",
              color: "#ffffff",
              marginBottom: "24px",
              fontWeight: "500"
            }}>
              Ce site est inaccessible
            </h1>
            
            {/* Conseils */}
            <div style={{
              marginBottom: "32px",
              color: "#b0b3b8"
            }}>
              <p style={{ marginBottom: "16px", fontWeight: "500" }}>Voici quelques conseils :</p>
              <div style={{ marginLeft: "20px" }}>
                <p style={{ marginBottom: "8px" }}>✓ Exécutez les diagnostics réseau de Windows</p>
                <p style={{ marginBottom: "8px" }}>✓ Changing DNS over HTTPS settings</p>
              </div>
            </div>
            
            {/* Code erreur */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "24px",
              fontFamily: "monospace",
              color: "#ff6b6b"
            }}>
              DNS_PROBE_STARTED
            </div>
            
            {/* Instructions Opera */}
            <div style={{
              background: "rgba(124, 58, 237, 0.1)",
              borderLeft: "3px solid #7c3aed",
              padding: "16px",
              borderRadius: "6px",
              marginBottom: "32px",
              fontSize: "13px",
              color: "#c4b5fd"
            }}>
              <strong>Check your DNS over HTTPS settings</strong><br />
              Go to Opera &gt; Preferences... &gt; System &gt; Use DNS-over-HTTPS instead of the system's DNS settings and check your DNS-over-HTTPS provider.
            </div>
            
            {/* Liste des localhost */}
            <div style={{
              maxHeight: "200px",
              overflowY: "auto",
              fontSize: "12px",
              color: "#6b7280",
              fontFamily: "monospace",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "4px"
            }}>
              <div>www.google.com</div>
              <div>G</div>
              {Array.from({ length: 100 }, (_, i) => (
                <div key={i}>localhost:{8080 + i}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── OVNI EN TRAVERSÉE ── */}
      {phase === "ufo" && (
        <>
          <div style={{
            position: "absolute",
            left: ufoX,
            top: "50%",
            transform: "translateY(-50%)",
            transition: "left 0.02s linear",
            zIndex: 10
          }}>
            <UFOsvg />
          </div>
          
          {/* Effet de traînée lumineuse */}
          <div style={{
            position: "absolute",
            left: ufoX - 50,
            top: "50%",
            transform: "translateY(-50%)",
            width: "100px",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
            filter: "blur(4px)",
            pointerEvents: "none"
          }} />
        </>
      )}

      {/* ── MESSAGE DE BIENVENUE ANIMÉ ── */}
      {phase === "welcome" && showWelcome && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 20,
          animation: "fadeInUp 0.5s ease-out"
        }}>
          <div style={{
            fontSize: "clamp(24px, 5vw, 48px)",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #00d4ff, #7c3aed, #f59e0b)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "2px",
            textShadow: "0 0 30px rgba(0,212,255,0.3)"
          }}>
            {welcomeText}
            {messageIndex < fullMessage.length && (
              <span style={{
                display: "inline-block",
                width: "3px",
                height: "1em",
                background: "#00d4ff",
                marginLeft: "4px",
                animation: "blink 1s infinite"
              }} />
            )}
          </div>
        </div>
      )}

      {/* Étoiles filantes */}
      {phase === "error" && showStars.map(star => (
        <ShootingStar key={star} />
      ))}

      {/* Étoiles de fond */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(white 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        opacity: 0.1
      }} />

      <style>{`
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-200px) translateY(50px);
            opacity: 0;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}