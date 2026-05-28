import { useState, useEffect, useCallback, useRef } from "react";
import { SERVICE_CARDS } from "@/data/home";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  // Prevent onScroll from fighting arrow clicks
  const isArrowScrolling = useRef(false);

  // Clamp index when visibleCount changes (e.g. on resize)
  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(maxIndex, i + 1)),
    [maxIndex],
  );

  // Sync mobile scroll position whenever index changes (arrow click)
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    // clientWidth = exact width of one visible card (since visibleCount=1 on mobile)
    const cardW = el.clientWidth;
    isArrowScrolling.current = true;
    el.scrollTo({ left: cardW * index, behavior: "smooth" });
    // Release the lock after animation completes
    const t = setTimeout(() => { isArrowScrolling.current = false; }, 450);
    return () => clearTimeout(t);
  }, [index]);

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

          {/* Left arrow — visible on all sizes */}
          <button
            onClick={prev}
            disabled={index === 0}
            className="flex bg-primary rounded-[5px] w-[29px] h-[30px] flex-shrink-0 items-center justify-center text-white mr-4 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M9 2L4 7l5 5" />
            </svg>
          </button>

          {/* Cards track */}
          <div className="flex-1 overflow-hidden">

            {/* Mobile: horizontal scroll */}
            <div
              ref={mobileScrollRef}
              onScroll={() => {
                if (isArrowScrolling.current) return;
                const el = mobileScrollRef.current;
                if (!el) return;
                const cardW = el.clientWidth;
                const i = Math.round(el.scrollLeft / cardW);
                setIndex(Math.min(Math.max(i, 0), SERVICE_CARDS.length - 1));
              }}
              className="flex overflow-x-auto snap-x snap-mandatory pb-4 sm:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.mobile-service-scroll::-webkit-scrollbar{display:none}`}</style>
              {SERVICE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="mobile-service-scroll snap-start flex-shrink-0"
                  style={{ width: "100%" }}
                >
                  <ServiceCard
                    title={card.title}
                    description={card.description}
                    link={card.link}
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
                    link={card.link}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow — visible on all sizes */}
          <button
            onClick={next}
            disabled={index >= maxIndex}
            className="flex bg-primary rounded-[5px] w-[29px] h-[30px] flex-shrink-0 items-center justify-center text-white ml-4 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
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