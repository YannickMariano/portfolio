// ============================================================
// components/BSODLoader.jsx
// BSOD Windows identique à la vraie page + transition portfolio
// ============================================================
import { useState, useEffect, useRef } from "react";

// ── QR Code pixel art (SVG inline, pas besoin d'image) ──────
function QRCode() {
  // Matrice 21x21 simplifiée style QR code
  const SIZE = 21;
  const CELL = 4;
  const matrix = [
    "111111101001011111111",
    "100000101010010000011",  // ← corrigé (longueur 21)
    "101110100110010111011",
    "101110101001010111011",
    "101110100110010111011",
    "100000101010010000011",
    "111111101010111111111",
    "000000001101000000001",
    "101110110110101001101",
    "010101001001010010001",
    "110011101010101110111",
    "001100011101001001001",
    "101101100110110110101",
    "000000011001001010001",
    "111111101101101001101",
    "100000100101010010001",
    "101110100110101110111",
    "101110101001001001001",
    "101110100110110110101",
    "100000101010001010001",
    "111111101010111111111",
  ];

  return (
    <div style={{
      background: "#fff",
      padding: 6,
      display: "inline-block",
      width: SIZE * CELL + 12,
      height: SIZE * CELL + 12,
      flexShrink: 0,
    }}>
      <svg
        width={SIZE * CELL}
        height={SIZE * CELL}
        viewBox={`0 0 ${SIZE * CELL} ${SIZE * CELL}`}
      >
        {matrix.map((row, y) =>
          row.split("").map((cell, x) =>
            cell === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x * CELL}
                y={y * CELL}
                width={CELL}
                height={CELL}
                fill="#000"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
export default function BSODLoader({ onDone }) {
  const [percentage, setPercentage] = useState(0);
  const [phase, setPhase] = useState("bsod"); // bsod → fadeout → welcome → done
  const doneRef = useRef(false);

  // ── Progression du pourcentage ───────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            // Attendre 1.2s à 100% puis fadeout
            setTimeout(() => setPhase("fadeout"), 1200);
            // Afficher "Bienvenue" après le fade
            setTimeout(() => setPhase("welcome"), 2000);
            // Appeler onDone après la transition de bienvenue
            setTimeout(() => { setPhase("done"); onDone(); }, 3800);
          }
          return 100;
        }
        // Ralentit vers la fin (plus réaliste)
        const increment = prev < 60 ? 1.2 : prev < 85 ? 0.7 : 0.35;
        return Math.min(100, prev + increment);
      });
    }, 38);
    return () => clearInterval(interval);
  }, [onDone]);

  // ── Styles communs ───────────────────────────────────────
  const BLUE     = "#0078D7";
  const FONT     = "'Segoe UI', 'Helvetica Neue', system-ui, sans-serif";

  // ── Rendu BSOD ───────────────────────────────────────────
  return (
    <>
      {/* ── Écran BSOD ── */}
      <div style={{
        position:   "fixed",
        inset:      0,
        background: BLUE,
        color:      "#fff",
        zIndex:     9999,
        fontFamily: FONT,
        display:    "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding:    "0 clamp(40px, 8vw, 120px)",
        opacity:    phase === "bsod" ? 1 : 0,
        transition: "opacity 0.7s ease",
        pointerEvents: phase === "bsod" ? "auto" : "none",
        userSelect: "none",
      }}>

        {/* ── Émoticône :( ── */}
        <div style={{
          fontSize:   "clamp(80px, 12vw, 130px)",
          fontWeight: 100,
          lineHeight: 1,
          marginBottom: "clamp(20px, 3vh, 36px)",
          letterSpacing: -2,
        }}>
          :(
        </div>

        {/* ── Texte principal ── */}
        <div style={{
          fontSize:   "clamp(15px, 1.8vw, 22px)",
          fontWeight: 400,
          lineHeight: 1.55,
          maxWidth:   680,
          marginBottom: "clamp(18px, 2.5vh, 30px)",
        }}>
          Votre PC a rencontré un problème et doit redémarrer. Nous collectons
          simplement des informations d'erreur, puis nous redémarrerons pour vous.
        </div>

        {/* ── Pourcentage ── */}
        <div style={{
          fontSize:     "clamp(16px, 1.8vw, 21px)",
          fontWeight:   400,
          marginBottom: "clamp(30px, 5vh, 60px)",
        }}>
          <span style={{ fontWeight: 400 }}>{Math.floor(percentage)}% </span>
          <span style={{ fontWeight: 400 }}>complet</span>
        </div>

        {/* ── Bas : QR + texte info ── */}
        <div style={{
          display:    "flex",
          alignItems: "flex-start",
          gap:        "clamp(16px, 2vw, 28px)",
        }}>

          {/* QR Code */}
          <QRCode />

          {/* Texte informatif */}
          <div style={{
            fontSize:   "clamp(11px, 1.1vw, 13.5px)",
            opacity:    0.88,
            lineHeight: 1.65,
            maxWidth:   560,
          }}>
            <div>
              Pour plus d'informations sur ce problème et les correctifs possibles,
              visitez{" "}
              <span style={{ textDecoration: "underline" }}>
                https://www.windows.com/stopcode
              </span>
            </div>
            <div style={{ marginTop: 10 }}>
              Si vous appelez une personne de support, donnez-lui les informations
              suivantes :
            </div>
            <div style={{ marginTop: 6 }}>
              Code d'arrêt :{" "}
              <strong style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
                CRITICAL_PROCESS_DIED
              </strong>
            </div>
          </div>
        </div>

        {/* ── Barre de progression subtile en bas ── */}
        <div style={{
          position:   "absolute",
          bottom:     0,
          left:       0,
          height:     3,
          width:      `${percentage}%`,
          background: "rgba(255,255,255,0.35)",
          transition: "width 0.1s linear",
        }} />
      </div>

      {/* ── Écran de bienvenue (après BSOD) ── */}
      {(phase === "welcome" || phase === "done") && (
        <div style={{
          position:   "fixed",
          inset:      0,
          background: "#03000f",
          zIndex:     9998,
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap:        16,
          animation:  "bsodWelcome 0.8s ease both",
          fontFamily: FONT,
        }}>
          {/* Particules */}
          {[...Array(12)].map((_,i) => (
            <div key={i} style={{
              position:     "absolute",
              width:        Math.random() * 6 + 2,
              height:       Math.random() * 6 + 2,
              borderRadius: "50%",
              background:   ["#00f5a0","#00d4ff","#7c3aed","#f59e0b"][i%4],
              top:          `${Math.random()*100}%`,
              left:         `${Math.random()*100}%`,
              animation:    `particle ${0.8+Math.random()*1.2}s ease-out both`,
              animationDelay: `${Math.random()*0.4}s`,
            }} />
          ))}

          {/* Ligne décorative */}
          <div style={{
            width:      120,
            height:     2,
            background: "linear-gradient(90deg,transparent,#00f5a0,transparent)",
            marginBottom: 8,
            animation:  "lineExpand 0.6s ease 0.3s both",
          }} />

          {/* Texte de bienvenue */}
          <div style={{
            color:      "#00f5a0",
            fontSize:   "clamp(14px,1.3vw,16px)",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            animation:  "bsodWelcome 0.6s ease 0.2s both",
            opacity:    0,
          }}>
            // Connexion établie
          </div>

          <div style={{
            color:      "#fff",
            fontSize:   "clamp(28px,5vw,54px)",
            fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.02em",
            animation:  "bsodWelcome 0.7s ease 0.35s both",
            opacity:    0,
          }}>
            Bienvenue dans<br />
            <span style={{ color: "#00f5a0" }}>mon portfolio</span>
          </div>

          <div style={{
            color:      "rgba(255,255,255,0.45)",
            fontSize:   "clamp(12px,1.2vw,15px)",
            fontFamily: "'Space Mono', monospace",
            animation:  "bsodWelcome 0.7s ease 0.5s both",
            opacity:    0,
            marginTop:  4,
          }}>
            Développeur Fullstack · Madagascar 🇲🇬
          </div>

          {/* Ligne décorative bas */}
          <div style={{
            width:      120,
            height:     2,
            background: "linear-gradient(90deg,transparent,#7c3aed,transparent)",
            marginTop:  8,
            animation:  "lineExpand 0.6s ease 0.6s both",
          }} />
        </div>
      )}

      <style>{`
        @keyframes bsodWelcome {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineExpand {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes particle {
          from { transform: scale(0) translate(0,0); opacity: 1; }
          to   { transform: scale(1) translate(
            calc((var(--px, 50%) - 50%) * 2),
            calc((var(--py, 50%) - 50%) * 2)
          ); opacity: 0; }
        }
      `}</style>
    </>
  );
}
