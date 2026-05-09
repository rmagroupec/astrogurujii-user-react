import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  image?: string;
  title?: string;
  category?: string;
  date?: string;
  id?:string;
  onClick?: () => void;
}

export default function BlogCard({
  image,
  title,
  category,
  date,
  id,
 
}: Readonly<BlogCardProps>) {
  const navigate = useNavigate();
  return (
    <div
    onClick={() => navigate(`/blog/${id}`)}
      className="w-full cursor-pointer overflow-hidden border border-black/5 bg-white px-[10px] py-[8px] shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-[140px] sm:h-[165px] overflow-hidden rounded-[6px]">
        <img
          src={image || "/images/default-blog.jpg"}
          alt={title || "Blog"}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Optional overlay (only if video type later) */}
        {/* You can conditionally show this if needed */}
        {/* 
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          ...
        </div> 
        */}
      </div>

      {/* Content */}
      <div className="pt-[8px]">
        <p className="line-clamp-2 font-inter text-[12px] font-semibold leading-[18px] text-black">
          {title || "Untitled Blog"}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <span className="font-euclid text-[10px] font-semibold text-[#FF6F00]">
            {category || "Astrology"}
          </span>

          <span className="text-[#FF6F00] text-[10px]">|</span>

          <span className="font-euclid text-[9px] font-semibold text-[#FF6F00]">
            {date || ""}
          </span>
        </div>
      </div>
    </div>
  );
}