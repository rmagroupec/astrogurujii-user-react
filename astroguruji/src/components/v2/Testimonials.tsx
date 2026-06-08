import { useRef } from "react";

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
      <path d="M31.1302 12.7757L24.2354 19.4967L25.8636 28.9894C25.9344 29.4045 25.764 29.824 25.4231 30.0719C25.2305 30.2125 25.0013 30.2833 24.7722 30.2833C24.5962 30.2833 24.4191 30.2413 24.2575 30.156L15.7323 25.6743L7.20811 30.1549C6.83619 30.352 6.38348 30.3199 6.04256 30.0708C5.70163 29.8229 5.53117 29.4034 5.60201 28.9883L7.23025 19.4956L0.334333 12.7757C0.0332592 12.4813 -0.0763227 12.0407 0.0542901 11.6411C0.184903 11.2415 0.531359 10.9482 0.948656 10.8873L10.4779 9.50373L14.7394 0.867785C15.1124 0.11178 16.3521 0.11178 16.7251 0.867785L20.9867 9.50373L30.5159 10.8873C30.9332 10.9482 31.2796 11.2404 31.4102 11.6411C31.5408 12.0418 31.4313 12.4801 31.1302 12.7757Z" fill="#FF6F00" />
      <path d="M67.0149 12.4749L60.1201 19.1959L61.7484 28.6886C61.8192 29.1037 61.6487 29.5232 61.3078 29.7711C61.1152 29.9117 60.8861 29.9826 60.657 29.9826C60.481 29.9826 60.3039 29.9405 60.1423 29.8553L51.617 25.3735L43.0929 29.8542C42.721 30.0512 42.2682 30.0191 41.9273 29.77C41.5864 29.5221 41.4159 29.1026 41.4868 28.6875L43.115 19.1948L36.2191 12.4749C35.918 12.1805 35.8084 11.7399 35.9391 11.3403C36.0697 10.9408 36.4161 10.6474 36.8334 10.5866L46.3626 9.20294L50.6241 0.567003C50.9972 -0.189001 52.2369 -0.189001 52.6099 0.567003L56.8714 9.20294L66.4006 10.5866C66.8179 10.6474 67.1644 10.9397 67.295 11.3403C67.4256 11.741 67.316 12.1794 67.0149 12.4749Z" fill="#FF6F00" />
      <path d="M101.214 12.4749L94.3194 19.1959L95.9476 28.6886C96.0184 29.1037 95.848 29.5232 95.507 29.7711C95.3144 29.9117 95.0853 29.9826 94.8562 29.9826C94.6802 29.9826 94.5031 29.9405 94.3415 29.8553L85.8162 25.3735L77.2921 29.8542C76.9202 30.0512 76.4675 30.0191 76.1265 29.77C75.7856 29.5221 75.6152 29.1026 75.686 28.6875L77.3142 19.1948L70.4183 12.4749C70.1172 12.1805 70.0077 11.7399 70.1383 11.3403C70.2689 10.9408 70.6153 10.6474 71.0326 10.5866L80.5618 9.20294L84.8234 0.567003C85.1964 -0.189001 86.4361 -0.189001 86.8091 0.567003L91.0706 9.20294L100.6 10.5866C101.017 10.6474 101.364 10.9397 101.494 11.3403C101.625 11.741 101.515 12.1794 101.214 12.4749Z" fill="#FF6F00" />
      <path d="M135.413 12.4749L128.519 19.1959L130.147 28.6886C130.218 29.1037 130.047 29.5232 129.706 29.7711C129.514 29.9117 129.285 29.9826 129.055 29.9826C128.879 29.9826 128.702 29.9405 128.541 29.8553L120.015 25.3735L111.491 29.8542C111.119 30.0512 110.667 30.0191 110.326 29.77C109.985 29.5221 109.814 29.1026 109.885 28.6875L111.513 19.1948L104.618 12.4749C104.316 12.1805 104.207 11.7399 104.337 11.3403C104.468 10.9408 104.815 10.6474 105.232 10.5866L114.761 9.20294L119.023 0.567003C119.396 -0.189001 120.635 -0.189001 121.008 0.567003L125.27 9.20294L134.799 10.5866C135.216 10.6474 135.563 10.9397 135.693 11.3403C135.824 11.741 135.714 12.1794 135.413 12.4749Z" fill="#FF6F00" />
      <path d="M169.613 12.4749L162.718 19.1959L164.346 28.6886C164.417 29.1037 164.246 29.5232 163.905 29.7711C163.713 29.9117 163.484 29.9826 163.255 29.9826C163.079 29.9826 162.902 29.9405 162.74 29.8553L154.215 25.3735L145.691 29.8542C145.319 30.0512 144.866 30.0191 144.525 29.77C144.184 29.5221 144.014 29.1026 144.084 28.6875L145.713 19.1948L138.817 12.4749C138.516 12.1805 138.406 11.7399 138.537 11.3403C138.667 10.9408 139.014 10.6474 139.431 10.5866L148.96 9.20294L153.222 0.567003C153.595 -0.189001 154.835 -0.189001 155.208 0.567003L159.469 9.20294L168.998 10.5866C169.416 10.6474 169.762 10.9397 169.893 11.3403C170.023 11.741 169.914 12.1794 169.613 12.4749Z" fill="#FF6F00" />
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
  return (
    <div className="w-[232px] min-w-[232px] h-[204px] rounded-[11px] border border-black/5 bg-white p-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <img
          src={testimonial.img}
          alt={testimonial.title}
          className="h-[35px] w-[35px] rounded-full border border-[#F26633] object-cover"
        />
        <div className="flex-1">
          <p className="font-euclid text-[10px] font-semibold leading-[31px] text-black">
            {testimonial.title}
          </p>
          <p className="font-euclid text-[8px] font-medium leading-[31px] text-[#7E7E7E] -mt-4">
            &nbsp;
          </p>
        </div>
        <GoogleGIcon />
      </div>

      <div className="mt-1 flex items-center gap-1.5">
        <StarRating count={5} />
        <CheckedBlueIcon />
      </div>

      <div className="mt-1">
        <p className="font-outfit text-[11px] font-normal leading-[18px] text-black line-clamp-5">
          {stripHtml(testimonial.description)}
        </p>
        <button className="font-euclid text-[9px] font-semibold leading-[31px] text-[#F26633]">
          Read More
        </button>
      </div>
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
          {/* Google review summary — unchanged */}
          <div className="flex w-full flex-col items-center justify-center md:w-[170px]">
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

          {/* Slider — same div, now drag-scrollable */}
          <div
            ref={sliderRef}
            className="flex flex-1 gap-[26px] overflow-x-auto scrollbar-hide select-none"
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