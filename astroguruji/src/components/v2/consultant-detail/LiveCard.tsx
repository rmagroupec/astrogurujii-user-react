export default function LiveCard({ item }: { item: any }) {
    const astro = item.astrologerId;
  
    const isLive = item.isLive === "1";
  
    const handleClick = () => {
      if (isLive) {
        // 👉 Navigate to your live video page
        window.location.href = `/live/${item.channelId}`;
      } else {
        alert("Astrologer is not live yet");
      }
    };
  
    return (
      <div
        onClick={handleClick}
        className="cursor-pointer rounded-xl overflow-hidden bg-brand-orange shadow-md hover:scale-[1.02] transition"
      >
        {/* Image */}
        <div className="relative">
          <img
            src={astro?.profileImg}
            alt={astro?.displayName}
            className="h-[180px] w-full object-cover"
          />
  
          {/* Live badge */}
          <div
            className={`absolute top-0 right-0 px-2 py-1 text-xs text-white ${
              isLive ? "bg-red-600" : "bg-gray-500"
            }`}
          >
            {isLive ? "LIVE" : "UPCOMING"}
          </div>
        </div>
  
        {/* Info */}
        <div className="p-2 text-white">
          <h3 className="text-sm font-semibold">
            {astro?.displayName || astro?.name}
          </h3>
  
          {!isLive && (
            <p className="text-[11px] mt-1">
              {item.startTime} - {item.endTime}
            </p>
          )}
  
          {isLive && (
            <p className="text-[11px] mt-1">
              👁 {item.users || 0} watching
            </p>
          )}
        </div>
      </div>
    );
  }