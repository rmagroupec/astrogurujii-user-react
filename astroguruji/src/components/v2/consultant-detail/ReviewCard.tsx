import type { Review } from "@/data/consultant-detail";
import { StarYellowIcon } from "@/assets/icons";

function StarIcon({ size = 18 }: Readonly<{ size?: number }>) {
  return (
    <img
      src={StarYellowIcon}
      alt="star"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

// Format "2024-07-04 08:56:00" → "4 Jul 2024, 08:56 am"
function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    // Replace space with T for ISO compatibility
    const d = new Date(raw.includes("T") ? raw : raw.replace(" ", "T"));
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + ", " + d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return raw;
  }
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: Readonly<ReviewCardProps>) {
  const formattedDate = formatDate(review.date);

  return (
    <div
      className="rounded-[10px] bg-white p-4 pt-6 border border-[rgba(238,128,44,0.23)]"
      data-testid="review-card"
    >
      {/* Reviewer */}
      <div className="flex items-center gap-3">
        <div className="h-10 aspect-square shrink-0 overflow-hidden rounded-full bg-gray-300">
          <img
            src={review.avatar}
            alt={`${review.name}'s avatar`}
            className="h-full w-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-row justify-between w-full items-start">
          <span className="font-outfit text-review-name font-medium text-black">
            {review.name}
          </span>
          {formattedDate && (
            <p className="flex items-center gap-1 font-outfit text-[11px] font-normal text-[#4D4D4D] whitespace-nowrap ml-2">
              {/* Calendar icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formattedDate}
            </p>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="mb-3 flex gap-0.5 mt-3">
        {Array.from({ length: review.rating }, (_, i) => (
          <StarIcon key={`review-${review.id}-star-${i}`} />
        ))}
      </div>

      {/* Review Text */}
      <p className="mb-4 font-poppins text-[14px] leading-relaxed text-[#4d4d4d] line-clamp-3">
        {review.text}
      </p>
    </div>
  );
}