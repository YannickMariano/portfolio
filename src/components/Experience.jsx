import { useState, useEffect, useRef } from "react";
import { useIntersect } from "../hooks/useIntersect";
import { EXPERIENCES } from "../data/portfolioData";

export default function Experience({ dark }) {
  const [ref, visible] = useIntersect();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animatedItems, setAnimatedItems] = useState({});
  const [progressHeight, setProgressHeight] = useState(0);
  
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);

  // Animation au scroll avec Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.dataset.index;
          setAnimatedItems(prev => ({ ...prev, [index]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    cardsRef.current.forEach((ref, idx) => {
      if (ref) {
        ref.dataset.index = idx;
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Animation de la barre de progression sur la timeline
  useEffect(() => {
    if (!visible) return;

    const updateProgress = () => {
      if (timelineRef.current) {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const elementTop = timelineRect.top + scrollTop;
        const elementBottom = elementTop + timelineRect.height;
        const currentScroll = window.scrollY + windowHeight * 0.6;
        
        let progress = 0;
        if (currentScroll > elementTop) {
          progress = Math.min(100, ((currentScroll - elementTop) / (elementBottom - elementTop)) * 100);
        }
        setProgressHeight(Math.max(0, Math.min(100, progress)));
      }
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [visible]);

  return (
    <section id="experience" ref={ref} style={{ padding: "120px 2rem", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: dark ? "rgba(0,245,160,0.02)" : "rgba(0,0,0,0.015)",
          zIndex: -1,
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: "#00f5a0",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease",
            }}
          >
            // Mon parcours
          </div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(36px,5vw,56px)",
              fontWeight: 800,
              color: dark ? "#fff" : "#0a0a0f",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transition: "all 0.8s ease",
            }}
          >
            Expérience <span style={{ color: "#00f5a0" }}>Professionnelle</span>
          </h2>
        </div>

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          {/* Timeline centrale avec barre de progression */}
          <div
            ref={timelineRef}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 40,
              bottom: 40,
              width: 3,
              background: dark ? "rgba(0,245,160,0.15)" : "rgba(0,0,0,0.08)",
              borderRadius: 3,
              zIndex: 1,
            }}
          >
            {/* Barre de progression animée */}
            <div
              ref={progressRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: `${progressHeight}%`,
                background: `linear-gradient(180deg, #00f5a0, #00d4ff)`,
                borderRadius: 3,
                transition: "height 0.3s ease-out",
                boxShadow: "0 0 10px rgba(0,245,160,0.5)",
              }}
            />
          </div>

          {EXPERIENCES.map((exp, index) => {
            // Alternance zig-zag : pair à gauche, impair à droite
            const isEven = index % 2 === 0;
            const cardPosition = isEven ? "left" : "right";
            const animationDelay = index * 0.2;
            const isAnimated = animatedItems[index];

            return (
              <div
                key={index}
                ref={(el) => cardsRef.current[index] = el}
                style={{
                  position: "relative",
                  marginBottom: 60,
                  opacity: isAnimated ? 1 : 0,
                  animation: isAnimated ? "cardGlideIn 0.7s cubic-bezier(0.34, 1.2, 0.64, 1) forwards" : "none",
                  animationDelay: `${animationDelay}s`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Timeline dot central */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: 8,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: exp.color,
                    border: `3px solid ${dark ? "#08080f" : "#fff"}`,
                    boxShadow: hoveredIndex === index 
                      ? `0 0 0 8px ${exp.color}40, 0 0 30px ${exp.color}` 
                      : `0 0 0 4px ${exp.color}30`,
                    zIndex: 3,
                    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                    transform: hoveredIndex === index ? "translateX(-50%) scale(1.3)" : "translateX(-50%) scale(1)",
                  }}
                />

                {/* Pulsating ring sur le dot */}
                {hoveredIndex === index && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      top: 8,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "transparent",
                      border: `2px solid ${exp.color}`,
                      animation: "pulseRing 1.5s ease-out infinite",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                )}

                {/* Carte en zig-zag */}
                <div
                  style={{
                    width: "calc(50% - 60px)",
                    marginLeft: cardPosition === "left" ? 0 : "auto",
                    marginRight: cardPosition === "right" ? 0 : "auto",
                    background: dark
                      ? "linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.06))"
                      : "linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))",
                    border: `1px solid ${
                      hoveredIndex === index
                        ? exp.color
                        : dark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)"
                    }`,
                    borderRadius: 20,
                    padding: "24px 28px",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: hoveredIndex === index 
                      ? `translateY(-6px) ${cardPosition === "left" ? "translateX(8px)" : "translateX(-8px)"}` 
                      : "translateY(0) translateX(0)",
                    boxShadow: hoveredIndex === index
                      ? `0 20px 40px ${exp.color}30, 0 0 0 1px ${exp.color}`
                      : "none",
                    cursor: "pointer",
                    position: "relative",
                    animation: isAnimated ? (cardPosition === "left" ? "slideFromLeft 0.6s ease both" : "slideFromRight 0.6s ease both") : "none",
                    animationDelay: `${animationDelay + 0.1}s`,
                  }}
                >
                  {/* Flèche de connexion vers la timeline */}
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      [cardPosition === "left" ? "right" : "left"]: -30,
                      width: 30,
                      height: 2,
                      background: `linear-gradient(90deg, ${exp.color}60, ${exp.color}10)`,
                      transform: cardPosition === "right" ? "rotate(180deg)" : "none",
                    }}
                  />

                  {/* Gradient overlay au survol */}
                  {hoveredIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 20,
                        background: `radial-gradient(circle at top ${cardPosition === "left" ? "left" : "right"}, ${exp.color}15, transparent)`,
                        pointerEvents: "none",
                        animation: "fadeIn 0.3s ease",
                      }}
                    />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, position: "relative", zIndex: 1 }}>
                    <span
                      style={{
                        fontSize: 36,
                        transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        transform: hoveredIndex === index ? "scale(1.2) rotate(8deg)" : "scale(1) rotate(0deg)",
                        display: "inline-block",
                      }}
                    >
                      {typeof exp.icon === 'string' && (exp.icon.startsWith('/') || exp.icon.startsWith('http')) ? (
                        <img 
                          src={exp.icon} 
                          alt={exp.title}
                          style={{ width: 36, height: 36, objectFit: "contain" }}
                        />
                      ) : (
                        <span>{exp.icon}</span>
                      )}
                    </span>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 20,
                          fontWeight: 700,
                          marginBottom: 4,
                          transition: "all 0.3s ease",
                          color: hoveredIndex === index ? exp.color : (dark ? "#fff" : "#0a0a0f"),
                        }}
                      >
                        {exp.title}
                      </h3>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 12,
                            color: exp.color,
                            transition: "all 0.3s ease",
                            letterSpacing: hoveredIndex === index ? "0.05em" : "0",
                          }}
                        >
                          {exp.company}
                        </span>
                        <span style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>•</span>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 12,
                            color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      transition: "all 3s ease",
                    }}
                  >
                    {hoveredIndex === index ? (
                      <div style={{ animation: "slideInUp 4s cubic-bezier(4, 0, 2, 1)" }}>
                        <div
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 11,
                            color: exp.color,
                            marginBottom: 12,
                            letterSpacing: "0.1em",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 14 }}>✦</span>
                          PRINCIPALES RÉALISATIONS
                          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${exp.color}40, transparent)` }} />
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {exp.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 13.5,
                                color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                                marginBottom: 10,
                                lineHeight: 1.5,
                                animation: `fadeInItem 0.3s ease both ${i * 0.1}s`,
                              }}
                            >
                              <span style={{ color: exp.color, marginRight: 8 }}>→</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                          lineHeight: 1.6,
                          marginBottom: 0,
                        }}
                      >
                        {exp.description}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      textAlign: cardPosition === "left" ? "left" : "right",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      color: exp.color,
                      opacity: 0.5,
                      transition: "all 0.3s ease",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                   
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInItem {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes cardGlideIn {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-10px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulseRing {
          0% {
            transform: translateX(-50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateX(-50%) scale(2.5);
            opacity: 0;
          }
        }
        
        @keyframes bounceX {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </section>
  );
}