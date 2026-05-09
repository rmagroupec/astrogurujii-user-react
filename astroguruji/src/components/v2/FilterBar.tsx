import { CONSULTANT_TABS } from "@/data/home";

export default function FilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: Readonly<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}>) {
  return (
    <div className="w-full mt-6 bg-[#FED402] mb-16 md:mb-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[101px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 py-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CONSULTANT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`font-poppins text-sm font-medium px-4 sm:px-5 h-[36px] sm:h-[42px] rounded-sm transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-black border border-transparent"
                    : "bg-transparent text-black border border-black hover:bg-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search + Filter + Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Search bar */}
            <div className="flex items-center w-full sm:w-[322px] h-[36px] sm:h-[42px] rounded-sm border border-[rgba(255,111,0,0.20)] bg-white p-[10px] gap-2">
              <input
                type="text"
                placeholder="Search Astrologer"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 font-outfit text-base font-normal text-black capitalize placeholder:text-black placeholder:capitalize focus:outline-none bg-transparent"
              />
              <img
                src="/images/search-magnifing-glass.svg"
                alt="Search"
                className="w-[21px] h-[21px] shrink-0"
              />
            </div>

            {/* Filter + Sort row */}
            <div className="flex gap-2 sm:gap-3">
              {/* Filter button */}
              <button
                className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:w-[98px] h-[36px] sm:h-[42px] rounded-sm bg-brand-orange text-white font-poppins text-sm font-medium"
                aria-label="Filter"
              >
                <img src="/images/filter-icon.svg" alt="" className="w-5 h-5" />
                <span>Filter</span>
              </button>

              {/* Sort button */}
              <button
                className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:w-[98px] h-[36px] sm:h-[42px] rounded-sm bg-brand-orange text-white font-poppins text-sm font-medium"
                aria-label="Sort"
              >
                <img src="/images/sort.svg" alt="" className="w-5 h-5" />
                <span>Sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
