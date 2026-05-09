import { LongArrowRightIcon } from "@/assets/icons";
import Pill from "./Pill";

interface LiveAstrologerCardProps {
  readonly astrologer: any; // allow mapped data
}

export default function LiveAstrologerCard({
  astrologer,
}: LiveAstrologerCardProps) {
  const {
    image,
    name,
    specialties,
    isLive,
  } = astrologer;

  return (
    <div className="w-full overflow-hidden rounded-[10px] border border-black/[0.06] bg-white">
      
      {/* Image */}
      <div
        className="relative h-[200px] rounded-[10px] bg-gray-200 bg-cover bg-center bg-no-repeat sm:h-[264px] m-3 mb-2"
        style={{
          backgroundImage: `url(${image || "/images/default-user.png"})`,
        }}
      >
        {/* Badge */}
        <div className="absolute right-3 top-3">
          <Pill variant={isLive ? "live" : "follow"} />
        </div>
      </div>

      {/* Info */}
      <div className="px-[14px] pb-[14px] flex items-center justify-center flex-col">
        
        <h3 className="font-outfit text-[20px] sm:text-[26px] font-bold text-[#FF6F00] text-center">
          {name || "Astrologer"}
        </h3>

        {/* Specialties */}
        {specialties && (
          <div className="mt-1 py-[3px] w-full text-center">
            <div className="h-px bg-black/[0.04]" />

            <p className="py-[3px] font-euclid text-[10px] text-black line-clamp-2">
              {specialties}
            </p>

            <div className="h-px bg-black/[0.04]" />
          </div>
        )}

        {/* Button */}
        <div className="mt-2">
          <button
            disabled={!isLive}
            className={`flex h-[27px] w-[138px] items-center justify-center gap-1 rounded-[5px] font-poppins text-[10px] font-semibold text-white transition
              ${isLive ? "bg-[#FF6F00]" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            {isLive ? "WATCH NOW" : "OFFLINE"}
            <LongArrowRightIcon color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}