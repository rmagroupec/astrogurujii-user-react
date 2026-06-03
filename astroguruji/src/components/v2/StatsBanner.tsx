import { STATS } from "@/data/home";

const SessionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2" />
    <path d="M9 12l2 2 4-4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2l1.5 1.5L15 2l1 2 2-.5-.5 2 2 1-1.5 1.5L19 10l-2 1 .5 2-2-.5L15 15l-1.5-1.5L12 15l-1-2-2 .5.5-2-2-1 1.5-1.5L8 6l2-1-.5-2 2 .5L13 2z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const RatingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round" fill="#f59e0b" fillOpacity="0.2" />
  </svg>
);

const ExperienceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="2" />
    <polyline points="12 6 12 12 16 14" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1.5" fill="#a855f7" />
  </svg>
);

const STAT_CONFIG = [
  { icon: <SessionIcon />, bgColor: "bg-green-50", ringColor: "ring-green-100", valueColor: "text-[#22c55e]" },
  { icon: <VerifiedIcon />, bgColor: "bg-blue-50", ringColor: "ring-blue-100", valueColor: "text-[#3b82f6]" },
  { icon: <RatingIcon />, bgColor: "bg-amber-50", ringColor: "ring-amber-100", valueColor: "text-[#f59e0b]" },
  { icon: <ExperienceIcon />, bgColor: "bg-purple-50", ringColor: "ring-purple-100", valueColor: "text-[#a855f7]" },
];

export default function StatsBanner() {
  return (
    <section className="relative w-full py-8 md:py-12">
      <div className="relative mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

        <div className="flex flex-col md:flex-row items-stretch rounded-2xl shadow-lg overflow-hidden">

          {/* "People Trust" chevron */}
          <div
            className="relative flex items-center justify-center gap-3 md:gap-4 bg-gradient-to-br from-[#FF8C00] to-[#FF4500] px-8 py-5 md:py-6 md:min-w-[240px] z-10 flex-shrink-0"
            style={{ clipPath: "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)" }}
          >
            <img
              src="/images/Logo-people-trust.svg"
              alt="Astrogurujii"
              className="h-[36px] w-[36px] md:h-[48px] md:w-[48px] object-contain brightness-0 invert flex-shrink-0"
            />
            <div className="hidden md:block h-10 w-px bg-white/40 flex-shrink-0" />
            <p className="font-outfit text-[18px] md:text-[22px] font-bold text-white whitespace-nowrap">
              People Trust
            </p>
          </div>

          {/* Stats panel — 2x2 on mobile, 4 in a row on desktop */}
          <div className="flex flex-1 bg-white md:rounded-r-2xl -ml-4 md:-ml-6">
            <div className="grid grid-cols-2 md:grid-cols-4 w-full divide-x divide-y md:divide-y-0 divide-gray-100 pl-6 md:pl-10">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-5 md:px-5 md:py-6">
                  {/* Icon bubble */}
                  <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full ring-4 ${STAT_CONFIG[i].bgColor} ${STAT_CONFIG[i].ringColor}`}>
                    {STAT_CONFIG[i].icon}
                  </div>
                  {/* Value + Label */}
                  <div className="min-w-0">
                    <p className={`font-outfit text-[18px] md:text-[28px] font-extrabold leading-tight flex items-center gap-1 ${STAT_CONFIG[i].valueColor}`}>
                      {stat.value}
                      {/* ✅ star only on rating stat (index 2) */}
                      {i === 2 && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                    </p>
                    <p className="font-poppins text-[10px] md:text-[13px] font-medium text-gray-500 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}