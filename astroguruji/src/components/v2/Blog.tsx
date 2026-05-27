import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blog({ data = [] }: { data: any[] }) {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!data.length) return null;

  // Touch-drag scroll helpers
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown = true;
    sliderRef.current.style.cursor = "grabbing";
    startX = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft = sliderRef.current.scrollLeft;
  };
  const onMouseLeave = () => {
    isDown = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };
  const onMouseUp = () => {
    isDown = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="w-full bg-white py-[24px] md:py-[40px]">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-poppins text-[22px] font-bold uppercase text-black md:text-[25px]">
              OUR <span className="italic text-[#FF6F00]">INFORMATIVE</span> BLOG
            </h2>
            <p className="mt-1 font-outfit text-[13px] text-[#575757]">
              Explore insights, astrology tips, and guidance to improve your life.
            </p>
          </div>
          <button
            onClick={() => navigate("/our-blog")}
            className="hidden shrink-0 rounded-full border border-[#FF6F00] px-4 py-1.5 font-poppins text-[12px] font-semibold text-[#FF6F00] transition hover:bg-[#FF6F00] hover:text-white sm:block"
          >
            View All →
          </button>
        </div>

        {/* ── Mobile: horizontal swipe slider ── */}
        <div className="block md:hidden">
          <div
            ref={sliderRef}
            className="flex gap-3 overflow-x-auto pb-3 scroll-smooth"
            style={{
              scrollbarWidth: "none",          /* Firefox */
              msOverflowStyle: "none",         /* IE/Edge */
              cursor: "grab",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {/* Hide scrollbar in webkit */}
            <style>{`.blog-slider::-webkit-scrollbar { display: none; }`}</style>

            {data.slice(0, 10).map((post: any) => (
              <div
                key={post._id}
                className="shrink-0 w-[220px]"
              >
                <BlogCard
                  image={post.img}
                  title={post.title}
                  category="Astrology"
                  id={post._id}
                  date={formatDate(post.Created_date)}
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="mt-3 flex justify-center gap-1.5">
            {data.slice(0, 10).map((_: any, i: number) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#FF6F00] opacity-30"
                style={{ opacity: i === 0 ? 1 : 0.25 }}
              />
            ))}
          </div>

          {/* View All — mobile */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => navigate("/our-blog")}
              className="rounded-full border border-[#FF6F00] px-6 py-2 font-poppins text-[12px] font-semibold text-[#FF6F00] transition hover:bg-[#FF6F00] hover:text-white"
            >
              View All Blogs →
            </button>
          </div>
        </div>

        {/* ── Desktop: grid ── */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.slice(0, 10).map((post: any) => (
            <BlogCard
              key={post._id}
              image={post.img}
              title={post.title}
              category="Astrology"
              id={post._id}
              date={formatDate(post.Created_date)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}