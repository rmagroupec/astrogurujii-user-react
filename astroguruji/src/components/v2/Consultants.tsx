import { useRef, useState } from "react";

import ConsultantCardNew from "./NewConsultantCard";

// API shape from homeData.astrologer / homeData.top_astrologer
type ApiAstrologer = {
  id: string;
  name: string;
  profile_img: string;
  country: string;
  experience: number;
  perMinChat: number;
  per_min_chat_offer: string;
  language: { name: string }[];
};

const CONSULTANT_TABS = ["All", "Top Rated", "New", "Experienced"];

const PAGE_SIZE = 24;

export default function Consultants({ data = [] }: { data: ApiAstrologer[] }) {
  console.log(data);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const paginatedCards = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-[24px] md:py-[40px]"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        {/* Section header */}
        <div className="mb-2 text-center">
          <h2 className="font-poppins text-[25px] font-bold uppercase leading-tight md:leading-[64px] text-brand-orange">
            astrguruji Consultant
          </h2>
          <p className="font-euclid text-[14px] font-light leading-[20px] text-text-muted">
            Trending consultant are redefining the way we List popular
            Consultant As per your selected City.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap justify-center gap-[8px] md:gap-[12px]">
          {CONSULTANT_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(i);
                setCurrentPage(1);
              }}
              className={`h-[29px] w-[110px] rounded-[4px] font-euclid text-[14px] transition-colors ${
                i === activeTab
                  ? "bg-brand-orange font-bold text-white"
                  : "border border-[#D3D3D3] bg-transparent font-medium text-[#606060] hover:bg-brand-orange hover:font-bold hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="mt-[63px] grid grid-cols-1 gap-x-[24px] gap-y-[80px] sm:grid-cols-2 lg:grid-cols-4 pt-12">
          {paginatedCards.length > 0 ? (
            paginatedCards.map((consultant) => (
              // <ConsultantCard
              //   key={c.id}
              //   consultant={c}
              //   false
              // />
              <ConsultantCardNew
            key={consultant.id}
            consultant={{
              ...consultant,
              per_min_chat: consultant.perMinChat || 0,
            }}
            showStatusBadge
          />
            ))
          ) : (
            <p className="col-span-4 text-center font-euclid text-[14px] text-[#606060]">
              No consultants available.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-[12px]">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="h-[31px] w-[83px] rounded-[6px] bg-brand-orange font-euclid text-[16px] font-medium text-white transition-opacity disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex h-[31px] w-[83px] items-center justify-center rounded-[6px] bg-brand-orange font-euclid text-[16px] font-medium text-white">
            {currentPage}/{totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="h-[31px] w-[83px] rounded-[6px] bg-brand-orange font-euclid text-[16px] font-medium text-white transition-opacity disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}