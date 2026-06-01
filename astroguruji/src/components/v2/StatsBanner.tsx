import { STATS } from "@/data/home";

// Icon components for each stat
const SessionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M9 12l2 2 4-4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2l1.5 1.5L15 2l1 2 2-.5-.5 2 2 1-1.5 1.5L19 10l-2 1 .5 2-2-.5L15 15l-1.5-1.5L12 15l-1-2-2 .5.5-2-2-1 1.5-1.5L8 6l2-1-.5-2 2 .5L13 2z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const ExperienceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="#a855f7" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 6l1.5 4.5H18l-3.8 2.8 1.5 4.5L12 15l-3.7 2.8 1.5-4.5L6 10.5h4.5L12 6z" fill="#a855f7" fillOpacity="0.2"/>
    <circle cx="19" cy="5" r="2" stroke="#a855f7" strokeWidth="1.5"/>
    <path d="M19 3v.5M19 6.5V7M17.3 4l.4.3M20.3 5.7l.4.3M17 5.5h.5M20.5 5.5H21M17.3 7l.4-.3M20.3 4.3l.4-.3" stroke="#a855f7" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const STAT_CONFIG = [
  {
    icon: <SessionIcon />,
    bgColor: "bg-green-50",
    ringColor: "ring-green-100",
    valueColor: "text-[#22c55e]",
  },
  {
    icon: <VerifiedIcon />,
    bgColor: "bg-blue-50",
    ringColor: "ring-blue-100",
    valueColor: "text-[#3b82f6]",
  },
  {
    icon: <ExperienceIcon />,
    bgColor: "bg-purple-50",
    ringColor: "ring-purple-100",
    valueColor: "text-[#a855f7]",
  },
];

export default function StatsBanner() {
  return (
    <section className="relative w-full py-8 md:py-12">
      <div className="relative mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

        {/* Card container */}
        <div className="flex flex-col md:flex-row items-stretch rounded-2xl shadow-lg overflow-visible">

          {/* "People Trust" — orange gradient chevron */}
          <div className="relative flex items-center justify-center gap-3 md:gap-4 bg-gradient-to-br from-[#FF8C00] to-[#FF4500] px-8 py-5 md:py-6 rounded-2xl md:rounded-none md:rounded-l-2xl md:min-w-[260px] z-10"
            style={{
              clipPath: "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)",
            }}
          >
            <img
              src="/images/Logo-people-trust.svg"
              alt="Astrogurujii"
              className="h-[36px] w-[36px] md:h-[48px] md:w-[48px] object-contain brightness-0 invert"
            />
            {/* vertical white divider */}
            <div className="hidden md:block h-10 w-px bg-white/40" />
            <p className="font-outfit text-[18px] md:text-[24px] font-bold text-white whitespace-nowrap">
              People Trust
            </p>
          </div>

          {/* Stats panel */}
          <div className="flex flex-1 flex-row items-center justify-around bg-white md:rounded-r-2xl px-4 py-5 md:px-10 md:py-6 -ml-4 md:-ml-6 pl-8 md:pl-12">
            {STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-3 md:gap-5">
                  {/* Circular icon bubble */}
                  <div
                    className={`flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full ring-4 ${STAT_CONFIG[i].bgColor} ${STAT_CONFIG[i].ringColor}`}
                  >
                    {STAT_CONFIG[i].icon}
                  </div>

                  {/* Value + Label */}
                  <div>
                    <p className={`font-outfit text-[22px] md:text-[36px] font-extrabold leading-tight ${STAT_CONFIG[i].valueColor}`}>
                      {stat.value}
                    </p>
                    <p className="font-poppins text-[11px] md:text-[15px] font-medium text-gray-600 whitespace-nowrap">
                      {stat.label}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                {i < STATS.length - 1 && (
                  <div className="h-[40px] md:h-[60px] w-px bg-gray-200 ml-3 md:ml-6" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}