// ============================================================
// components/Skills.jsx — Globe 3D interactif avec logos
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";
import { useIntersect } from "../hooks/useIntersect";
import { SKILLS } from "../data/portfolioData";

// Aplatir les catégories en liste de skills avec champ category + icon
const ALL_SKILLS = SKILLS.flatMap(s => ({ 
  ...s, 
  icon: s.icon, 
  category: s.category 
}));

// ── Distribue N points uniformément sur une sphère (Fibonacci) ─
function fibonacciSphere(n, radius) {
  const pts    = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    pts.push({ x: Math.cos(t) * r * radius, y: y * radius, z: Math.sin(t) * r * radius });
  }
  return pts;
}

// ── Génère les arêtes d'un icosaèdre subdivisé (wireframe) ─────
function buildGeodesicEdges(radius, subdivisions = 2) {
  const t   = (1 + Math.sqrt(5)) / 2;
  const len = Math.sqrt(1 + t * t);
  const raw = [
    [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
    [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
    [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1],
  ];
  const norm = raw.map(([x,y,z]) => ({ x:x/len*radius, y:y/len*radius, z:z/len*radius }));
  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  function mid(a,b) {
    const mx=( a.x+b.x)/2, my=(a.y+b.y)/2, mz=(a.z+b.z)/2;
    const l=Math.sqrt(mx*mx+my*my+mz*mz);
    return { x:mx/l*radius, y:my/l*radius, z:mz/l*radius };
  }
  let cur = faces.map(f => f.map(i => norm[i]));
  for (let s=0; s<subdivisions; s++) {
    const next=[];
    cur.forEach(([a,b,c]) => {
      const ab=mid(a,b), bc=mid(b,c), ca=mid(c,a);
      next.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);
    });
    cur = next;
  }
  const set=new Set(), edges=[];
  cur.forEach(([a,b,c]) => {
    [[a,b],[b,c],[c,a]].forEach(([p,q]) => {
      const key=[p,q].map(v=>`${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`).sort().join('|');
      if (!set.has(key)) { set.add(key); edges.push([p,q]); }
    });
  });
  return edges;
}

// ── Projection 3D → 2D avec rotation ────────────────────────
function makeProjector(angleX, angleY, cx, cy, radius, SIZE) {
  const cosY=Math.cos(angleY), sinY=Math.sin(angleY);
  const cosX=Math.cos(angleX), sinX=Math.sin(angleX);
  const fov = SIZE * 2.2;
  return function project(p) {
    const x1 = p.x*cosY - p.z*sinY;
    const z1 = p.x*sinY + p.z*cosY;
    const y2 = p.y*cosX - z1*sinX;
    const z2 = p.y*sinX + z1*cosX;
    const d  = fov / (fov + z2 + radius*0.5);
    return { sx: cx + x1*d, sy: cy + y2*d, z: z2, scale: d };
  };
}

// ── Emoji → DataURL (fallback si pas d'image) ───────────────
function emojiToDataURL(emoji) {
  const c=document.createElement('canvas'); c.width=64; c.height=64;
  const cx=c.getContext('2d');
  cx.font='48px serif'; cx.textAlign='center'; cx.textBaseline='middle';
  cx.fillText(typeof emoji==='string'?emoji:'❓', 32, 34);
  return c.toDataURL();
}

// ════════════════════════════════════════════════════════════
export default function Skills({ dark }) {
  const [sectionRef, visible] = useIntersect();
  const canvasRef   = useRef(null);
  const animRef     = useRef(null);
  const angleRef    = useRef({ x: 0.35, y: 0 });
  const dragRef     = useRef({ active:false, lastX:0, lastY:0 });
  const hoverRef    = useRef(-1);
  const imagesRef   = useRef([]);
  const [tooltip, setTooltip] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(SKILLS.map(c => c.category))];
  const filteredSkills = activeCategory === 'All'
    ? ALL_SKILLS
    : ALL_SKILLS.filter(s => s.category === activeCategory);

  // ── Préchargement des images ─────────────────────────────
  useEffect(() => {
    imagesRef.current = filteredSkills.map(skill => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const src = skill.icon;
      if (typeof src==='string' && (src.startsWith('/')||src.startsWith('http'))) {
        img.src = src;
      } else {
        img.src = emojiToDataURL(src);
      }
      return img;
    });
  }, [activeCategory]);

  // ── Boucle canvas ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext('2d');

    const SIZE   = Math.min(window.innerWidth * 0.82, 560);
    canvas.width = SIZE; canvas.height = SIZE;
    const cx = SIZE/2, cy = SIZE/2;
    const R  = SIZE * 0.37;

    const points = fibonacciSphere(filteredSkills.length, R);
    const edges  = buildGeodesicEdges(R, 2);

    function draw() {
      ctx.clearRect(0,0,SIZE,SIZE);
      const proj = makeProjector(angleRef.current.x, angleRef.current.y, cx, cy, R, SIZE);

      // Fond sphère
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      bg.addColorStop(0,   dark ? 'rgba(18,8,38,0.88)' : 'rgba(240,245,255,0.92)');
      bg.addColorStop(0.7, dark ? 'rgba(8,4,20,0.78)'  : 'rgba(228,238,255,0.82)');
      bg.addColorStop(1,   dark ? 'rgba(4,2,12,0.45)'  : 'rgba(215,230,255,0.45)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle=bg; ctx.fill();

      // Halo extérieur
      const halo = ctx.createRadialGradient(cx,cy,R*0.82,cx,cy,R*1.18);
      halo.addColorStop(0,   dark?'rgba(0,245,160,0.09)':'rgba(0,200,130,0.07)');
      halo.addColorStop(0.6, dark?'rgba(124,58,237,0.06)':'rgba(100,40,200,0.04)');
      halo.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(cx,cy,R*1.18,0,Math.PI*2);
      ctx.fillStyle=halo; ctx.fill();

      // Wireframe (clippé dans la sphère)
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,R*0.995,0,Math.PI*2); ctx.clip();
      edges.forEach(([a,b]) => {
        const pa=proj(a), pb=proj(b);
        const avgZ=(pa.z+pb.z)/2;
        const alpha = Math.max(0, (avgZ+R)/(2*R)) * (dark?0.20:0.13);
        if (alpha<0.018) return;
        ctx.beginPath(); ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy);
        ctx.strokeStyle = dark?`rgba(210,100,45,${alpha})`:`rgba(160,80,30,${alpha})`;
        ctx.lineWidth=0.55; ctx.stroke();
      });
      ctx.restore();

      // Contour brillant
      const rim = ctx.createLinearGradient(cx-R,cy,cx+R,cy);
      rim.addColorStop(0,   dark?'rgba(0,245,160,0.55)':'rgba(0,190,120,0.4)');
      rim.addColorStop(0.5, dark?'rgba(124,58,237,0.45)':'rgba(100,40,200,0.3)');
      rim.addColorStop(1,   dark?'rgba(0,212,255,0.55)':'rgba(0,160,220,0.4)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.strokeStyle=rim; ctx.lineWidth=1.5; ctx.stroke();

      // Logos triés par Z (back → front)
      const projected = points.map((p,i) => ({ ...proj(p), i }))
                              .sort((a,b) => a.z-b.z);

      projected.forEach(({ sx, sy, z, scale, i }) => {
        const skill = filteredSkills[i]; if (!skill) return;
        const img   = imagesRef.current[i];
        const depth = (z+R)/(2*R);
        const alpha = 0.22 + depth*0.78;
        const size  = (22 + depth*30)*scale;
        const isHov = hoverRef.current===i;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(sx, sy);

        // Halo hover
        if (isHov) {
          const glow=ctx.createRadialGradient(0,0,0,0,0,size*1.5);
          glow.addColorStop(0,'rgba(0,245,160,0.4)');
          glow.addColorStop(1,'rgba(0,245,160,0)');
          ctx.fillStyle=glow;
          ctx.beginPath(); ctx.arc(0,0,size*1.5,0,Math.PI*2); ctx.fill();
          ctx.scale(1.16,1.16);
        }

        // Fond circulaire
        ctx.beginPath(); ctx.arc(0,0,size*0.7,0,Math.PI*2);
        ctx.fillStyle = dark?`rgba(12,6,28,0.6)`:`rgba(255,255,255,0.78)`;
        ctx.fill();
        ctx.strokeStyle = isHov?'rgba(0,245,160,1)':dark?'rgba(255,255,255,0.14)':'rgba(0,0,0,0.1)';
        ctx.lineWidth=isHov?1.8:0.7; ctx.stroke();

        // Logo image
        if (img && img.complete && img.naturalWidth>0) {
          const hs=size*0.52;
          ctx.drawImage(img,-hs,-hs,hs*2,hs*2);
        } else {
          ctx.fillStyle=dark?'#fff':'#222';
          ctx.font=`bold ${size*0.42}px sans-serif`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText(skill.name.slice(0,2),0,0);
        }

        // Label (face avant uniquement)
        if (depth>0.52) {
          ctx.fillStyle = isHov?'#00f5a0': dark?'rgba(255,255,255,0.72)':'rgba(0,0,0,0.65)';
          ctx.font=`${isHov?'bold ':''}${Math.max(8,size*0.3)}px 'Space Mono',monospace`;
          ctx.textAlign='center'; ctx.textBaseline='top';
          ctx.fillText(skill.name, 0, size*0.75);
        }
        ctx.restore();
      });

      // Reflet lustre
      const shine=ctx.createRadialGradient(cx-R*0.3,cy-R*0.35,0,cx-R*0.1,cy-R*0.1,R*0.65);
      shine.addColorStop(0,dark?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.42)');
      shine.addColorStop(0.5,dark?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.12)');
      shine.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle=shine; ctx.fill();
    }

    let last=0;
    function loop(ts) {
      const dt=Math.min((ts-last)/16,3); last=ts;
      if (!dragRef.current.active) {
        angleRef.current.y += 0.006*dt;
        angleRef.current.x += (0.28-angleRef.current.x)*0.006*dt;
      }
      draw();
      animRef.current=requestAnimationFrame(loop);
    }
    animRef.current=requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [visible, filteredSkills, dark]);

  // ── Interactions souris ──────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    const canvas=canvasRef.current; if (!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    const SIZE=canvas.width, cx=SIZE/2, cy=SIZE/2, R=SIZE*0.37;

    if (dragRef.current.active) {
      angleRef.current.y -= (e.clientX-dragRef.current.lastX)*0.008;
      angleRef.current.x -= (e.clientY-dragRef.current.lastY)*0.008;
      dragRef.current.lastX=e.clientX; dragRef.current.lastY=e.clientY;
      return;
    }

    const pts=fibonacciSphere(filteredSkills.length,R);
    const proj=makeProjector(angleRef.current.x,angleRef.current.y,cx,cy,R,SIZE);
    let best=-1, bestD=40;
    pts.forEach((p,i) => {
      const {sx,sy,z,scale}=proj(p);
      const depth=(z+R)/(2*R); if (depth<0.28) return;
      const size=(22+depth*30)*scale;
      const d=Math.hypot(mx-sx,my-sy);
      if (d<size*0.88&&d<bestD){bestD=d;best=i;}
    });
    hoverRef.current=best;
    canvas.style.cursor=best>=0?'pointer':'grab';
    if (best>=0) {
      const s=filteredSkills[best];
      setTooltip({name:s.name,category:s.category,x:e.clientX,y:e.clientY});
    } else setTooltip(null);
  },[filteredSkills]);

  const onDown =(e)=>{ dragRef.current={active:true,lastX:e.clientX,lastY:e.clientY}; canvasRef.current.style.cursor='grabbing'; };
  const onUp   =()=>{ dragRef.current.active=false; if(canvasRef.current) canvasRef.current.style.cursor='grab'; };
  const onTouch=(e)=>{ const t=e.touches[0]; dragRef.current={active:true,lastX:t.clientX,lastY:t.clientY}; };
  const onTMove=(e)=>{
    const t=e.touches[0];
    angleRef.current.y-=(t.clientX-dragRef.current.lastX)*0.01;
    angleRef.current.x-=(t.clientY-dragRef.current.lastY)*0.01;
    dragRef.current.lastX=t.clientX; dragRef.current.lastY=t.clientY;
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <section id="skills" ref={sectionRef} style={{padding:'120px 2rem',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,245,160,0.4),transparent)'}}/>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,245,160,0.04) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <div style={{maxWidth:1100,margin:'0 auto'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:'#00f5a0',letterSpacing:'0.3em',textTransform:'uppercase',marginBottom:12}}>
            // Mon arsenal tech
          </div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(36px,5vw,56px)',fontWeight:800,color:dark?'#fff':'#0a0a0f',opacity:visible?1:0,transform:visible?'none':'translateY(30px)',transition:'all 0.8s ease'}}>
            Compétences <span style={{color:'#00f5a0'}}>Techniques</span>
          </h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:dark?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.45)',fontSize:14,marginTop:14}}>
            Faites tourner le globe · Survolez un logo pour les détails
          </p>
        </div>

        {/* Filtres */}
        <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:48,flexWrap:'wrap'}}>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)} style={{
              fontFamily:"'Space Mono',monospace",fontSize:11,padding:'8px 20px',
              borderRadius:40,cursor:'pointer',transition:'all 0.25s',
              textTransform:'uppercase',letterSpacing:'0.1em',
              border:`1px solid ${activeCategory===cat?'#00f5a0':dark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.1)'}`,
              background:activeCategory===cat?'rgba(0,245,160,0.08)':'transparent',
              color:activeCategory===cat?'#00f5a0':dark?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.5)',
              boxShadow:activeCategory===cat?'0 0 16px rgba(0,245,160,0.15)':'none',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Globe + liste */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2.5rem',flexWrap:'wrap'}}>

          {/* Canvas globe */}
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseDown={onDown}
            onMouseUp={onUp}
            onMouseLeave={()=>{onUp();hoverRef.current=-1;setTooltip(null);}}
            onTouchStart={onTouch}
            onTouchMove={onTMove}
            onTouchEnd={onUp}
            style={{display:'block',cursor:'grab',opacity:visible?1:0,transition:'opacity 0.8s ease 0.3s',maxWidth:'100%',userSelect:'none'}}
          />

          {/* Liste latérale */}
<div
  style={{
    position: 'relative',
    height: 260,
    maxWidth: 190,
    overflow: 'hidden',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.8s ease 0.5s'
  }}
>
  {/* Gradient fade TOP */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    background: dark
      ? 'linear-gradient(to bottom, rgba(10,5,25,1), transparent)'
      : 'linear-gradient(to bottom, rgba(255,255,255,1), transparent)',
    zIndex: 2,
    pointerEvents: 'none'
  }} />

  {/* Gradient fade BOTTOM */}
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    background: dark
      ? 'linear-gradient(to top, rgba(10,5,25,1), transparent)'
      : 'linear-gradient(to top, rgba(255,255,255,1), transparent)',
    zIndex: 2,
    pointerEvents: 'none'
  }} />

  {/* Scroll container */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      animation: 'scrollLoop 14s linear infinite'
    }}
    onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
    onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
  >
    {[...filteredSkills, ...filteredSkills].map((skill, i) => (
      <div
        key={`${skill.name}-${skill.category}-${i}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 4px',
          fontFamily: "'Space Mono',monospace",
          fontSize: 11,
          color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
          transition: 'all 0.25s ease',
          cursor: 'default'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#00f5a0';
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = dark
            ? 'rgba(255,255,255,0.55)'
            : 'rgba(0,0,0,0.55)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        {/* Dot animée */}
        <div style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#00f5a0',
          opacity: 0.6,
          boxShadow: '0 0 6px rgba(0,245,160,0.6)',
          flexShrink: 0
        }}/>

        {skill.name}
      </div>
    ))}
  </div>
</div>
        </div>

        {/* Stats */}
        <div style={{display:'flex',justifyContent:'center',gap:'3rem',marginTop:60,paddingTop:40,borderTop:`1px solid ${dark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'}`,flexWrap:'wrap',opacity:visible?1:0,transition:'opacity 0.8s ease 0.6s'}}>
          {[{value:'12+',label:'Projets Finis'},{value:'10+',label:'Langages maîtrisés'},{value:'4+',label:'Base de données'},{value:'∞',label:'Curiosité tech'}].map(s=>(
            <div key={s.label} style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:'#00f5a0'}}>{s.value}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,marginTop:4,color:dark?'rgba(255,255,255,0.35)':'rgba(0,0,0,0.35)'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip&&(
        <div style={{
          position:'fixed',top:tooltip.y-60,left:tooltip.x,transform:'translateX(-50%)',
          background:dark?'rgba(8,4,22,0.96)':'rgba(255,255,255,0.97)',
          border:'1px solid rgba(0,245,160,0.45)',borderRadius:10,padding:'8px 16px',
          fontFamily:"'Space Mono',monospace",pointerEvents:'none',zIndex:1000,
          boxShadow:'0 8px 30px rgba(0,245,160,0.2)',backdropFilter:'blur(12px)',
          animation:'tooltipIn 0.15s ease both',
        }}>
          <div style={{fontSize:13,fontWeight:700,color:'#00f5a0'}}>{tooltip.name}</div>
          <div style={{fontSize:10,color:dark?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)',marginTop:2,textTransform:'uppercase',letterSpacing:'0.1em'}}>{tooltip.category}</div>
        </div>
      )}

      <style>{`

      @keyframes scrollLoop {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
  
        @keyframes fadeSlide{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes tooltipIn{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `}</style>
    </section>
  );
}
