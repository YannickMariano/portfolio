import { useState, useEffect, useRef } from "react";
import { useIntersect } from "../hooks/useIntersect";
import { PROJECTS, REPOSITORIES } from "../data/portfolioData";

export default function Projects({ dark }) {
  const [ref, visible] = useIntersect();
  const [hoveredRepo, setHoveredRepo] = useState(null);
  const [hoveredPinned, setHoveredPinned] = useState(null);
  const [animatedItems, setAnimatedItems] = useState({});

  // Refs pour les animations individuelles
  const repoRefs = useRef([]);
  const pinnedCol1Refs = useRef([]);
  const pinnedCol2Refs = useRef([]);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const cardHeightsRef = useRef({ col2: [], col3: [] });

  // Séparer les pinned projects
  const pinnedColumn1 = PROJECTS.slice(0, 2);
  const pinnedColumn2 = PROJECTS.slice(2, 4);

  // Animation au scroll avec Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.dataset.index;
          const type = entry.target.dataset.type;
          setAnimatedItems(prev => ({ ...prev, [`${type}-${index}`]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer les repositories
    repoRefs.current.forEach((ref, idx) => {
      if (ref) {
        ref.dataset.type = 'repo';
        ref.dataset.index = idx;
        observer.observe(ref);
      }
    });

    // Observer les pinned projects colonne 1
    pinnedCol1Refs.current.forEach((ref, idx) => {
      if (ref) {
        ref.dataset.type = 'pinned1';
        ref.dataset.index = idx;
        observer.observe(ref);
      }
    });

    // Observer les pinned projects colonne 2
    pinnedCol2Refs.current.forEach((ref, idx) => {
      if (ref) {
        ref.dataset.type = 'pinned2';
        ref.dataset.index = idx;
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Synchroniser les hauteurs
  useEffect(() => {
    const syncHeights = () => {
      if (col1Ref.current && col2Ref.current) {
        const col2Height = col2Ref.current.offsetHeight;
        col1Ref.current.style.minHeight = `${col2Height}px`;
      }

      for (let i = 0; i < 2; i++) {
        const cardCol2 = cardHeightsRef.current.col2[i];
        const cardCol3 = cardHeightsRef.current.col3[i];
        if (cardCol2 && cardCol3) {
          const maxHeight = Math.max(cardCol2.offsetHeight, cardCol3.offsetHeight);
          cardCol2.style.height = `${maxHeight}px`;
          cardCol3.style.height = `${maxHeight}px`;
        }
      }
    };

    syncHeights();
    window.addEventListener('resize', syncHeights);
    setTimeout(syncHeights, 100);

    return () => window.removeEventListener('resize', syncHeights);
  }, [PROJECTS]);

  return (
    <section id="projets" ref={ref} style={{ padding: "120px 2rem", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg,transparent,rgba(0,168,255,0.4),transparent)",
        }}
      />
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            className={dark ? "logo-shine-dark" : "logo-shine-light"}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              filter: visible ? "blur(0px)" : "blur(8px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            // Mes réalisations
          </div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(36px,5vw,56px)",
              fontWeight: 800,
              color: dark ? "#fff" : "#0a0a0f",
              marginBottom: 16,
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(40px) scale(0.9) skewY(2deg)",
              filter: visible ? "blur(0px)" : "blur(12px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Projets <span style={{ color: "#00a8ff" }}>Récents</span>
          </h2>
          <p
            color="#fff"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease 0.2s",
            }}
          >
            Découvrez mes repositories GitHub et projets phares
          </p>
        </div>

        {/* Structure à 3 colonnes */}
        <div className="projects-grid"
          style={{
            display: "flex",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {/* COLONNE 1 - REPOSITORIES */}
          <div
            ref={col1Ref}
            style={{
              flex: 1,
              background: dark
                ? "linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.06))"
                : "linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 16,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              transition: "min-height 0.3s ease",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: "#00a8ff",
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>📁</span> Repositories
              <span
                style={{
                  fontSize: 11,
                  background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                  padding: "2px 8px",
                  borderRadius: 20,
                  marginLeft: "auto",
                }}
              >
                {REPOSITORIES.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {REPOSITORIES.map((repo, index) => (
                <a
                  key={repo.name}
                  ref={(el) => repoRefs.current[index] = el}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredRepo(index)}
                  onMouseLeave={() => setHoveredRepo(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 12,
                    textDecoration: "none",
                    background: hoveredRepo === index
                      ? `${repo.color}15`
                      : "transparent",
                    border: `1px solid ${hoveredRepo === index
                      ? repo.color
                      : "transparent"
                      }`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: hoveredRepo === index ? "translateX(4px)" : "translateX(0)",
                    cursor: "pointer",
                    opacity: animatedItems[`repo-${index}`] ? 1 : 0,
                    animation: animatedItems[`repo-${index}`] ? "slideInLeft 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards" : "none",
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: repo.color,
                        boxShadow: hoveredRepo === index ? `0 0 8px ${repo.color}` : "none",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: hoveredRepo === index
                          ? repo.color
                          : dark
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)",
                        transition: "color 0.2s",
                      }}
                    >
                      {repo.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                      }}
                    >
                      {repo.language}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                      }}
                    >
                      📅 {repo.updated}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* COLONNE 2 - PINNED PROJECTS */}
          <div
            ref={col2Ref}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {pinnedColumn1.map((project, index) => (
              <div
                key={project.title}
                ref={(el) => {
                  pinnedCol1Refs.current[index] = el;
                  if (el) cardHeightsRef.current.col2[index] = el;
                }}
                onMouseEnter={() => setHoveredPinned(`${project.title}-col1`)}
                onMouseLeave={() => setHoveredPinned(null)}
                style={{
                  background: dark
                    ? "linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.06))"
                    : "linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))",
                  border: `1px solid ${hoveredPinned === `${project.title}-col1`
                    ? project.color
                    : dark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)"
                    }`,
                  borderRadius: 16,
                  padding: 20,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: hoveredPinned === `${project.title}-col1`
                    ? "translateY(-8px) scale(1.02)"
                    : "translateY(0) scale(1)",
                  boxShadow:
                    hoveredPinned === `${project.title}-col1`
                      ? `0 20px 40px ${project.color}30, 0 0 0 1px ${project.color}`
                      : "none",
                  display: "flex",
                  flexDirection: "column",
                  opacity: animatedItems[`pinned1-${index}`] ? 1 : 0,
                  animation: animatedItems[`pinned1-${index}`]
                    ? "cardFloatIn 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) forwards"
                    : "none",
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: project.color,
                    background: `${project.color}15`,
                    padding: "4px 10px",
                    borderRadius: 20,
                    marginBottom: 12,
                    border: `1px solid ${project.color}25`,
                    alignSelf: "flex-start",
                    transition: "all 0.3s ease",
                    transform: hoveredPinned === `${project.title}-col1` ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  📌 PINNED
                </div>

                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: hoveredPinned === `${project.title}-col1` ? project.color : (dark ? "#fff" : "#0a0a0f"),
                    marginBottom: 10,
                    transition: "color 0.2s",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                    flex: 1,
                  }}
                >
                  {project.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {project.tech.slice(0, 6).map((t, techIndex) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        fontWeight: 500,
                        color: project.color,
                        background: `${project.color}10`,
                        border: `1px solid ${project.color}20`,
                        borderRadius: 20,
                        padding: "4px 10px",
                        transition: "all 0.2s ease",
                        animation: animatedItems[`pinned1-${index}`]
                          ? "techPopIn 0.3s ease both"
                          : "none",
                        animationDelay: `${techIndex * 0.03 + 0.3}s`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 6 && (
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        fontWeight: 500,
                        color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                        background: "transparent",
                        padding: "4px 10px",
                      }}
                    >
                      +{project.tech.length - 6}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    marginTop: "auto",
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12, transition: "transform 0.2s" }}>⭐</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                        {project.stars || 0}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12 }}>🍴</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                        {project.forks || 0}
                      </span>
                    </div>
                  </div>
                  <a
                    href={project.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: project.color,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
                  >
                    GitHub <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* COLONNE 3 - PINNED PROJECTS */}
          <div
            ref={col3Ref}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {pinnedColumn2.map((project, index) => (
              <div
                key={project.title}
                ref={(el) => {
                  pinnedCol2Refs.current[index] = el;
                  if (el) cardHeightsRef.current.col3[index] = el;
                }}
                onMouseEnter={() => setHoveredPinned(`${project.title}-col2`)}
                onMouseLeave={() => setHoveredPinned(null)}
                style={{
                  background: dark
                    ? "linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.06))"
                    : "linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))",
                  border: `1px solid ${hoveredPinned === `${project.title}-col2`
                    ? project.color
                    : dark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)"
                    }`,
                  borderRadius: 16,
                  padding: 20,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: hoveredPinned === `${project.title}-col2`
                    ? "translateY(-8px) scale(1.02)"
                    : "translateY(0) scale(1)",
                  boxShadow:
                    hoveredPinned === `${project.title}-col2`
                      ? `0 20px 40px ${project.color}30, 0 0 0 1px ${project.color}`
                      : "none",
                  display: "flex",
                  flexDirection: "column",
                  opacity: animatedItems[`pinned2-${index}`] ? 1 : 0,
                  animation: animatedItems[`pinned2-${index}`]
                    ? "cardFloatIn 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) forwards"
                    : "none",
                  animationDelay: `${(index + 2) * 0.15}s`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: project.color,
                    background: `${project.color}15`,
                    padding: "4px 10px",
                    borderRadius: 20,
                    marginBottom: 12,
                    border: `1px solid ${project.color}25`,
                    alignSelf: "flex-start",
                    transition: "all 0.3s ease",
                    transform: hoveredPinned === `${project.title}-col2` ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  📌 PINNED
                </div>

                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: hoveredPinned === `${project.title}-col2` ? project.color : (dark ? "#fff" : "#0a0a0f"),
                    marginBottom: 10,
                    transition: "color 0.2s",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                    flex: 1,
                  }}
                >
                  {project.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {project.tech.slice(0, 6).map((t, techIndex) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        fontWeight: 500,
                        color: project.color,
                        background: `${project.color}10`,
                        border: `1px solid ${project.color}20`,
                        borderRadius: 20,
                        padding: "4px 10px",
                        transition: "all 0.2s ease",
                        animation: animatedItems[`pinned2-${index}`]
                          ? "techPopIn 0.3s ease both"
                          : "none",
                        animationDelay: `${techIndex * 0.03 + 0.3}s`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 6 && (
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        fontWeight: 500,
                        color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                        background: "transparent",
                        padding: "4px 10px",
                      }}
                    >
                      +{project.tech.length - 6}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    marginTop: "auto",
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12 }}>⭐</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                        {project.stars || 0}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12 }}>🍴</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                        {project.forks || 0}
                      </span>
                    </div>
                  </div>
                  <a
                    href={project.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: project.color,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
                  >
                    GitHub <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes cardFloatIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
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
        
        @keyframes techPopIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}