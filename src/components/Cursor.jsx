import { useEffect, useRef } from "react";

export default function Cursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smooth = { x: mouse.x, y: mouse.y };

    let trail = [];
    const TRAIL_LENGTH = 25;

    let particles = [];
    let sparks = [];

    let lastMove = Date.now();
    let lastPos = { x: mouse.x, y: mouse.y };

    let isHover = false;

    // ── PARTICULES ─────────────────────────
    function spawnParticles(x, y, count = 2, spread = 1) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * spread,
          vy: (Math.random() - 0.5) * spread,
          life: 1,
          size: Math.random() * 1.5 + 0.4,
        });
      }
    }

    // ── EXPLOSION CLICK ────────────────────
    function explode(x, y) {
      for (let i = 0; i < 25; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          size: Math.random() * 2 + 0.5,
        });
      }
    }

    // ── MINI ÉTOILES FILANTES ──────────────
    function spawnSpark(x, y, vx, vy) {
      sparks.push({
        x,
        y,
        vx,
        vy,
        life: 1,
        len: Math.random() * 20 + 10,
      });
    }

    // ── EVENTS ─────────────────────────────
    const move = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMove = Date.now();
    };

    const click = () => explode(smooth.x, smooth.y);

    const hoverOn = () => (isHover = true);
    const hoverOff = () => (isHover = false);

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);

    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("mouseenter", hoverOn);
      el.addEventListener("mouseleave", hoverOff);
    });

    // ── ANIMATION ──────────────────────────
    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth follow
      smooth.x += (mouse.x - smooth.x) * 0.18;
      smooth.y += (mouse.y - smooth.y) * 0.18;

      const dx = smooth.x - lastPos.x;
      const dy = smooth.y - lastPos.y;
      const speed = Math.hypot(dx, dy);
      lastPos = { x: smooth.x, y: smooth.y };

      // Trail
      trail.push({ x: smooth.x, y: smooth.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      // ── PARTICULES NORMALES ──
      const isMoving = Date.now() - lastMove < 80;

      if (isMoving) {
        spawnParticles(smooth.x, smooth.y, 2, 1.5);
      } else {
        spawnParticles(
          smooth.x + (Math.random() - 0.5) * 10,
          smooth.y + (Math.random() - 0.5) * 10,
          1,
          0.3
        );
      }

      // ── ÉTOILES FILANTES SI RAPIDE ──
      if (speed > 12) {
        spawnSpark(
          smooth.x,
          smooth.y,
          -dx * 0.4 + (Math.random() - 0.5) * 2,
          -dy * 0.4 + (Math.random() - 0.5) * 2
        );
      }

      // ── TRAÎNÉE ───────────────────────
      if (trail.length > 1) {
        for (let i = 0; i < trail.length - 1; i++) {
          const p1 = trail[i];
          const p2 = trail[i + 1];
          const alpha = i / trail.length;

          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = (isHover ? 3 : 2) * alpha;
          ctx.lineCap = "round";

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // ── PARTICULES ─────────────────────
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) return;

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
        glow.addColorStop(0, `rgba(255,255,255,${p.life})`);
        glow.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);

      // ── MINI SHOOTING STARS ─────────────
      sparks.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.03;

        if (s.life <= 0) return;

        const tailX = s.x - s.vx * s.len;
        const tailY = s.y - s.vy * s.len;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(255,255,255,${s.life})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      });
      sparks = sparks.filter(s => s.life > 0);

      // ── HEAD ────────────────────────────
      const size = isHover ? 8 : 5;

      const headGlow = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, size * 3);
      headGlow.addColorStop(0, "rgba(255,255,255,1)");
      headGlow.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(smooth.x, smooth.y, size, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}