import type { Review } from "@/data/consultant-detail";
import ReviewCard from "./ReviewCard";

interface ClientReviewsProps {
  reviews: Review[];
}

export default function ClientReviews({
  reviews,
}: Readonly<ClientReviewsProps>) {
  return (
    <section
      className="rounded-[10px] bg-white p-4 sm:p-6 border border-[rgba(238,128,44,0.23)]"
      data-testid="client-reviews"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between pr-6">
        <h2 className="font-outfit text-[20px] sm:text-[25px] font-bold uppercase text-brand-orange ">
          Client Reviews
        </h2>
        <button className="font-poppins text-[16px] text-brand-orange hover:underline">
          View All
        </button>
      </div>

      {/* Scrollable Reviews */}
      <div className="flex max-h-[820px] flex-col gap-4 overflow-y-auto  [&::-webkit-scrollbar]:h-full [&::-webkit-scrollbar]:w-[11px] [&::-webkit-scrollbar-track]:rounded-[50px] [&::-webkit-scrollbar-track]:bg-[rgba(218,218,218,0.37)] [&::-webkit-scrollbar-thumb]:rounded-[50px] [&::-webkit-scrollbar-thumb]:bg-[#FF6F00] [scrollbar-color:#FF6F00_rgba(218,218,218,0.37)] pr-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
