import { ChatIcon, TalkIcon, MallIcon, PoojaIcon } from "@/assets/icons";
import { useNavigate } from "react-router-dom";

const pillIcons: Record<string, React.ReactNode> = {
  chat: <ChatIcon color="#fff" />,
  talk: <TalkIcon color="#fff" />,
  mall: <MallIcon color="#fff" />,
  pooja: <PoojaIcon color="#fff" />,
};

interface ServicePillProps {
  label: string;
  icon: string;
  color: string;
  link: string;
}

export default function ServicePill({ label, icon, color, link }: ServicePillProps) {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(link)} className="flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-[8px] shadow-sm md:gap-3 md:px-5 md:py-[10px]">
      <div
        className="flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-full md:h-[40px] md:w-[40px]"
        style={{ backgroundColor: color }}
      >
        {pillIcons[icon]}
      </div>
      <span className="font-poppins text-[11px] font-bold uppercase text-black whitespace-nowrap md:text-[13px]">
        {label}
      </span>
    </div>
  );
}
