import { useEffect, useState } from "react";

export const useActiveSection = (sections) => {
  const [active, setActive] = useState(sections[0]);

  useEffect(() => {
    const handleScroll = () => {
      let current = sections[0];

      for (let id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 150) {
          current = id;
        }
      }

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return [active, setActive];
};