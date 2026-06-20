import { useRef, useState } from "react";

type ApiTestimonial = {
  _id: string;
  title: string;
  description: string;
  img: string;
  color: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M6.5 0l2 4.1L13 4.8l-3.25 3.2.77 4.5L6.5 10.2 2.48 12.5l.77-4.5L0 4.8l4.5-.7L6.5 0z"
            fill="#ff6f00"
          />
        </svg>
      ))}
    </div>
  );
}

function GoogleStars() {
  return (
    <svg width="170" height="31" viewBox="0 0 170 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 35, 70, 105, 138].map((offset, index) => (
        <path 
          key={index}
          d={`M${31.1302 + offset} 12.7757L${24.2354 + offset} 19.4967L${25.8636 + offset} 28.9894C${25.9344 + offset} 29.4045 ${25.764 + offset} 29.824 ${25.4231 + offset} 30.0719C${25.2305 + offset} 30.2125 ${25.0013 + offset} 30.2833 ${24.7722 + offset} 30.2833C${24.5962 + offset} 30.2833 ${24.4191 + offset} 30.2413 ${24.2575 + offset} 30.156L${15.7323 + offset} 25.6743L${7.20811 + offset} 30.1549C${6.83619 + offset} 30.352 ${6.38348 + offset} 30.3199 ${6.04256 + offset} 30.0708C${5.70163 + offset} 29.8229 ${5.53117 + offset} 29.4034 ${5.60201 + offset} 28.9883L${7.23025 + offset} 19.4956L${0.334333 + offset} 12.7757C${0.0332592 + offset} 12.4813 ${-0.0763227 + offset} 12.0407 ${0.0542901 + offset} 11.6411C${0.184903 + offset} 11.2415 ${0.531359 + offset} 10.9482 ${0.948656 + offset} 10.8873L${10.4779 + offset} 9.50373L${14.7394 + offset} 0.867785C${15.1124 + offset} 0.11178 ${16.3521 + offset} 0.11178 ${16.7251 + offset} 0.867785L${20.9867 + offset} 9.50373L${30.5159 + offset} 10.8873C${30.9332 + offset} 10.9482 ${31.2796 + offset} 11.2404 ${31.4102 + offset} 11.6411C${31.5408 + offset} 12.0418 ${31.4313 + offset} 12.4801 ${31.1302 + offset} 12.7757Z`} 
          fill="#FF6F00" 
        />
      ))}
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="80" height="27" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335" />
      <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C119.25 34.32 129.24 25 141.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05" />
      <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4" />
      <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853" />
      <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335" />
      <path d="M35.29 41.19V32H68c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35 0 53.89 0 34.91 0 15.93 16.32.46 36.3.46c11.05 0 18.9 4.34 24.79 9.98l-6.97 6.97c-4.21-3.95-9.91-7.03-17.82-7.03-14.56 0-25.94 11.74-25.94 24.53s11.38 24.53 25.94 24.53c9.44 0 14.81-3.78 18.24-7.22 2.77-2.77 4.59-6.72 5.31-12.14H35.29z" fill="#4285F4" />
    </svg>
  );
}

function GoogleGIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
    </svg>
  );
}

function CheckedBlueIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_59_6191)">
        <path d="M12.5593 6.48326C12.5593 7.00183 11.9222 7.42925 11.7946 7.9073C11.6629 8.40157 11.9962 9.0903 11.746 9.52278C11.4918 9.96235 10.7271 10.015 10.3706 10.3715C10.014 10.728 9.96137 11.4927 9.5218 11.747C9.08932 11.9971 8.40059 11.6639 7.90633 11.7956C7.42827 11.9232 7.00085 12.5603 6.48228 12.5603C5.96371 12.5603 5.53629 11.9232 5.05824 11.7956C4.56397 11.6639 3.87525 11.9971 3.44277 11.747C3.0032 11.4927 2.95053 10.728 2.59401 10.3715C2.23749 10.015 1.4728 9.96235 1.21858 9.52278C0.96841 9.0903 1.30163 8.40157 1.16996 7.9073C1.04235 7.42925 0.405273 7.00183 0.405273 6.48326C0.405273 5.96469 1.04235 5.53727 1.16996 5.05921C1.30163 4.56495 0.96841 3.87622 1.21858 3.44374C1.4728 3.00417 2.23749 2.9515 2.59401 2.59499C2.95053 2.23847 3.0032 1.47378 3.44277 1.21956C3.87525 0.969386 4.56397 1.30261 5.05824 1.17094C5.53629 1.04332 5.96371 0.40625 6.48228 0.40625C7.00085 0.40625 7.42827 1.04332 7.90633 1.17094C8.40059 1.30261 9.08932 0.969386 9.5218 1.21956C9.96137 1.47378 10.014 2.23847 10.3706 2.59499C10.7271 2.9515 11.4918 3.00417 11.746 3.44374C11.9962 3.87622 11.6629 4.56495 11.7946 5.05921C11.9222 5.53727 12.5593 5.96469 12.5593 6.48326Z" fill="#3F82F8" />
        <path d="M8.23858 4.67179L5.92526 6.9851L4.72606 5.78692C4.46577 5.52662 4.04341 5.52662 3.78311 5.78692C3.52282 6.04722 3.52282 6.46957 3.78311 6.72987L5.46543 8.41219C5.71864 8.66539 6.12985 8.66539 6.38306 8.41219L9.18051 5.61474C9.44081 5.35444 9.44081 4.93208 9.18051 4.67179C8.92021 4.41149 8.49887 4.41149 8.23858 4.67179Z" fill="#FFFCEE" />
      </g>
      <defs>
        <clipPath id="clip0_59_6191">
          <rect width="12.9643" height="12.9643" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function TestimonialCard({ testimonial }: { testimonial: ApiTestimonial }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanDescription = stripHtml(testimonial.description);
  
  // Rules for shortening text if it's too long
  const shouldTruncate = cleanDescription.length > 120;
  const displayText = isExpanded 
    ? cleanDescription 
    : (shouldTruncate ? `${cleanDescription.slice(0, 120)}...` : cleanDescription);

  return (
    <div className={`w-[232px] min-w-[232px] rounded-[11px] border border-black/5 bg-white p-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-all duration-200 flex flex-col justify-between ${isExpanded ? 'h-auto min-h-[204px]' : 'h-[204px]'}`}>
      <div>
        <div className="flex items-center gap-2">
          <img
            src={testimonial.img}
            alt={testimonial.title}
            className="h-[35px] w-[35px] rounded-full border border-[#F26633] object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-euclid text-[10px] font-semibold text-black truncate">
              {testimonial.title}
            </p>
          </div>
          <GoogleGIcon />
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <StarRating count={5} />
          <CheckedBlueIcon />
        </div>

        <div className="mt-2">
          <p className="font-outfit text-[11px] font-normal leading-[16px] text-black whitespace-pre-line">
            {displayText}
          </p>
        </div>
      </div>

      {shouldTruncate && (
        <div className="mt-1 pt-1 border-t border-black/5">
          <button 
            type="button"
            className="font-euclid text-[9px] font-semibold text-[#F26633] hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevents dragging handlers from triggering if inside a slider
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Testimonials({ data = [] }: { data: ApiTestimonial[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft ?? 0);
    scrollLeft.current = sliderRef.current?.scrollLeft ?? 0;
    if (sliderRef.current) sliderRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };

  return (
    <section className="w-full bg-white py-[24px] md:py-[40px] md:pt-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
        <div className="mb-2 text-center pt-1">
          <h2 className="font-outfit text-[28px] font-extrabold tracking-wide leading-tight text-black md:pb-2">
            People Love&nbsp;
            <span className="text-[#FF6F00]">Astroguruji</span>
          </h2>
          <p className="mt-2 font-outfit text-[14px] font-light leading-[20px] text-[#575757]">
            Experience trusted astrology consultations designed to help you make informed
            decisions, overcome challenges, and unlock new opportunities with confidence.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:gap-[16px]">
          <div className="flex w-full flex-col items-center justify-center md:w-[170px] flex-shrink-0">
            <p className="font-euclid text-[22px] font-semibold leading-[31px] text-black">
              EXCELLENT
            </p>
            <GoogleStars />
            <p className="leading-[31px]">
              <span className="font-euclid text-[12px] font-normal text-black">
                Based on{" "}
              </span>
              <span className="font-euclid text-[12px] font-semibold text-black">
                213 reviews
              </span>
            </p>
            <GoogleLogo />
          </div>

          <div
            ref={sliderRef}
            className="flex flex-1 gap-[26px] overflow-x-auto scrollbar-hide select-none items-start pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {data.map((t) => (
              <TestimonialCard key={t._id} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}