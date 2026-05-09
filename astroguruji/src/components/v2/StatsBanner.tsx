import { STATS } from "@/data/home";

export default function StatsBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image with 30% opacity */}
      <img
        src={"/images/people-trust.png"}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        <div className="relative min-h-[163px] overflow-hidden">
          <div className="relative flex h-full flex-col items-stretch md:flex-row md:items-center">
            {/* Left: "People Trust" + logo */}
            <div className="flex w-full min-h-[163px] flex-col items-center justify-center bg-[#FF6F00] px-6 py-4 md:w-[283px]">
              <img
                src="/images/Logo-people-trust.svg"
                alt="Astrogurujii"
                className="h-[53px] w-[81px] object-contain"
              />
              <p className="mt-1 font-outfit text-[24px] font-semibold capitalize leading-normal text-white md:text-[32px]">
                People Trust
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-1 flex-col items-center justify-around gap-4 px-4 py-4 sm:flex-row sm:gap-0 md:px-8">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="font-outfit text-[28px] font-bold uppercase leading-normal text-[#34A853] md:text-[44px]">
                      {stat.value}
                    </p>
                    <p className="font-poppins text-[14px] font-medium capitalize text-black md:text-[22px]">
                      {stat.label}
                    </p>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="hidden h-[126px] w-px bg-gray-300 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
