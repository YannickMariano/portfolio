// ============================================================
// components/SpaceBackground.jsx
// Étoiles en mouvement parallaxe + planètes réalistes mobiles
// + étoiles filantes + nébuleuses
// ============================================================
import { useEffect, useRef } from "react";

export default function SpaceBackground({ dark }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    if (!dark) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ─────────────────────────────────────────────────────
    // ÉTOILES — 3 couches parallaxe avec mouvement fluide
    // ─────────────────────────────────────────────────────
    function pickStarColor() {
      return ["255,255,255","200,220,255","255,240,200","200,255,230","255,200,255"][
        Math.floor(Math.random() * 5)
      ];
    }

    // Couche lointaine : lente, petite
    const starsA = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.55 + 0.1,
      alpha: Math.random() * 0.5 + 0.15,
      twinkle: Math.random() * 0.003 + 0.001,
      tDir: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.025,
      color: pickStarColor(),
    }));

    // Couche milieu : vitesse moyenne
    const starsB = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.9 + 0.35,
      alpha: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * 0.005 + 0.002,
      tDir: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.055,
      color: pickStarColor(),
    }));

    // Couche proche : plus rapide, plus grosse, avec halo
    const starsC = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.7 + 0.25,
      twinkle: Math.random() * 0.007 + 0.003,
      tDir: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.11,
      color: pickStarColor(),
    }));

    function updateDrawStars(layer, halos = false) {
      layer.forEach(s => {
        // Scintillement
        s.alpha += s.twinkle * s.tDir;
        if (s.alpha > 0.95) { s.alpha = 0.95; s.tDir = -1; }
        if (s.alpha < 0.06) { s.alpha = 0.06; s.tDir =  1; }
        // Déplacement
        s.x += s.vx;
        s.y += s.vy;
        // Wrap infini
        if (s.x < -2) s.x = W() + 2;
        if (s.x > W() + 2) s.x = -2;
        if (s.y < -2) s.y = H() + 2;
        if (s.y > H() + 2) s.y = -2;
        // Point
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${s.alpha})`;
        ctx.fill();
        // Halo pour les étoiles proches
        if (halos && s.r > 1.2) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          g.addColorStop(0, `rgba(${s.color},${s.alpha * 0.25})`);
          g.addColorStop(1, `rgba(${s.color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // ─────────────────────────────────────────────────────
    // NÉBULEUSES — dérive lente
    // ─────────────────────────────────────────────────────
    const nebulae = [
      { x: canvas.width * 0.1,  y: canvas.height * 0.15, r: 280, color: "124,58,237",  a: 0.045, phase: 0, driftSpd: 0.0018 },
      { x: canvas.width * 0.85, y: canvas.height * 0.25, r: 230, color: "0,245,160",   a: 0.032, phase: 1, driftSpd: 0.0022 },
      { x: canvas.width * 0.5,  y: canvas.height * 0.62, r: 310, color: "0,100,200",   a: 0.028, phase: 2, driftSpd: 0.0015 },
      { x: canvas.width * 0.2,  y: canvas.height * 0.78, r: 200, color: "236,72,153",  a: 0.030, phase: 3, driftSpd: 0.0020 },
    ];

    // ─────────────────────────────────────────────────────
    // PLANÈTES RÉALISTES — avec types, anneaux, mouvement
    // ─────────────────────────────────────────────────────
    const PLANET_TYPES = ["earth","mars","jupiter","saturn","neptune","lava"];
    const ATMO_COLORS  = {
      earth:"80,160,255", mars:"200,80,40", jupiter:"200,140,60",
      saturn:"200,160,80", neptune:"60,100,220", lava:"220,60,20",
    };

    function makePlanet() {
      const type = PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];
      const r    = Math.random() * 38 + 20;
      return {
        type,
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r,
        vx: (Math.random() - 0.5) * 0.09,
        vy: (Math.random() - 0.5) * 0.04,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() * 0.0012 + 0.0004) * (type === "jupiter" ? 1.8 : 1),
        alpha: Math.random() * 0.22 + 0.18,
      };
    }

    let planets = Array.from({ length: 4 }, makePlanet);

    function drawRealisticPlanet(p) {
      const r = p.r;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);

      // Surface (clip sphère)
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.save(); ctx.clip();

      if (p.type === "earth") {
        const ocean = ctx.createRadialGradient(-r*.25,-r*.25,r*.04,0,0,r);
        ocean.addColorStop(0,"#3a8fda"); ocean.addColorStop(.4,"#1a5fa8");
        ocean.addColorStop(.7,"#0d3d7a"); ocean.addColorStop(1,"#061e45");
        ctx.fillStyle=ocean; ctx.fillRect(-r,-r,r*2,r*2);
        ctx.rotate(p.rot);
        [[-r*.28,-r*.08,r*.38,r*.28,-.3],[r*.18,-r*.12,r*.32,r*.35,.2],
         [r*.5,r*.08,r*.28,r*.22,-.1],[-r*.1,r*.38,r*.22,r*.14,.1]
        ].forEach(([cx,cy,rx,ry,a]) => {
          ctx.save(); ctx.translate(cx,cy); ctx.rotate(a);
          const cg=ctx.createRadialGradient(0,0,0,0,0,Math.max(rx,ry));
          cg.addColorStop(0,"#4a8a3a"); cg.addColorStop(.5,"#3a6a28"); cg.addColorStop(1,"#2a4a18");
          ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.fill(); ctx.restore();
        });
        for(let i=0;i<5;i++){
          const cx=Math.cos(i*1.1+p.rot*.5)*r*.6, cy=Math.sin(i*.9+.4)*r*.45;
          const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,r*.2);
          cg.addColorStop(0,"rgba(255,255,255,.48)"); cg.addColorStop(1,"rgba(255,255,255,0)");
          ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(cx,cy,r*.2,0,Math.PI*2); ctx.fill();
        }
        [[0,-r*.88,r*.26],[0,r*.9,r*.2]].forEach(([px,py,pr]) => {
          const pg=ctx.createRadialGradient(px,py,0,px,py*.85,pr);
          pg.addColorStop(0,"rgba(240,248,255,.85)"); pg.addColorStop(1,"rgba(255,255,255,0)");
          ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.fill();
        });

      } else if (p.type === "mars") {
        const s=ctx.createRadialGradient(-r*.2,-r*.2,r*.05,0,0,r);
        s.addColorStop(0,"#e85c30"); s.addColorStop(.35,"#c94420"); s.addColorStop(.65,"#a83318"); s.addColorStop(1,"#5a0e08");
        ctx.fillStyle=s; ctx.fillRect(-r,-r,r*2,r*2);
        ctx.rotate(p.rot);
        ctx.strokeStyle="rgba(55,12,5,.5)"; ctx.lineWidth=r*.04; ctx.lineCap="round";
        ctx.beginPath(); ctx.moveTo(-r*.55,r*.08); ctx.bezierCurveTo(-r*.1,r*.06,r*.2,r*.12,r*.52,r*.04); ctx.stroke();
        for(let i=0;i<3;i++){
          const dx=Math.cos(i*1.6+p.rot)*r*.5, dy=Math.sin(i*1.2)*r*.4;
          const dg=ctx.createRadialGradient(dx,dy,0,dx,dy,r*.28);
          dg.addColorStop(0,"rgba(210,110,60,.22)"); dg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(dx,dy,r*.28,0,Math.PI*2); ctx.fill();
        }
        const pc=ctx.createRadialGradient(0,-r*.82,0,0,-r*.72,r*.22);
        pc.addColorStop(0,"rgba(255,245,235,.82)"); pc.addColorStop(1,"rgba(255,255,255,0)");
        ctx.fillStyle=pc; ctx.beginPath(); ctx.arc(0,-r*.82,r*.22,0,Math.PI*2); ctx.fill();

      } else if (p.type === "jupiter") {
        const b=ctx.createRadialGradient(-r*.2,-r*.2,r*.04,0,0,r);
        b.addColorStop(0,"#f0c87a"); b.addColorStop(.3,"#d4974a"); b.addColorStop(.6,"#b8742a"); b.addColorStop(1,"#6a3a0a");
        ctx.fillStyle=b; ctx.fillRect(-r,-r,r*2,r*2);
        ctx.rotate(p.rot);
        [[-r*.72,r*.1,"rgba(180,100,50,.55)"],[r*-.5,r*.15,"rgba(240,180,110,.45)"],
         [-r*.22,r*.2,"rgba(140,70,25,.58)"],[r*.15,r*.16,"rgba(220,150,80,.5)"],
         [r*.45,r*.10,"rgba(170,90,40,.55)"]
        ].forEach(([y,h,c]) => {
          ctx.fillStyle=c; ctx.beginPath(); ctx.ellipse(0,y,r*1.05,h,0,0,Math.PI*2); ctx.fill();
        });
        ctx.save(); ctx.translate(r*.15,-r*.06);
        const grs=ctx.createRadialGradient(0,0,0,0,0,r*.2);
        grs.addColorStop(0,"rgba(200,60,30,.75)"); grs.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=grs; ctx.beginPath(); ctx.ellipse(0,0,r*.2,r*.13,0,0,Math.PI*2); ctx.fill(); ctx.restore();

      } else if (p.type === "saturn") {
        const b=ctx.createRadialGradient(-r*.22,-r*.22,r*.04,0,0,r);
        b.addColorStop(0,"#f5d898"); b.addColorStop(.3,"#d4a84a"); b.addColorStop(.65,"#b88830"); b.addColorStop(1,"#6a4810");
        ctx.fillStyle=b; ctx.fillRect(-r,-r,r*2,r*2);
        ctx.rotate(p.rot);
        [-r*.52,-r*.25,0,r*.2,r*.48].forEach((y,i) => {
          ctx.fillStyle=i%2===0?"rgba(180,120,60,.4)":"rgba(220,160,80,.3)";
          ctx.beginPath(); ctx.ellipse(0,y,r*1.05,r*.09,0,0,Math.PI*2); ctx.fill();
        });

      } else if (p.type === "neptune") {
        const b=ctx.createRadialGradient(-r*.22,-r*.22,r*.04,0,0,r);
        b.addColorStop(0,"#4a80f5"); b.addColorStop(.3,"#2255cc"); b.addColorStop(.65,"#1035a0"); b.addColorStop(1,"#051560");
        ctx.fillStyle=b; ctx.fillRect(-r,-r,r*2,r*2);
        ctx.rotate(p.rot);
        [[-r*.2,r*.1,r*.22,r*.14],[r*.28,-r*.22,r*.16,r*.1]].forEach(([cx,cy,rx,ry]) => {
          const sg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(rx,ry));
          sg.addColorStop(0,"rgba(30,50,180,.55)"); sg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=sg; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
        });

      } else if (p.type === "lava") {
        const b=ctx.createRadialGradient(-r*.18,-r*.18,r*.03,0,0,r);
        b.addColorStop(0,"#ff6020"); b.addColorStop(.25,"#cc3010"); b.addColorStop(.55,"#880808"); b.addColorStop(1,"#200000");
        ctx.fillStyle=b; ctx.fillRect(-r,-r,r*2,r*2);
        ctx.rotate(p.rot);
        ctx.strokeStyle="rgba(255,150,0,.55)"; ctx.lineWidth=r*.04; ctx.lineCap="round";
        [[-r*.4,-r*.3,r*.1,r*.3],[r*.2,-r*.5,r*.4,r*.2]].forEach(([x1,y1,x2,y2]) => {
          ctx.beginPath(); ctx.moveTo(x1,y1);
          ctx.bezierCurveTo((x1+x2)*.5+r*.1,y1,x2,(y1+y2)*.5,x2,y2); ctx.stroke();
        });
        [[-r*.3,-r*.35],[r*.2,-r*.2],[r*.05,r*.4]].forEach(([vx,vy]) => {
          const vg=ctx.createRadialGradient(vx,vy,0,vx,vy,r*.2);
          vg.addColorStop(0,"rgba(255,200,50,.6)"); vg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=vg; ctx.beginPath(); ctx.arc(vx,vy,r*.2,0,Math.PI*2); ctx.fill();
        });
      }

      ctx.restore(); // fin clip

      // Anneau Saturne arrière
      if (p.type === "saturn") {
        ctx.save(); ctx.rotate(-.35); ctx.scale(1,.28);
        [{r1:r*1.22,r2:r*1.42,c:"rgba(210,180,120,.45)"},{r1:r*1.44,r2:r*1.65,c:"rgba(190,160,100,.35)"},{r1:r*1.67,r2:r*1.82,c:"rgba(230,200,140,.28)"}]
          .forEach(({r1,r2,c}) => {
            const rg=ctx.createRadialGradient(0,0,r1,0,0,r2);
            rg.addColorStop(0,c); rg.addColorStop(1,"rgba(0,0,0,0)");
            ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(0,0,r2,Math.PI,Math.PI*2); ctx.fill();
          });
        ctx.restore();
      }

      // Ombre nuit
      ctx.save(); ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.clip();
      const night=ctx.createRadialGradient(r*.55,r*.1,0,r*.3,0,r*1.05);
      night.addColorStop(0,"rgba(0,0,0,0)"); night.addColorStop(.52,"rgba(0,0,8,.42)");
      night.addColorStop(.76,"rgba(0,0,5,.70)"); night.addColorStop(1,"rgba(0,0,2,.90)");
      ctx.fillStyle=night; ctx.fillRect(-r,-r,r*2,r*2); ctx.restore();

      // Réflexion lumière
      ctx.save(); ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.clip();
      const shine=ctx.createRadialGradient(-r*.4,-r*.42,0,-r*.2,-r*.22,r*.75);
      shine.addColorStop(0,"rgba(255,255,255,.22)"); shine.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle=shine; ctx.fillRect(-r,-r,r*2,r*2); ctx.restore();

      // Anneau Saturne avant
      if (p.type === "saturn") {
        ctx.save(); ctx.rotate(-.35); ctx.scale(1,.28);
        [{r1:r*1.22,r2:r*1.42,c:"rgba(210,180,120,.45)"},{r1:r*1.44,r2:r*1.65,c:"rgba(190,160,100,.35)"},{r1:r*1.67,r2:r*1.82,c:"rgba(230,200,140,.28)"}]
          .forEach(({r1,r2,c}) => {
            const rg=ctx.createRadialGradient(0,0,r1,0,0,r2);
            rg.addColorStop(0,c); rg.addColorStop(1,"rgba(0,0,0,0)");
            ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(0,0,r2,0,Math.PI); ctx.fill();
          });
        ctx.restore();
      }

      // Halo atmosphérique
      const ac=ATMO_COLORS[p.type]||"150,150,200";
      const atmo=ctx.createRadialGradient(0,0,r*.9,0,0,r*1.3);
      atmo.addColorStop(0,`rgba(${ac},.2)`); atmo.addColorStop(.5,`rgba(${ac},.07)`); atmo.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(0,0,r*1.3,0,Math.PI*2); ctx.fillStyle=atmo; ctx.fill();

      ctx.restore();
    }

    // ─────────────────────────────────────────────────────
    // ÉTOILES FILANTES
    // ─────────────────────────────────────────────────────
    let shootingStars = [];
    let spawnTimer = 0, nextSpawn = 2200 + Math.random() * 2800;

    function spawnShootingStar() {
      const angle = (Math.random() * 30 + 12) * Math.PI / 180;
      const speed = Math.random() * 9 + 5;
      shootingStars.push({
        x: Math.random() * canvas.width * 0.72,
        y: Math.random() * canvas.height * 0.42,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: Math.random() * 150 + 70,
        alpha: 1,
        width: Math.random() * 1.6 + 0.4,
        color: Math.random() > 0.5 ? "0,245,160" : "0,212,255",
      });
    }

    // ─────────────────────────────────────────────────────
    // BOUCLE PRINCIPALE
    // ─────────────────────────────────────────────────────
    let lastTs = 0;

    function draw(ts) {
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;

      ctx.clearRect(0, 0, W(), H());

      // Fond espace profond
      const bg = ctx.createLinearGradient(0, 0, W() * 0.3, H());
      bg.addColorStop(0, "#02000c"); bg.addColorStop(0.3, "#04000e");
      bg.addColorStop(0.7, "#030010"); bg.addColorStop(1, "#01000a");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W(), H());

      // Nébuleuses
      nebulae.forEach(n => {
        n.phase += n.driftSpd;
        const ox = Math.sin(n.phase) * 22;
        const oy = Math.cos(n.phase * 0.7) * 14;
        const g = ctx.createRadialGradient(n.x+ox,n.y+oy,0,n.x+ox,n.y+oy,n.r);
        g.addColorStop(0, `rgba(${n.color},${n.a})`);
        g.addColorStop(.5,`rgba(${n.color},${n.a*.4})`);
        g.addColorStop(1, `rgba(${n.color},0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(n.x+ox,n.y+oy,n.r,0,Math.PI*2); ctx.fill();
      });

      // Étoiles couche lointaine (lente)
      updateDrawStars(starsA, false);
      // Couche milieu
      updateDrawStars(starsB, false);
      // Couche proche (avec halos)
      updateDrawStars(starsC, true);

      // Planètes réalistes en mouvement
      planets.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.rotSpd;
        // Wrap doux
        if (p.x < -p.r * 3) p.x = W() + p.r * 2;
        if (p.x > W() + p.r * 3) p.x = -p.r * 2;
        if (p.y < -p.r * 3) p.y = H() + p.r * 2;
        if (p.y > H() + p.r * 3) p.y = -p.r * 2;
        drawRealisticPlanet(p);
      });

      // Étoiles filantes
      spawnTimer += dt;
      if (spawnTimer > nextSpawn) {
        spawnShootingStar();
        spawnTimer = 0;
        nextSpawn = 1800 + Math.random() * 3000;
      }
      shootingStars = shootingStars.filter(s => s.alpha > 0.02);
      shootingStars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.011;
        const mag  = Math.hypot(s.vx, s.vy);
        const tx   = s.x - (s.vx/mag)*s.len;
        const ty   = s.y - (s.vy/mag)*s.len;
        const grad = ctx.createLinearGradient(tx,ty,s.x,s.y);
        grad.addColorStop(0,  `rgba(${s.color},0)`);
        grad.addColorStop(.6, `rgba(${s.color},${s.alpha*.4})`);
        grad.addColorStop(1,  `rgba(${s.color},${s.alpha})`);
        ctx.strokeStyle=grad; ctx.lineWidth=s.width; ctx.lineCap="round";
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(s.x,s.y); ctx.stroke();
        const hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,7);
        hg.addColorStop(0,`rgba(255,255,255,${s.alpha})`);
        hg.addColorStop(.5,`rgba(${s.color},${s.alpha*.6})`);
        hg.addColorStop(1,`rgba(${s.color},0)`);
        ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(s.x,s.y,7,0,Math.PI*2); ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  if (!dark) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}
