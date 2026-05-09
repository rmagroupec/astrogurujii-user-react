// import type { Specialty } from "@/data/consultant-detail";

// interface SpecialtyCardProps {
//   specialty: Specialty;
// }

// export default function SpecialtyCard({
//   specialty,
// }: Readonly<SpecialtyCardProps>) {
//   return (
//     <div className="flex w-[calc(50%-8px)] sm:w-[11.75rem] h-[9.375rem] justify-center flex-col items-center gap-2 bg-white p-3 transition-shadow hover:shadow-md rounded-[10px] border border-[rgba(238,128,44,0.23)]">
//       <div
//         className="flex items-center justify-center rounded-full"
//         style={{ backgroundColor: specialty.bgLight }}
//       >
//         <img
//           src={specialty.icon}
//           alt={specialty.label}
//           className="aspect-square w-[78px] object-contain"
//         />
//       </div>
//       <span className="text-center font-outfit text-[20px] font-medium leading-[29px] capitalize text-brand-orange">
//         {specialty.label}
//       </span>
//     </div>
//   );
// }

import type { Specialty } from "@/data/consultant-detail";

interface SpecialtyCardProps {
  specialty: Specialty;
}
export default function SpecialtyCard({
  specialty,
}: Readonly<SpecialtyCardProps>) {

  // 🎨 Dynamic colors
  const colors = [
    "#FFE5D0",
    "#E3F2FD",
    "#E8F5E9",
    "#FCE4EC",
    "#FFF8E1",
    "#EDE7F6",
  ];

  const bgColor =
    colors[specialty.label.length % colors.length];

  // 😀 Emoji mapping
  const emojiMap: Record<string, string> = {
    career: "💼",
    job: "💼",
    love: "❤️",
    marriage: "💍",
    health: "🧘",
    finance: "💰",
    business: "📈",
    education: "📚",
    family: "👨‍👩‍👧",
    child: "👶",
    vastu: "🏠",
    kundli: "🔮",
  };

  const emoji =
    emojiMap[specialty.label.toLowerCase()] || "✨";

  return (
    <div className="flex w-[calc(50%-8px)] sm:w-[11.75rem] h-[9.5rem] flex-col items-center justify-center gap-3 bg-white p-4 mb-4 last:mb-0 rounded-[12px] border border-[rgba(238,128,44,0.23)]">

      {/* 🔥 Emoji Circle */}
      <div
        className="flex items-center justify-center rounded-full w-[80px] h-[80px]"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-3xl">
          {emoji}
        </span>
      </div>

      {/* 🔥 Label */}
      <span className="text-center font-outfit text-[18px] sm:text-[20px] font-medium leading-[26px] capitalize text-brand-orange px-2">
        {specialty.label}
      </span>
    </div>
  );
}