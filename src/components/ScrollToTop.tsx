"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group animate-bounce-slow focus:ring-4 focus:ring-green-300 focus:outline-none"
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
    </button>
  );
}
