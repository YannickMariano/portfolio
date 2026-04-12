import { useState, useEffect, useRef } from "react";

export function useIntersect(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { 
        setVisible(true); 
        obs.disconnect(); 
      }
    }, { threshold: 0.15, ...options });
    
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  
  return [ref, visible];
}