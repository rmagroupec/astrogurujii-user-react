import { useState, useEffect, useCallback } from "react";
import { SERVICE_CARDS } from "@/data/home";
import ServiceCard from "./ServiceCard";

function useVisibleCount() {
  const getCount = () => {
    if (globalThis.window === undefined) return 4;
    if (globalThis.window.innerWidth < 640) return 1;
    if (globalThis.window.innerWidth < 1024) return 2;
    return 4;
  };
  const [count, setCount] = useState(getCount);

  useEffect(() => {
    const onResize = () => setCount(getCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return count;
}

const ServicesSection = () => {
  const visibleCount = useVisibleCount();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, SERVICE_CARDS.length - visibleCount);

  // Clamp index when visibleCount changes (e.g. on resize)
  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(maxIndex, i + 1)),
    [maxIndex],
  );

  const cardWidthPercent = 100 / visibleCount;

  return (
    <section className="bg-gradient-to-b from-[#fefbec] to-white py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[107px]">
        {/* Section title */}
        <div className="text-center mb-3">
          <h2 className="font-poppins font-bold text-[25px] text-black uppercase">
            Our <span className="text-primary">astrology</span> services
          </h2>
        </div>
        <p className="text-center font-euclid font-light text-[14px] text-neutral-600 mb-8">
          Our astrology services offer valuable insights and guidance key
          aspects of life.
        </p>

        {/* Carousel */}
        <div className="relative flex items-center">
          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={index === 0}
            className="hidden sm:flex bg-primary rounded-[5px] w-[29px] h-[30px] flex-shrink-0 items-center justify-center text-white mr-4 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M9 2L4 7l5 5" />
            </svg>
          </button>

          {/* Cards track — mobile: horizontal scroll, desktop: grid carousel */}
          <div className="flex-1 overflow-hidden sm:overflow-hidden">
            {/* Mobile: horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:hidden">
              {SERVICE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="w-full flex-shrink-0 snap-center"
                >
                  <ServiceCard
                    title={card.title}
                    description={card.description}
                  />
                </div>
              ))}
            </div>

            {/* Desktop: grid carousel */}
            <div
              className="hidden sm:grid transition-transform duration-300 ease-in-out"
              style={{
                gridTemplateColumns: `repeat(${SERVICE_CARDS.length}, ${cardWidthPercent}%)`,
                gridTemplateRows: "auto 1fr",
                transform: `translateX(-${index * cardWidthPercent}%)`,
              }}
            >
              {SERVICE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="grid grid-rows-subgrid px-3"
                  style={{ gridRow: "1 / -1" }}
                >
                  <ServiceCard
                    title={card.title}
                    description={card.description}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            disabled={index >= maxIndex}
            className="hidden sm:flex bg-primary rounded-[5px] w-[29px] h-[30px] flex-shrink-0 items-center justify-center text-white ml-4 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Next"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M5 2l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
