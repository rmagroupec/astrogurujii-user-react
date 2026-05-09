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

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: Readonly<ReviewCardProps>) {
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
        <div className="flex flex-row justify-between w-full">
          <span className="font-outfit text-review-name font-medium text-black">
            {review.name}
          </span>
          <p className="flex items-center font-outfit text-review-date font-normal text-[#4D4D4D]">
            {review.date}
          </p>
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
