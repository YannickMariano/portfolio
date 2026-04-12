import { useState, useEffect } from "react";

export default function Carousel({ items, dark, renderItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Slides container */}
      <div style={{ overflow: "hidden", borderRadius: 24 }}>
        <div
          style={{
            display: "flex",
            transition: `transform 0.5s ease-in-out`,
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div key={index} style={{ width: "100%", flexShrink: 0 }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: -60,
          top: "50%",
          transform: "translateY(-50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: dark ? "#fff" : "#000",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#00f5a0";
          e.currentTarget.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
          e.currentTarget.style.color = dark ? "#fff" : "#000";
        }}
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: -60,
          top: "50%",
          transform: "translateY(-50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: dark ? "#fff" : "#000",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#00f5a0";
          e.currentTarget.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
          e.currentTarget.style.color = dark ? "#fff" : "#000";
        }}
      >
        →
      </button>

      {/* Dots indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            style={{
              width: currentIndex === index ? 40 : 10,
              height: 10,
              borderRadius: 10,
              background: currentIndex === index ? "#00f5a0" : dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}