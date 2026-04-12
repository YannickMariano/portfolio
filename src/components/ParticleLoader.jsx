// ============================================================
// components/ParticleLoader.jsx
// Étincelle orbitale → cercle de particules → texte morphe
// ============================================================
import { useEffect, useRef, useState } from "react";

export default function ParticleLoader({ onDone, name = "Yannick Mariano", acronym = "RYM" }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const [exitAlpha, setExitAlpha] = useState(1);
  const [isDone,    setIsDone]    = useState(false);
  let trail = [];
const MAX_TRAIL = 40; // longueur de la queue

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CX = () => canvas.width  / 2;
    const CY = () => canvas.height / 2;

    // ── Paramètres ────────────────────────────────────────
    const GROW_DURATION     = 3400;  // étincelle tourne et cercle grandit
    const TEXT_DURATION     = 1800;  // texte morphe du centre
    const EXPAND_DURATION   = 1600;  // cercle s'agrandit vers les bords et disparaît
    const FADE_DURATION     = 700;   // fade out final

    // ── État ──────────────────────────────────────────────
    let phase      = "growing";  // growing → text → expand → fade
    let t0         = null;
    let phaseT     = null;
    let orbitAngle = 0;
    let orbitRadius= 0;
    let maxRadius  = 0;
    let particles  = [];
    let bgStars    = [];
    let textScale  = 0;
    let textAlpha  = 0;
    let expandR    = 0;  // rayon d'expansion final (vers les bords)

    // ── Étoiles de fond ───────────────────────────────────
    bgStars = Array.from({ length: 280 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 0.9 + 0.1,
      a:     Math.random() * 0.55 + 0.08,
      speed: Math.random() * 0.004 + 0.001,
      dir:   Math.random() > 0.5 ? 1 : -1,
    }));

    // ── Spawn particules dans le cercle ───────────────────
    function spawnParticles(count) {
      for (let i = 0; i < count; i++) {
        const a   = Math.random() * Math.PI * 2;
        const r   = Math.random() * orbitRadius * 0.95;
        const spd = Math.random() * 0.25 + 0.02;
        particles.push({
          x:    CX() + Math.cos(a) * r,
          y:    CY() + Math.sin(a) * r,
          vx:   (Math.random() - 0.5) * spd,
          vy:   (Math.random() - 0.5) * spd,
          r:    Math.random() * 1.1 + 0.15,
          life: 1,
          decay:Math.random() * 0.0005 + 0.00015,
          // direction vers l'extérieur (pour la phase expand)
          angle: a,
        });
      }
    }

    function spawnTrailParticles(x, y, angle) {
  if (Math.random() > 0.6) return;

  const spread = 0.6;

  particles.push({
    x,
    y,
    vx: Math.cos(angle + (Math.random() - 0.5) * spread) * (Math.random() * 0.8),
    vy: Math.sin(angle + (Math.random() - 0.5) * spread) * (Math.random() * 0.8),
    r: Math.random() * 1.2 + 0.2,
    life: 1,
    decay: Math.random() * 0.02 + 0.01,
    angle,
  });
}

    // ── Dessiner l'étincelle (SANS traîne) ────────────────
function drawShootingSpark() {
  const sx = CX() + Math.cos(orbitAngle) * orbitRadius;
  const sy = CY() + Math.sin(orbitAngle) * orbitRadius;

  // ── STOCKER POSITION ─────────────────────
  trail.unshift({ x: sx, y: sy });

  if (trail.length > MAX_TRAIL) {
    trail.pop();
  }

  // ── DESSIN DE LA TRAÎNÉE (courbe) ─────────
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < trail.length - 1; i++) {
    const p1 = trail[i];
    const p2 = trail[i + 1];

    const alpha = 1 - i / trail.length;

    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 2 * alpha;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // ✨ particules depuis la queue
    if (Math.random() < 0.15) {
      particles.push({
        x: p2.x,
        y: p2.y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.2 + 0.2,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        angle: orbitAngle,
      });
    }
  }

  // ── TÊTE LUMINEUSE ─────────────────────
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 18);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.3, "rgba(200,220,255,0.5)");
  glow.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sx, sy, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
  ctx.fill();
}


    // ── Dessiner le texte avec effet morphe ───────────────
    // Le texte part d'un point central minuscule et grandit
    function drawText(progress) {
      if (progress <= 0) return;

      // ease out expo
      const eased = 1 - Math.pow(1 - Math.min(progress, 1), 4);
      // const scale  = 0.04 + eased * 0.96;  // 4% → 100%
      const scale = 0.02 + Math.pow(eased, 1.4) * 1.2;
      const alpha  = Math.min(progress * 2.5, 1);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(CX(), CY());
      ctx.scale(scale, scale);

      // Acronyme principal
      const acronymSize = Math.round(90);
      ctx.font          = `200 ${acronymSize}px 'Syne', 'Georgia', serif`;
      ctx.textAlign     = "center";
      ctx.textBaseline  = "middle";
      ctx.fillStyle     = "#ffffff";
      ctx.letterSpacing = "0.12em";
      ctx.fillText(acronym, 0, -26);

      // Ligne séparatrice fine
      const lineW = 90;
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth   = 0.6;
      ctx.beginPath();
      ctx.moveTo(-lineW / 2, 4);
      ctx.lineTo( lineW / 2, 4);
      ctx.stroke();

      // Nom complet
      ctx.font      = `200 ${Math.round(20)}px 'DM Sans', sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.letterSpacing = "0.3em";
      ctx.fillText(name.toUpperCase(), 0, 30);

      ctx.shadowColor = "rgba(255,255,255,0.4)";
      ctx.shadowBlur = 20 * (1 - progress);

      ctx.restore();
    }

    // ── Boucle principale ─────────────────────────────────
    function loop(ts) {
      if (!t0)     t0     = ts;
      if (!phaseT) phaseT = ts;

      const elapsed = ts - t0;
      const phaseEl = ts - phaseT;

      // Transition de phase
      if (phase === "growing" && elapsed >= GROW_DURATION) {
        phase  = "text";
        phaseT = ts;
      } else if (phase === "text" && phaseEl >= TEXT_DURATION) {
        phase  = "expand";
        phaseT = ts;
        // Le rayon doit atteindre le coin le plus éloigné de l'écran
        expandR = Math.hypot(canvas.width, canvas.height);
      } else if (phase === "expand" && phaseEl >= EXPAND_DURATION) {
        phase  = "fade";
        phaseT = ts;
      } else if (phase === "fade" && phaseEl >= FADE_DURATION) {
        phase  = "done";
      }

      // ── Calculs selon la phase ───────────────────────────
      const growProgress   = Math.min(elapsed / GROW_DURATION, 1);
      const easeGrow       = 1 - Math.pow(1 - growProgress, 2.2);
      maxRadius            = Math.min(canvas.width, canvas.height) * 0.36;

      if (phase === "growing") {
        orbitRadius  = easeGrow * maxRadius;
        orbitAngle  += (0.020 + easeGrow * 0.014) * 5;
        // Spawn particules proportionnellement à la progression
        if (Math.random() < 0.85) spawnParticles(Math.floor(2 + easeGrow * 5));
      } else if (phase === "text") {
        orbitRadius  = maxRadius;
        orbitAngle  += 0.034;
        if (Math.random() < 0.5) spawnParticles(2);
        textScale = phaseEl / TEXT_DURATION;
        textAlpha = textScale;
      } else if (phase === "expand") {
        const ep     = phaseEl / EXPAND_DURATION;
        const easeEp = 1 - Math.pow(1 - ep, 2);
        // Cercle s'agrandit rapidement vers les bords
        orbitRadius  = maxRadius + easeEp * (expandR - maxRadius);
        orbitAngle  += 0.034;
        textScale    = 1;
        textAlpha    = Math.max(0, 1 - ep * 2.5); // texte disparaît tôt
      }

      // ── Dessin ───────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Étoiles de fond
      bgStars.forEach(s => {
        s.a += s.speed * s.dir;
        if (s.a > 0.75) { s.a = 0.75; s.dir = -1; }
        if (s.a < 0.06) { s.a = 0.06; s.dir =  1; }
        // Apparaissent progressivement à l'intérieur du cercle
        const dist     = Math.hypot(s.x - CX(), s.y - CY());
        let visibility = 0;
        if (phase === "growing") {
          visibility = dist < orbitRadius ? easeGrow : 0;
        } else {
          visibility = 1;
        }
        if (visibility <= 0) return;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * visibility})`;
        ctx.fill();
      });

      // Mise à jour des particules
      particles.forEach(p => {
        if (phase === "expand") {
          // Particules s'éparpillent vers l'extérieur avec le cercle
          const ep    = Math.min((ts - phaseT) / EXPAND_DURATION, 1);
          const force = 0.15 + ep * 1.2;
          p.vx += Math.cos(p.angle) * force;
          p.vy += Math.sin(p.angle) * force;
          p.decay = Math.max(p.decay, 0.008 + ep * 0.04);
        }
        p.x    += p.vx;
        p.y    += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, p.life * 0.82)})`;
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);

      // Cercle lumineux (bord du rayon orbital)
      if ((phase === "growing" || phase === "text" || phase === "expand") && orbitRadius > 4) {
        const ep       = phase === "expand" ? Math.min((ts - phaseT) / EXPAND_DURATION, 1) : 0;
        const circleAlpha = phase === "expand" ? Math.max(0, 1 - ep * 1.4) : 0.18;

        // Cercle de bord très fin et subtil
        ctx.beginPath();
        ctx.arc(CX(), CY(), orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${circleAlpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }

      // Étincelle (seulement pendant growing et text)
      if (phase === "growing" || phase === "text") {
        drawShootingSpark();
      }

      // Texte (morphe pendant text, reste visible pendant expand début)
      if (phase === "text" || phase === "expand") {
        drawText(textAlpha);
      } else if (phase === "growing" && easeGrow > 0.6) {
        // Le texte commence à apparaître très petit à la fin de growing
        drawText((easeGrow - 0.6) * 0.4);
      }

      // ── Phase fade : tout disparaît ───────────────────────
      if (phase === "fade") {
        const fp = phaseEl / FADE_DURATION;
        ctx.fillStyle = `rgba(0,0,0,${Math.min(fp * 1.5, 1)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (fp >= 1) {
          setIsDone(true);
          onDone();
          return;
        }
      }

      if (phase !== "done") {
        animRef.current = requestAnimationFrame(loop);
      }
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onDone, name, acronym]);

  if (isDone) return null;

  return (
    <div style={{
      position: "fixed",
      inset:    0,
      zIndex:   9999,
      background: "#000",
    }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}