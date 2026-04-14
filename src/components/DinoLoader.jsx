import { useState, useEffect, useRef } from "react";

// ── VRAI DINO CHROME (identique à la photo) ──
function DinoSVG({ isDucking = false }) {
  return (
    <svg width="44" height="47" viewBox="0 0 44 47" style={{ imageRendering: "pixelated" }}>
      {/* Corps */}
      <rect x="18" y="0" width="8" height="8" fill="#535353"/>
      <rect x="10" y="8" width="24" height="8" fill="#535353"/>
      <rect x="6"  y="16" width="32" height="8" fill="#535353"/>
      <rect x="6"  y="24" width="28" height="8" fill="#535353"/>
      <rect x="10" y="32" width="16" height="8" fill="#535353"/>
      <rect x="26" y="32" width="6" height="6" fill="#535353"/>
      <rect x="14" y="40" width="6" height="7" fill="#535353"/>
      <rect x="24" y="40" width="6" height="7" fill="#535353"/>

      {/* Œil */}
      <rect x="26" y="10" width="4" height="4" fill="#fff"/>
      <rect x="28" y="12" width="2" height="2" fill="#535353"/>
      
      {/* Bouche */}
      <rect x="32" y="24" width="6" height="4" fill="#535353"/>
    </svg>
  );
}

// ── CACTUS OBSTACLE ──
function CactusSVG({ type = "small" }) {
  if (type === "small") {
    return (
      <svg width="20" height="35" viewBox="0 0 20 35" style={{ imageRendering: "pixelated" }}>
        <rect x="6" y="0" width="8" height="28" fill="#2d6a4f"/>
        <rect x="2" y="8" width="6" height="8" fill="#2d6a4f"/>
        <rect x="12" y="12" width="6" height="6" fill="#2d6a4f"/>
        <rect x="6" y="28" width="8" height="7" fill="#1b4332"/>
      </svg>
    );
  } else {
    return (
      <svg width="26" height="45" viewBox="0 0 26 45" style={{ imageRendering: "pixelated" }}>
        <rect x="8" y="0" width="8" height="36" fill="#2d6a4f"/>
        <rect x="16" y="4" width="6" height="10" fill="#2d6a4f"/>
        <rect x="0" y="10" width="6" height="8" fill="#2d6a4f"/>
        <rect x="8" y="36" width="8" height="9" fill="#1b4332"/>
      </svg>
    );
  }
}

export default function DinoLoader({ onDone }) {
  const [phase, setPhase] = useState("fake"); // fake → run → explode → done
  const [dinoX, setDinoX] = useState(100);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const speedRef = useRef(5);

  // ── Phase 1 : Page Chrome hors connexion (2 secondes) ──
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase("run");
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  // ── Phase 2 : Course automatique avec obstacles ──
  useEffect(() => {
    if (phase !== "run") return;

    let lastObstacleFrame = 0;
    let gameLoopRunning = true;

    function gameLoop() {
      if (!gameLoopRunning) return;

      frameRef.current++;
      
      // 1. Déplacer le dinosaure vers la droite
      setDinoX(prev => {
        const newX = prev + speedRef.current;
        speedRef.current = Math.min(speedRef.current + 0.03, 12);
        
        if (newX > window.innerWidth - 120) {
          gameLoopRunning = false;
          setPhase("explode");
          return prev;
        }
        return newX;
      });

      // 2. Générer des obstacles (cactus)
      if (frameRef.current - lastObstacleFrame > 90 && !gameOver) {
        const rand = Math.random();
        if (rand < 0.12) {
          const type = Math.random() > 0.6 ? "big" : "small";
          setObstacles(prev => [...prev, {
            id: Date.now() + Math.random(),
            x: window.innerWidth,
            type: type,
            width: type === "small" ? 20 : 26,
            height: type === "small" ? 35 : 45
          }]);
          lastObstacleFrame = frameRef.current;
        }
      }

      // 3. Déplacer les obstacles et détection collision
      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          x: obs.x - speedRef.current
        })).filter(obs => obs.x + obs.width > 0);

        // Détection collision simplifiée
        const dinoRect = {
          x: dinoX + 10,
          y: window.innerHeight - 127,
          width: 30,
          height: 35
        };

        for (let obs of updated) {
          const obsRect = {
            x: obs.x,
            y: window.innerHeight - 127 - (obs.type === "small" ? 35 : 45) + 30,
            width: obs.width,
            height: obs.height
          };
          
          if (dinoRect.x < obsRect.x + obsRect.width &&
              dinoRect.x + dinoRect.width > obsRect.x &&
              dinoRect.y < obsRect.y + obsRect.height &&
              dinoRect.y + dinoRect.height > obsRect.y) {
            setGameOver(true);
            gameLoopRunning = false;
            setTimeout(() => setPhase("explode"), 100);
            break;
          }
        }

        return updated;
      });

      // 4. Augmenter le score
      setScore(prev => prev + 1);

      rafRef.current = requestAnimationFrame(gameLoop);
    }

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      gameLoopRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, dinoX, gameOver]);

  // ── Phase 3 : Explosion finale ──
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (phase !== "explode") return;

    const pts = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: dinoX + 22,
      y: window.innerHeight - 127,
      vx: (Math.random() - 0.5) * 18,
      vy: -(Math.random() * 12 + 4),
      size: Math.random() * 7 + 3,
      color: ["#00a8ff", "#00d4ff", "#7c3aed", "#f59e0b", "#ec4899", "#ff6b6b"][
        Math.floor(Math.random() * 6)
      ],
    }));

    setParticles(pts);

    const t = setTimeout(() => {
      setPhase("done");
      onDone();
    }, 1200);

    return () => clearTimeout(t);
  }, [phase, dinoX, onDone]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: phase === "fake" ? "#1e1e1e" : "#f5f5f5",
        overflow: "hidden",
        transition: "background 0.4s",
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
      }}
    >
      {/* ── PAGE CHROME HORS CONNEXION (IDENTIQUE À LA PHOTO) ── */}
      {phase === "fake" && (
        <div style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#5f6368",
          textAlign: "center",
          padding: "20px",
        }}>
          <div style={{ marginBottom: "30px" }}>
            <DinoSVG />
          </div>
          
          <p style={{ 
            fontSize: "16px", 
            marginBottom: "20px",
            color: "#5f6368"
          }}>
            Appuyez sur la barre d'espace pour jouer
          </p>
          
          <div style={{ 
            fontSize: "13px", 
            color: "#9aa0a6", 
            textAlign: "left",
            maxWidth: "350px",
            marginBottom: "30px"
          }}>
            <strong>Voici quelques conseils :</strong>
            <br />
            • Vérifiez les câbles réseau, le modem et le routeur.
            <br />
            • Reconnectez-vous au réseau Wi-Fi
            <br />
            • Exécutez les diagnostics réseau de Windows
          </div>
          
          <p style={{ 
            fontSize: "12px", 
            color: "#9aa0a6",
            fontFamily: "monospace"
          }}>
            DNS_PROBE_FINISHED_NO_INTERNET
          </p>
        </div>
      )}

      {/* ── JEU : DINOSAURE + OBSTACLES ── */}
      {phase === "run" && (
        <>
          {/* Score */}
          <div style={{
            position: "absolute",
            top: 40,
            right: 40,
            fontSize: "24px",
            fontFamily: "monospace",
            color: "#535353",
            fontWeight: "bold"
          }}>
            {Math.floor(score / 10)}
          </div>

          {/* Ligne de sol */}
          <div style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            height: "2px",
            background: "#535353"
          }} />

          {/* Dinosaure */}
          <div
            style={{
              position: "absolute",
              left: dinoX,
              bottom: 80,
              transition: "none"
            }}
          >
            <DinoSVG />
          </div>

          {/* Obstacles (cactus) */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              style={{
                position: "absolute",
                left: obs.x,
                bottom: 80,
                transition: "none"
              }}
            >
              <CactusSVG type={obs.type} />
            </div>
          ))}
        </>
      )}

      {/* ── EXPLOSION ── */}
      {phase === "explode" &&
        particles.map(p => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 ${p.size}px ${p.color}`,
              animation: "particle 1s ease-out forwards",
              "--vx": `${p.vx * 30}px`,
              "--vy": `${p.vy * 30}px`,
            }}
          />
        ))}

      <style>{`
        @keyframes particle {
          0% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translate(var(--vx), var(--vy)) scale(0); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}