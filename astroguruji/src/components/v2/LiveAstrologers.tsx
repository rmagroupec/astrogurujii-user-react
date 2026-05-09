import { CircleChevronLeftIcon, CircleChevronRightIcon } from "@/assets/icons";
import { useRef, useState, useEffect } from "react";
import LiveAstrologerCard from "./LiveAstrologerCard";

export default function LiveAstrologers({ data = [] }: { data: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth =
      el.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? 260;

    const scrollAmount = cardWidth + 16;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollState();
  }, [data]);

  // ❌ Hide section if no data
  if (!data.length) return null;
  const mapLiveAstro = (item: any) => item;
  return (
    <section className="w-full py-[24px] md:py-[40px] bg-[linear-gradient(180deg,_#FEFBEC_0%,_#FFF_100%)]">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

        {/* Header */}
        <div className="mb-2 flex flex-col items-center text-center">
          <h2 className="font-poppins text-h4 font-bold uppercase leading-tight md:leading-[16px]">
            <span className="text-brand-orange">Live </span>
            <span className="text-text-primary">Astrologer</span>
          </h2>
          <p className="mt-3 font-euclid text-sm font-light text-text-muted">
            Join live sessions and interact with astrologers in real time.
          </p>
        </div>

        {/* Arrows */}
        <div className="hidden sm:flex justify-end gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <CircleChevronLeftIcon
              color={canScrollLeft ? "#FF6F00" : "#E0E0E0"}
            />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <CircleChevronRightIcon
              color={canScrollRight ? "#FF6F00" : "#E0E0E0"}
            />
          </button>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="mt-6 flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {data.map((item: any) => (
            <div
              key={item._id}
              className="w-full flex-shrink-0 sm:w-[calc((100%-64px)/5)]"
            >
              <LiveAstrologerCard astrologer={mapLiveAstro(item)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}