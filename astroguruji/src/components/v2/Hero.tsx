import { HERO_STATS, SERVICE_PILLS } from "@/data/home";
import BrandLogoMidIcon from "@/assets/icons/BrandLogoMidIcon";
import BrandLogoSmallIcon from "@/assets/icons/BrandLogoSmallIcon";
import ServicePill from "./ServicePill";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pb-[40px] pt-[142px]">
      {/* Gradient overlay — peach arc at top */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[200%] h-[500px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,111,0,0.12) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "0 0 50% 50%",
        }}
      />

      {/* White ellipse to mask lower half */}
      <div
        className="absolute left-1/2 top-[80px] -translate-x-1/2 w-[300%] h-[900px]"
        style={{
          borderRadius: "50%",
          background: "#ffffff",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        {/* Centered astrologer circle with floating stat badges */}
        <div className="relative mx-auto max-w-[700px] flex flex-col items-center">
          {/* Mobile: stacked layout */}
          <div className="flex flex-col items-center pt-4 md:hidden">
            <img
              src="/images/v2/astrologer-circle.png"
              alt="Astrologer"
              className="h-[160px] w-[160px] rounded-full object-cover"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {HERO_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[10px] bg-surface-lemon px-3 py-2 text-center"
                >
                  <p
                    className="font-outfit text-[16px] font-bold leading-5"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-0.5 font-poppins text-[10px] font-semibold text-text-secondary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tablet/Desktop: absolute positioned stats */}
          <div className="hidden md:block" style={{ height: 340 }}>
            {/* Center circle */}
            <div className="absolute left-1/2 top-[20px] -translate-x-1/2">
              <img
                src="/images/v2/astrologer-circle.png"
                alt="Astrologer"
                className="h-[180px] w-[180px] rounded-full object-cover lg:h-[240px] lg:w-[240px]"
              />
            </div>

            {/* Stat: top-left */}
            <div
              className="absolute rounded-[10px] bg-surface-lemon px-3 py-2 lg:px-[18px] lg:py-[12px]"
              style={{ top: 20, left: 10 }}
            >
              <p
                className="font-outfit text-[16px] font-bold leading-6 lg:text-[22px]"
                style={{ color: HERO_STATS[0].color }}
              >
                {HERO_STATS[0].value}
              </p>
              <p className="mt-1 font-poppins text-[10px] font-semibold text-text-secondary lg:text-[12px]">
                {HERO_STATS[0].label}
              </p>
            </div>

            {/* Stat: top-right */}
            <div
              className="absolute rounded-[10px] bg-surface-lemon px-3 py-2 lg:px-[18px] lg:py-[12px]"
              style={{ top: 20, right: 10 }}
            >
              <p
                className="font-outfit text-[16px] font-bold leading-6 lg:text-[22px]"
                style={{ color: HERO_STATS[1].color }}
              >
                {HERO_STATS[1].value}
              </p>
              <p className="mt-1 font-poppins text-[10px] font-semibold text-text-secondary lg:text-[12px]">
                {HERO_STATS[1].label}
              </p>
            </div>

            {/* Stat: bottom-left */}
            <div
              className="absolute rounded-[10px] bg-surface-lemon px-3 py-2 lg:px-[18px] lg:py-[12px]"
              style={{ bottom: 20, left: 0 }}
            >
              <p
                className="font-outfit text-[16px] font-bold leading-6 lg:text-[22px]"
                style={{ color: HERO_STATS[2].color }}
              >
                {HERO_STATS[2].value}
              </p>
              <p className="mt-1 font-poppins text-[10px] font-semibold text-text-secondary lg:text-[12px]">
                {HERO_STATS[2].label}
              </p>
            </div>

            {/* Stat: bottom-right */}
            <div
              className="absolute rounded-[10px] bg-surface-lemon px-3 py-2 lg:px-[18px] lg:py-[12px]"
              style={{ bottom: 20, right: 0 }}
            >
              <p
                className="font-outfit text-[16px] font-bold leading-6 lg:text-[22px]"
                style={{ color: HERO_STATS[3].color }}
              >
                {HERO_STATS[3].value}
              </p>
              <p className="mt-1 font-poppins text-[10px] font-semibold text-text-secondary lg:text-[12px]">
                {HERO_STATS[3].label}
              </p>
            </div>
          </div>
        </div>
        {/* Circles background with decorative brand logos positioned relative to the image */}
        <div className="absolute top-[8%] left-0 w-full hidden md:block">
          <div className="relative">
            <img
              src="/images/v2/circles-homepage.png"
              alt=""
              className="w-full"
            />
            <BrandLogoSmallIcon
              size={14}
              className="absolute left-[3%] top-[62%]"
            />
            <BrandLogoSmallIcon
              size={14}
              className="absolute left-[10%] top-[96%]"
            />
            <BrandLogoSmallIcon
              size={14}
              className="absolute left-[14%] top-[67%]"
            />
            <BrandLogoSmallIcon
              size={14}
              className="absolute left-[23%] top-[89%]"
            />
            <BrandLogoSmallIcon
              size={14}
              className="absolute left-[62%] top-[79%]"
            />
          </div>
        </div>

        {/* CTA — centered */}
        <div className="mt-4 flex flex-col items-center text-center md:mt-2">
          <p className="font-outfit text-[13px] font-semibold text-brand-green md:text-[15px]">
            200+ Collabs Through Astrgurujii
          </p>
          <h1 className="mt-1 font-poppins text-[24px] font-extrabold uppercase leading-tight text-black md:text-[32px]">
            Chat With <span className="text-brand-orange">Astrogurujii</span>
          </h1>
          <button className="mt-3 flex h-[45px] w-[136px] items-center justify-center gap-[10px]  bg-brand-orange font-poppins text-[12px] font-bold text-white transition-colors hover:bg-orange-700 md:text-[13px]">
            CHAT NOW
          </button>

          {/* Carousel dots */}
          <div className="mt-16 flex gap-[12px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-[10px] w-[10px] rounded-full ${i === 0 ? "bg-brand-orange" : "bg-[#ffcc33]"}`}
              />
            ))}
          </div>
        </div>

        {/* Service pills — horizontal row with logo in center */}
        <div className="mt-6 flex flex-col items-center md:mt-14">
          {/* Mobile: single column */}
          <div className="flex flex-col items-center gap-3 md:hidden">
            {SERVICE_PILLS.slice(0, 2).map((pill) => (
              <ServicePill key={pill.label} {...pill} />
            ))}
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-brand-orange">
              <BrandLogoMidIcon
                width={48}
                height={32}
                className="object-contain brightness-0 invert"
              />
            </div>
            {SERVICE_PILLS.slice(2).map((pill) => (
              <ServicePill key={pill.label} {...pill} />
            ))}
          </div>

          {/* Desktop: single row */}
          <div className="hidden items-center justify-center gap-[16px] mt-1 md:flex -translate-x-12">
            {SERVICE_PILLS.slice(0, 2).map((pill) => (
              <ServicePill key={pill.label} {...pill} />
            ))}
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-orange">
              <BrandLogoMidIcon
                width={48}
                height={32}
                className="object-contain brightness-0 invert h-[40px] w-[60px]"
              />
            </div>
            {SERVICE_PILLS.slice(2).map((pill) => (
              <ServicePill key={pill.label} {...pill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
