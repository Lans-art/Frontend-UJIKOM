import React, { useState, useEffect } from "react";
import Header from "./ComponentLandingPage/Header";
import Hero from "./ComponentLandingPage/Hero";
import Features from "./ComponentLandingPage/Features";
import About from "./ComponentLandingPage/About";
import Testimonials from "./ComponentLandingPage/Testimonials";
import Game from "./ComponentLandingPage/Game";
import Faq from "./ComponentLandingPage/Faq";

function LandingPage() {
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["beranda", "fitur", "tentang", "ulasan", "game", "faq"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      <Hero />
      <Features />
      <About />
      <Testimonials />
      <Game/>
      <Faq />
    </div>
  );
}

export default LandingPage;
