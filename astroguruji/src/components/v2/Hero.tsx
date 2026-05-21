import { HERO_STATS, SERVICE_PILLS } from "@/data/home";
import BrandLogoMidIcon from "@/assets/icons/BrandLogoMidIcon";
import BrandLogoSmallIcon from "@/assets/icons/BrandLogoSmallIcon";
import ServicePill from "./ServicePill";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pb-[40px]">
      {/* Gradient overlay — peach arc at top */}
      

    

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        {/* Centered astrologer circle with floating stat badges */}
        

        {/* Service pills — horizontal row with logo in center */}
        <div className="mt-6 flex flex-col items-center ">
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
