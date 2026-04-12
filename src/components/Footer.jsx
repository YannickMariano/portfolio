export default function Footer({ dark }) {
  return (
    <footer style={{
      textAlign: "center", padding: "32px 2rem",
      borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      fontFamily: "'Space Mono', monospace", fontSize: 11,
      color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)",
      letterSpacing: "0.08em",
    }}>
      RAKOTONIHARANTSOA Yannick Mariano — FULLSTACK DEVELOPER — ANTANANARIVO
    </footer>
  );
}