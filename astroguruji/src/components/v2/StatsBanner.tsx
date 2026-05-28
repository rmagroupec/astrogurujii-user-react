import { STATS } from "@/data/home";

export default function StatsBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <img
        src={"/images/people-trust.png"}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        <div className="relative min-h-[163px] overflow-hidden">
          <div className="relative flex h-full flex-col items-stretch md:flex-row md:items-center">

            {/* "People Trust" header */}
            <div className="flex w-full min-h-[80px] md:min-h-[163px] flex-row items-center justify-center gap-3 bg-[#FF6F00] px-6 py-4 md:w-[283px] md:flex-col md:gap-0">
              <img
                src="/images/Logo-people-trust.svg"
                alt="Astrogurujii"
                className="h-[40px] w-[60px] object-contain md:h-[53px] md:w-[81px]"
              />
              <p className="font-outfit text-[20px] font-semibold capitalize leading-normal text-white md:mt-1 md:text-[32px]">
                People Trust
              </p>
            </div>

            {/* Stats — 3 columns on ALL screen sizes */}
            <div className="flex flex-1 flex-row items-center justify-around px-4 py-5 md:px-8">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="font-outfit text-[24px] font-bold uppercase leading-normal text-[#34A853] md:text-[44px]">
                      {stat.value}
                    </p>
                    <p className="font-poppins text-[11px] font-medium capitalize text-black md:text-[22px]">
                      {stat.label}
                    </p>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="h-[50px] w-px bg-gray-300 md:h-[126px]" />
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