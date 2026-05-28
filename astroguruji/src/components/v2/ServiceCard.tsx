import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  link: string;
}

function LotusIcon() {
  return (
    <img
      src="/images/logo-small-non-color.png"
      alt="Lotus"
      className="w-7 h-5 object-contain"
    />
  );
}

export default function ServiceCard({
  title,
  description,
  link,
}: Readonly<ServiceCardProps>) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer
                 border border-[#FFE0C8]
                 shadow-[0_2px_16px_rgba(255,111,0,0.08)]
                 hover:shadow-[0_8px_36px_rgba(255,111,0,0.22)]
                 hover:-translate-y-[6px]
                 transition-all duration-300 ease-out
                 flex flex-col select-none"
      style={{ gridRow: "1 / -1" }}
    >
      {/* ── Warm gradient header band ── */}
      <div className="relative flex items-center gap-3 px-5 pt-5 pb-4">
        {/* Glow blob behind icon */}
        <div
          className="absolute top-0 left-0 w-24 h-24 rounded-full
                     bg-[#FF6F00] opacity-[0.07] blur-2xl
                     group-hover:opacity-[0.14] transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Icon circle */}
        <div
          className="relative z-10 flex items-center justify-center
                     w-12 h-12 rounded-xl flex-shrink-0
                     bg-gradient-to-br from-[#FF6F00] to-[#FFCC33]
                     shadow-[0_4px_12px_rgba(255,111,0,0.35)]
                     group-hover:scale-110 group-hover:shadow-[0_6px_18px_rgba(255,111,0,0.45)]
                     transition-all duration-300"
        >
          <span className="[filter:brightness(0)_invert(1)] opacity-90">
            <LotusIcon />
          </span>
        </div>

        {/* Title */}
        <h3
          className="relative z-10 font-poppins font-semibold text-[15px] leading-tight capitalize
                     text-[#1C1C1C] group-hover:text-primary transition-colors duration-200"
        >
          {title}
        </h3>
      </div>

      {/* ── Decorative zigzag divider ── */}
      <div className="w-full overflow-hidden leading-[0] -mt-1">
        <svg
          viewBox="0 0 300 10"
          preserveAspectRatio="none"
          className="w-full h-[10px]"
          aria-hidden="true"
        >
          <polyline
            points="0,0 15,10 30,0 45,10 60,0 75,10 90,0 105,10 120,0 135,10 150,0 165,10 180,0 195,10 210,0 225,10 240,0 255,10 270,0 285,10 300,0"
            fill="none"
            stroke="#FFE0C8"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-4 px-5 pt-3 pb-5 flex-1">
        {/* Description */}
        <p className="font-poppins text-[11.5px] leading-[1.75] text-neutral-500 flex-1">
          {description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 mt-auto">
          <span
            className="inline-flex items-center gap-1.5
                       font-poppins text-[11px] font-semibold text-white
                       bg-gradient-to-r from-[#FF6F00] to-[#FFAA33]
                       px-3 py-1.5 rounded-full
                       shadow-[0_2px_8px_rgba(255,111,0,0.3)]
                       group-hover:shadow-[0_4px_14px_rgba(255,111,0,0.45)]
                       group-hover:scale-[1.04]
                       transition-all duration-300"
          >
            Explore
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Bottom sweep accent bar ── */}
      <div
        className="h-[3px] w-full bg-gradient-to-r from-[#FF6F00] via-[#FFCC33] to-[#FF6F00]
                   scale-x-0 group-hover:scale-x-100
                   origin-left transition-transform duration-300"
        aria-hidden="true"
      />
    </div>
  );
}