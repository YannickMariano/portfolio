import { useEffect, useRef } from "react";

export default function LightBackground({ dark }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (dark) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating light particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw(ts) {
      const dt = ts * 0.0006;
      ctx.clearRect(0, 0, w, h);

      // Base background color
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#f8fafc");
      bgGrad.addColorStop(1, "#f1f5f9");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Animated Mesh Gradient Orbs
      const orbs = [
        { cx: w * 0.5 + Math.sin(dt * 0.9) * w * 0.35, cy: h * 0.5 + Math.cos(dt * 0.8) * h * 0.35, r: Math.max(w * 0.45, 400), col: "0, 168, 255" }, // Mint Green
        { cx: w * 0.2 + Math.cos(dt * 1.2) * w * 0.25, cy: h * 0.8 + Math.sin(dt * 0.9) * h * 0.25, r: Math.max(w * 0.35, 300), col: "0, 212, 255" }, // Sky Blue
        { cx: w * 0.8 + Math.sin(dt * 0.7) * w * 0.2, cy: h * 0.2 + Math.cos(dt * 1.1) * h * 0.2, r: Math.max(w * 0.4, 350), col: "124, 58, 237" },  // Purple
        { cx: w * 0.3 + Math.cos(dt * 0.8) * w * 0.3, cy: h * 0.3 + Math.sin(dt * 1.3) * h * 0.2, r: Math.max(w * 0.35, 350), col: "255, 150, 200" }, // Soft Pink
      ];

      ctx.globalCompositeOperation = "source-over";

      orbs.forEach(orb => {
        const grad = ctx.createRadialGradient(orb.cx, orb.cy, 0, orb.cx, orb.cy, orb.r);
        grad.addColorStop(0, `rgba(${orb.col}, 0.18)`);
        grad.addColorStop(0.5, `rgba(${orb.col}, 0.05)`);
        grad.addColorStop(1, `rgba(${orb.col}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.cx, orb.cy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle Grid overlay for premium structural feel
      ctx.strokeStyle = "rgba(0, 0, 0, 0.025)";
      ctx.lineWidth = 1;
      const step = 60;
      ctx.beginPath();
      // Only draw grid where necessary to scale
      const offset = (ts * 0.01) % step;
      for (let x = offset; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = offset; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // Draw floating dust particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha * 0.5})`; // Purple dust
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  if (dark) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Background canvas */}
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      
      {/* Soft glassmorphic overlay over the entire light background to make content readable and colors blend smoothly */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        background: "rgba(255, 255, 255, 0.3)"
      }} />
    </div>
  );
}
