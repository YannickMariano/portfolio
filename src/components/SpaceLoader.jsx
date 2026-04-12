import { useState, useEffect, useRef } from "react";

// ── ÉTOILES ──
function Star({ delay, duration, size, initialX, initialY }) {
  return (
    <div
      style={{
        position: "absolute",
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        background: "white",
        borderRadius: "50%",
        boxShadow: `0 0 ${size * 2}px white`,
        opacity: 0,
        animation: `starTrail ${duration}s linear ${delay}s infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

// ── PARTICULES DE VITESSE ──
function SpeedParticle({ angle, distance, delay }) {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "3px",
        height: "3px",
        background: `hsl(${Math.random() * 60 + 200}, 100%, 60%)`,
        borderRadius: "50%",
        opacity: 0,
        animation: `speedLine 0.8s linear ${delay}s infinite`,
        "--tx": `${x}px`,
        "--ty": `${y}px`,
      }}
    />
  );
}

export default function SpaceLoader({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → warp → welcome → done
  const [warpIntensity, setWarpIntensity] = useState(0);
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);
  const [welcomeText, setWelcomeText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  
  const welcomeMessage = "Bienvenue sur mon portfolio";
  const subtitleMessage = "RAKOTONIHARANTSOA Yannick Mariano";

  // ── Générer les étoiles fixes ──
  useEffect(() => {
    const starList = [];
    for (let i = 0; i < 200; i++) {
      starList.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
      });
    }
    setStars(starList);
  }, []);

  // ── Phase 1 : Entrée (warp de plus en plus intense) ──
  useEffect(() => {
    if (phase !== "enter") return;

    let intensity = 0;
    const interval = setInterval(() => {
      intensity += 0.02;
      setWarpIntensity(intensity);
      
      if (intensity >= 1) {
        clearInterval(interval);
        setPhase("warp");
      }
    }, 30);

    return () => clearInterval(interval);
  }, [phase]);

  // ── Phase 2 : Warp maximum + particules ──
  useEffect(() => {
    if (phase !== "warp") return;

    // Générer des particules de vitesse
    const particleList = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 400;
      particleList.push({
        id: i,
        angle,
        distance,
        delay: Math.random() * 0.5,
      });
    }
    setParticles(particleList);

    // Passer à l'écran de bienvenue après 1.8s
    const timer = setTimeout(() => {
      setPhase("welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase]);

  // ── Phase 3 : Message de bienvenue animé ──
  useEffect(() => {
    if (phase !== "welcome") return;

    if (textIndex < welcomeMessage.length) {
      const timer = setTimeout(() => {
        setWelcomeText(prev => prev + welcomeMessage[textIndex]);
        setTextIndex(prev => prev + 1);
      }, 70);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhase("done");
        onDone();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, textIndex, welcomeMessage, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "radial-gradient(ellipse at center, #0a0a2a 0%, #000000 100%)",
        overflow: "hidden",
        fontFamily: "'Orbitron', 'Courier New', monospace",
      }}
    >
      {/* Étoiles fixes */}
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            background: "white",
            borderRadius: "50%",
            opacity: 0.3 + Math.random() * 0.5,
            animation: phase === "warp" ? `starWarp ${0.5}s linear infinite` : "none",
          }}
        />
      ))}

      {/* Effet de lignes de vitesse hypersonique */}
      {phase !== "welcome" && (
        <>
          {/* Lignes horizontales */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`h-${i}`}
              style={{
                position: "absolute",
                top: `${(i / 30) * 100}%`,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, 
                  transparent, 
                  rgba(0, 212, 255, ${0.2 + warpIntensity * 0.8}), 
                  rgba(124, 58, 237, ${0.3 + warpIntensity * 0.7}), 
                  transparent)`,
                transform: `scaleX(${1 + warpIntensity * 2})`,
                opacity: warpIntensity,
                animation: phase === "warp" ? "speedLineMove 0.15s linear infinite" : "none",
              }}
            />
          ))}

          {/* Lignes verticales */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`v-${i}`}
              style={{
                position: "absolute",
                left: `${(i / 20) * 100}%`,
                top: 0,
                bottom: 0,
                width: "2px",
                background: `linear-gradient(180deg, 
                  transparent, 
                  rgba(0, 255, 255, ${0.15 + warpIntensity * 0.6}), 
                  rgba(255, 0, 255, ${0.15 + warpIntensity * 0.6}), 
                  transparent)`,
                transform: `scaleY(${1 + warpIntensity * 2})`,
                opacity: warpIntensity,
                animation: phase === "warp" ? "speedLineMoveVertical 0.12s linear infinite" : "none",
              }}
            />
          ))}

          {/* Lignes diagonales */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`d-${i}`}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${50 + Math.random() * 150}px`,
                height: "1px",
                background: `linear-gradient(90deg, 
                  transparent, 
                  hsl(${200 + Math.random() * 100}, 100%, 60%),
                  transparent)`,
                transform: `rotate(${Math.random() * 360}deg) scaleX(${1 + warpIntensity * 3})`,
                opacity: warpIntensity * 0.5,
                animation: phase === "warp" ? `diagonalMove ${0.08 + Math.random() * 0.1}s linear infinite` : "none",
              }}
            />
          ))}
        </>
      )}

      {/* Particules de vitesse */}
      {phase === "warp" && particles.map(p => (
        <SpeedParticle key={p.id} angle={p.angle} distance={p.distance} delay={p.delay} />
      ))}

      {/* Effet de tunnel central */}
      {(phase === "enter" || phase === "warp") && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${200 * (1 - warpIntensity)}px`,
            height: `${200 * (1 - warpIntensity)}px`,
            borderRadius: "50%",
            boxShadow: `0 0 ${50 + warpIntensity * 100}px rgba(0, 212, 255, 0.8),
                        0 0 ${100 + warpIntensity * 200}px rgba(124, 58, 237, 0.6),
                        inset 0 0 ${30 + warpIntensity * 80}px rgba(0, 212, 255, 0.4)`,
            background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)",
            transition: "all 0.02s linear",
          }}
        />
      )}

      {/* Texte de vitesse / warp */}
      {phase === "enter" && warpIntensity < 0.3 && (
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Orbitron', monospace",
            letterSpacing: "4px",
            fontSize: "14px",
            animation: "blink 1.5s infinite",
          }}
        >
          ⚡ ACTIVATION DU RÉACTEUR HYPERSONIQUE ⚡
        </div>
      )}

      {phase === "enter" && warpIntensity >= 0.3 && warpIntensity < 0.7 && (
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "rgba(0, 212, 255, 0.9)",
            fontFamily: "'Orbitron', monospace",
            letterSpacing: "6px",
            fontSize: "18px",
            fontWeight: "bold",
            animation: "pulse 0.5s infinite",
          }}
        >
          🚀 PRÉPARATION AU WARP 🚀
        </div>
      )}

      {phase === "enter" && warpIntensity >= 0.7 && (
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#f59e0b",
            fontFamily: "'Orbitron', monospace",
            letterSpacing: "8px",
            fontSize: "24px",
            fontWeight: "bold",
            animation: "shake 0.2s infinite",
            textShadow: "0 0 20px #f59e0b",
          }}
        >
          ⚡ WARP ENGAGÉ ⚡
        </div>
      )}

      {/* Écran de bienvenue */}
      {phase === "welcome" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 20,
            animation: "fadeInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          }}
        >
          <div
            style={{
              fontSize: "clamp(20px, 6vw, 48px)",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #00d4ff, #7c3aed, #f59e0b, #ec4899)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "20px",
              textShadow: "0 0 30px rgba(0,212,255,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            {welcomeText}
            {textIndex < welcomeMessage.length && (
              <span
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "1em",
                  background: "linear-gradient(180deg, #00d4ff, #7c3aed)",
                  marginLeft: "8px",
                  animation: "blink 0.8s infinite",
                }}
              />
            )}
          </div>
          
          {textIndex >= welcomeMessage.length && (
            <div
              style={{
                fontSize: "clamp(14px, 3vw, 20px)",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "2px",
                marginTop: "20px",
                animation: "fadeInUp 0.5s ease-out 0.3s both",
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              {subtitleMessage}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes starTrail {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
            opacity: 0;
          }
        }
        
        @keyframes starWarp {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px);
            opacity: 0;
          }
        }
        
        @keyframes speedLineMove {
          0% {
            transform: scaleX(1);
            opacity: 0.3;
          }
          100% {
            transform: scaleX(3);
            opacity: 1;
          }
        }
        
        @keyframes speedLineMoveVertical {
          0% {
            transform: scaleY(1);
            opacity: 0.3;
          }
          100% {
            transform: scaleY(3);
            opacity: 1;
          }
        }
        
        @keyframes diagonalMove {
          0% {
            transform: rotate(var(--rot, 0deg)) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rot, 0deg)) translateX(-300px);
            opacity: 0;
          }
        }
        
        @keyframes speedLine {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; text-shadow: 0 0 10px #00d4ff; }
          50% { opacity: 1; text-shadow: 0 0 30px #00d4ff, 0 0 10px #7c3aed; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, -30%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}