import { useState, useMemo } from "react";
import ConsultantCard from "./ConsultantCard";

const PAGE_SIZE = 12;

// Mirror ConsultantCard's status derivation exactly
function getStatus(consultant: any, callType: "chat" | "audio"): "online" | "busy" | "offline" {
  const isChatOnline: string  = consultant.is_chat_online ?? "off";
  const isVoiceOnline: string = consultant.is_voice_online ?? "off";
  const isBusy: number        = Number(consultant.is_busy ?? 0);
  const onlineField           = callType === "chat" ? isChatOnline : isVoiceOnline;

  if (onlineField === "on" && isBusy === 0) return "online";
  if (isBusy === 1) return "busy";
  return "offline";
}

const STATUS_ORDER = { online: 0, busy: 1, offline: 2 };

export default function ConsultantGrid({
  consultants,
  callType = "chat",
  onFollowToggle,
}: Readonly<{
  consultants: any[];
  callType?: "chat" | "audio";
  onFollowToggle?: (id: string, followed: boolean) => void;
}>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort: online → busy → offline (preserves original order within each group)
  const sorted = useMemo(
    () =>
      [...consultants].sort(
        (a, b) =>
          STATUS_ORDER[getStatus(a, callType)] -
          STATUS_ORDER[getStatus(b, callType)]
      ),
    [consultants, callType]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const paged = useMemo(
    () => sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [sorted, currentPage]
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Smart pagination: always show first, last, current ± 1, with ellipsis gaps
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [];
    const add = (n: number) => {
      if (!pages.length || pages[pages.length - 1] !== n) pages.push(n);
    };
    add(1);
    if (currentPage > 3) pages.push("…");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) add(p);
    if (currentPage < totalPages - 2) pages.push("…");
    add(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-[101px] pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-[60px] sm:gap-y-[80px] mt-[50px] sm:mt-[63px]">
        {paged.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            showStatusBadge={false}
            callType={callType}
            onFollowToggle={onFollowToggle}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-[6px] bg-[#f4f4f4] text-[#313131] font-poppins text-sm font-medium hover:bg-[#eeeeee] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            &lt;
          </button>

          {pageNumbers.map((page, idx) =>
            page === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-[#313131] font-poppins text-sm select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-[6px] font-poppins text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-brand-orange text-white"
                    : "bg-[#f4f4f4] text-[#313131] hover:bg-[#eeeeee]"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-[6px] bg-[#f4f4f4] text-[#313131] font-poppins text-sm font-medium hover:bg-[#eeeeee] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      )}
    </section>
  );
}