import type { RatingBar } from "@/data/consultant-detail";
import { StarYellowIcon } from "@/assets/icons";

interface RatingCardProps {
  overallRating: number;
  totalReviews: number;
  bars: RatingBar[];
}

export default function RatingCard({
  overallRating,
  totalReviews,
  bars,
}: Readonly<RatingCardProps>) {
  return (
    <div
      className="rounded-[10px] border border-brand-amber/[0.23] bg-white px-5 py-md"
      data-testid="rating-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-outfit text-h5 font-medium leading-normal text-brand-orange">
          Rating &amp; Reviews
        </h3>
        <div className="flex items-center gap-sm">
          <img src="/images/user.svg" width={16} height={16} alt="" />
          <span className="font-outfit text-sm font-normal leading-normal text-brand-orange">
            {totalReviews} total
          </span>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Big Score */}
        <div className="flex min-w-[80px] flex-col items-center justify-center">
          <span className="font-outfit text-[59px] font-bold leading-normal text-black">
            {overallRating.toFixed(2)}
          </span>
          <div className="mt-sm flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <img
                key={`score-star-${n}`}
                src={StarYellowIcon}
                width={15}
                height={16}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* Rating Bars */}
        <div className="flex flex-1 flex-col gap-md items-end">
          {bars.map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3">
              <span className="w-3 text-right font-outfit text-[12px] text-text-subtle">
                {bar.stars}
              </span>
              <div className="h-3 w-[100px] sm:w-[136px] overflow-hidden rounded-[100px] bg-[#dadada]">
                <div
                  className="h-full rounded-[100px] bg-brand-green transition-all"
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
