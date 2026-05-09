import { useState, useMemo } from "react";
import ConsultantCard from "./ConsultantCard";
import { type Consultant } from "@/data/home";

const PAGE_SIZE = 12;

export default function ConsultantGrid({
  consultants,
}: Readonly<{
  consultants: Consultant[];
}>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(consultants.length / PAGE_SIZE));
  const paged = useMemo(
    () =>
      consultants.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [consultants, currentPage],
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-[101px] pb-8">
      {/* Consultant cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-[60px] sm:gap-y-[80px] mt-[50px] sm:mt-[63px]">
        {paged.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            showStatusBadge
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-[6px] bg-[#f4f4f4] text-[#313131] font-poppins text-sm font-medium hover:bg-[#eeeeee] transition-colors disabled:opacity-50"
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      )}
    </section>
  );
}
