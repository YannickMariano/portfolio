import { useState, useEffect } from "react";

export default function NameLoader({ onDone }) {
  const [step, setStep] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Animation de rotation du logo
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 20);

    // Étape 1: Redémarrage (3 secondes)
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 3000);

    // Étape 2: Redirection (2.5 secondes)
    const timer2 = setTimeout(() => {
      setStep(2);
    }, 5800);

    // Étape 3: Fin et transition (1.5 secondes)
    const timer3 = setTimeout(() => {
      setExit(true);
      setTimeout(onDone, 800);
    }, 7500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif",
        opacity: exit ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo Windows 11 en 3D avec perspective */}
      <div
        style={{
          marginBottom: 48,
          perspective: "800px",
          perspectiveOrigin: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 100,
            height: 100,
            transform: `rotate(${rotation}deg) scale(1)`,
            transition: "transform 0.02s linear",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Logo Windows 11 - 4 carrés avec perspective */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 46,
              height: 46,
              background: "linear-gradient(135deg, #00A4EF, #0078D7)",
              borderRadius: 8,
              transform: "translateZ(10px) rotateX(0deg)",
              boxShadow: "0 4px 15px rgba(0,164,239,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 46,
              height: 46,
              background: "linear-gradient(135deg, #7FBA00, #6A9E00)",
              borderRadius: 8,
              transform: "translateZ(15px) rotateY(5deg)",
              boxShadow: "0 4px 15px rgba(127,186,0,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 46,
              height: 46,
              background: "linear-gradient(135deg, #FFB900, #E5A700)",
              borderRadius: 8,
              transform: "translateZ(5px) rotateX(5deg)",
              boxShadow: "0 4px 15px rgba(255,185,0,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 46,
              height: 46,
              background: "linear-gradient(135deg, #F25022, #D9400E)",
              borderRadius: 8,
              transform: "translateZ(20px) rotateY(-5deg)",
              boxShadow: "0 4px 15px rgba(242,80,34,0.3)",
            }}
          />
        </div>
      </div>

      {/* Texte principal */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: "#FFFFFF",
          marginBottom: 24,
          fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
          letterSpacing: "0.2px",
        }}
      >
        {step === 0 && "Redémarrage"}
        {step === 1 && "Redirection vers Yannick's portfolio"}
        {step === 2 && "Bienvenue"}
      </h1>

      {/* Animation de chargement style Windows 11 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            border: "2px solid rgba(255,255,255,0.2)",
            borderTop: "2px solid #00A4EF",
            borderRadius: "50%",
            animation: "windowsSpinner 0.8s linear infinite",
          }}
        />
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Segoe UI Variable', system-ui, sans-serif",
          }}
        >
          {step === 0 && "Veuillez patienter..."}
          {step === 1 && "Préparation de l'environnement..."}
          {step === 2 && "Chargement..."}
        </span>
      </div>

      {/* Barre de progression style Windows 11 */}
      {step < 2 && (
        <div
          style={{
            marginTop: 40,
            width: 300,
            height: 4,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: step === 0 ? "30%" : "75%",
              height: "100%",
              background: "linear-gradient(90deg, #00A4EF, #0078D7)",
              borderRadius: 4,
              animation: "windowsProgress 1.5s ease-in-out infinite",
              transformOrigin: "left",
            }}
          />
        </div>
      )}

      {/* Message final */}
      {step === 2 && (
        <div
          style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "fadeInUp 0.4s ease-out",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#00A4EF",
              borderRadius: "50%",
              animation: "pulseDot 1s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#00A4EF",
              letterSpacing: "1px",
              fontFamily: "'Segoe UI Variable', monospace",
            }}
          >
            PRÊT À CONTINUER
          </span>
        </div>
      )}

      {/* Effet de grain subtil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <style>{`
        @keyframes windowsSpinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes windowsProgress {
          0% {
            transform: scaleX(0.7);
            opacity: 0.8;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(0.7);
            opacity: 0.8;
          }
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}