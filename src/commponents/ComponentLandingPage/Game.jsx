import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import slides from "../DataCobaan/bannergame";

function Game() {
 

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, slides.length]);

  // Navigation functions
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
    );
    setAutoplay(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setAutoplay(false);
  };

  return (
    <section id="game" className="bg-blue-50 py-20">
      <div className="container mx-auto px-6">
        <div className="relative">
          {/* Slides */}
          <div className="overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 absolute top-0 left-0 right-0"
                }`}
                style={{
                  position: index === currentIndex ? "relative" : "absolute",
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/2 mb-10 md:mb-0 aspect-[19.5/9]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 md:pl-12 ">
                    <h2 className="text-3xl font-bold mb-6">{slide.game}</h2>
                    <div className="text-gray-600 text-lg text-justify mb-6 space-y-4">
                      {slide.description.split(". ").map((sentence, index) => (
                        <p key={index}>{sentence}.</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Slide indicators */}
        <div className="mt-8 flex justify-center bottom-0 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-blue-600 w-6" : "bg-blue-200"
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setAutoplay(false);
              }}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Game;
