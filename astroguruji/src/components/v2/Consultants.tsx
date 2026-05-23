import { useRef, useState, useMemo } from "react";
import ConsultantCardNew from "./NewConsultantCard";

// API shape from homeData.astrologer
type ApiAstrologer = {
  id: string;
  name: string;
  profile_img: string;
  country: string;
  experience: number;
  perMinChat: number;
  per_min_chat: number;
  per_min_chat_offer: string;
  avg_rate?: string;
  consult?: number;
  isChatOnline?: string;
  isVoiceOnline?: string;
  language: { name: string }[];
  online?: boolean;
};

const CONSULTANT_TABS = ["All", "Top Rated", "New", "Experienced"] as const;
type Tab = (typeof CONSULTANT_TABS)[number];

const PAGE_SIZE = 24;

// ─── Filter logic per tab ─────────────────────────────────────────────────────
// Top Rated  → avg_rate >= 4.5  (sorted desc by rating)
// New        → experience <= 2  (sorted asc by experience)
// Experienced → experience >= 5 (sorted desc by experience)
// All        → no filter, original order

function applyTab(data: ApiAstrologer[], tab: Tab): ApiAstrologer[] {
  switch (tab) {
    case "Top Rated": {
      const filtered = data.filter(
        (a) => parseFloat(a.avg_rate ?? "0") >= 4.5
      );
      return [...filtered].sort(
        (a, b) =>
          parseFloat(b.avg_rate ?? "0") - parseFloat(a.avg_rate ?? "0")
      );
    }
    case "New": {
      const filtered = data.filter((a) => (a.experience ?? 0) <= 2);
      return [...filtered].sort(
        (a, b) => (a.experience ?? 0) - (b.experience ?? 0)
      );
    }
    case "Experienced": {
      const filtered = data.filter((a) => (a.experience ?? 0) >= 5);
      return [...filtered].sort(
        (a, b) => (b.experience ?? 0) - (a.experience ?? 0)
      );
    }
    case "All":
    default:
      return data;
  }
}

export default function Consultants({ data = [] }: { data: ApiAstrologer[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Apply tab filter & sort ───────────────────────────────────────────────
  const filteredData = useMemo(
    () => applyTab(data, activeTab),
    [data, activeTab]
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  // Clamp current page when filter changes
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCards = filteredData.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // reset to page 1 on tab change
  };

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
            Astroguruji Consultant
          </h2>
          <p className="font-euclid text-[14px] font-light leading-[20px] text-text-muted">
            Trending consultants are redefining the way we list popular
            consultants as per your selected city.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap justify-center gap-[8px] md:gap-[12px]">
          {CONSULTANT_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`h-[29px] w-[110px] rounded-[4px] font-euclid text-[14px] transition-colors ${
                tab === activeTab
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
              <ConsultantCardNew
                key={consultant.id}
                consultant={{
                  ...consultant,
                  per_min_chat: consultant.per_min_chat ?? consultant.perMinChat ?? 0,
                }}
                showStatusBadge
              />
            ))
          ) : (
            <p className="col-span-4 text-center font-euclid text-[14px] text-[#606060] py-12">
              {activeTab === "All"
                ? "No consultants available."
                : `No ${activeTab.toLowerCase()} consultants found.`}
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-[12px]">
          <button
            disabled={safePage === 1}
            onClick={() => goToPage(safePage - 1)}
            className="h-[31px] w-[83px] rounded-[6px] bg-brand-orange font-euclid text-[16px] font-medium text-white transition-opacity disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex h-[31px] w-[83px] items-center justify-center rounded-[6px] bg-brand-orange font-euclid text-[16px] font-medium text-white">
            {safePage}/{totalPages}
          </span>
          <button
            disabled={safePage === totalPages}
            onClick={() => goToPage(safePage + 1)}
            className="h-[31px] w-[83px] rounded-[6px] bg-brand-orange font-euclid text-[16px] font-medium text-white transition-opacity disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}