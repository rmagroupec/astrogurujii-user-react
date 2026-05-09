import { CONSULTANTS } from "@/data/home";

export default function ConsultantCard({
  consultant,
  showStatusBadge = false,
}: Readonly<{
  consultant: (typeof CONSULTANTS)[0];
  showStatusBadge?: boolean;
}>) {
  return (
    // hover:shadow-[0_4px_20px_rgba(255,111,0,0.15)]
    <div className="group relative w-full rounded-[10px] border border-[#DADADA] bg-white transition-all hover:border-brand-amber ">
      {/* Online / Offline badge */}
      {showStatusBadge &&
        (consultant.online ? (
          <div className="absolute left-[9px] top-[9px] z-10 rounded-[5px] bg-[#34a853] px-3 py-1 font-poppins text-[10px] font-semibold text-white">
            Online
          </div>
        ) : (
          <div className="absolute left-[9px] top-[9px] z-10 rounded-[5px] bg-brand-red px-3 py-1 font-poppins text-[10px] font-semibold uppercase text-white">
            Offline
          </div>
        ))}
      {/* Avatar area — half outside the card */}
      <div className="absolute -top-[45px] sm:-top-[63px] left-1/2 -translate-x-1/2">
        <div className="relative">
          <img
           src={(consultant as any).profile_img}
            alt={consultant.name}
            className="h-[90px] w-[90px] sm:h-[126px] sm:w-[126px] rounded-full border border-[#DADADA] bg-gray-300 object-cover shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-colors group-hover:border-brand-amber"
          />
          {/* Follow badge — overlapping bottom of avatar */}
          <button className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-400 px-3 sm:px-4 py-[3px] font-poppins text-[9px] sm:text-[10px] font-semibold text-white transition-colors group-hover:bg-brand-orange">
            + Follow
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-[10px] sm:px-[14px] pb-2 pt-[55px] sm:pt-[80px] text-center">
        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-poppins text-[12px] font-semibold text-brand-green">
            ₹{consultant.price}/Min
          </span>
          <span className="font-poppins text-[10px] font-semibold text-text-disabled line-through">
            ₹{consultant.originalPrice}/Min
          </span>
        </div>

        {/* Name */}
        <h3 className="mt-2 font-euclid text-[16px] sm:text-[20px] font-bold text-black">
          {consultant.name}
        </h3>

        {/* Specialty */}
        <p className="mt-1 font-euclid text-[10px] text-text-subtle">
          {consultant.specialty}
        </p>

        {/* Location */}
        <div className="mx-auto mt-2 flex items-center justify-center gap-1 border-y border-gray-200 py-[6px]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <g clipPath="url(#loc)">
              <path
                d="M4.6572 0C2.73132 0 1.16406 1.5572 1.16406 3.47171C1.16406 6.19202 4.32884 9.0008 4.46352 9.11875C4.51903 9.16739 4.58811 9.19152 4.6572 9.19152C4.72628 9.19152 4.79537 9.16739 4.85087 9.11914C4.98555 9.0008 8.15033 6.19202 8.15033 3.47171C8.15033 1.5572 6.58308 0 4.6572 0ZM4.6572 5.36172C3.58713 5.36172 2.71657 4.5027 2.71657 3.44682C2.71657 2.39094 3.58713 1.53192 4.6572 1.53192C5.72726 1.53192 6.59783 2.39094 6.59783 3.44682C6.59783 4.5027 5.72726 5.36172 4.6572 5.36172Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="loc">
                <rect width="9.31503" height="9.19152" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="font-euclid text-[11px] text-black">
            {consultant.location}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-[6px] sm:gap-[10px] px-[10px] sm:px-[20px] pb-[8px] pt-[10px]">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-[8px] font-poppins text-[12px] font-semibold text-black transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="transition-colors"
          >
            <g clipPath="url(#chat)">
              <path
                d="M7.82907 0.435547H2.60942C2.03283 0.436238 1.48005 0.665595 1.07233 1.07331C0.664618 1.48102 0.435261 2.0338 0.43457 2.6104V6.09016C0.435203 6.59134 0.608598 7.07697 0.925529 7.46521C1.24246 7.85346 1.68355 8.12056 2.17445 8.22152V9.56993C2.17444 9.64868 2.19581 9.72595 2.23627 9.79351C2.27674 9.86106 2.33478 9.91637 2.40422 9.95352C2.47365 9.99067 2.55187 10.0083 2.63053 10.0045C2.70918 10.0006 2.78532 9.97553 2.85083 9.93182L5.34974 8.26502H7.82907C8.40566 8.26433 8.95844 8.03497 9.36616 7.62725C9.77387 7.21954 10.0032 6.66676 10.0039 6.09016V2.6104C10.0032 2.0338 9.77387 1.48102 9.36616 1.07331C8.95844 0.665595 8.40566 0.436238 7.82907 0.435547ZM6.95913 5.65519H3.47936C3.364 5.65519 3.25337 5.60937 3.17179 5.52779C3.09022 5.44622 3.04439 5.33558 3.04439 5.22022C3.04439 5.10486 3.09022 4.99423 3.17179 4.91265C3.25337 4.83108 3.364 4.78525 3.47936 4.78525H6.95913C7.07449 4.78525 7.18513 4.83108 7.2667 4.91265C7.34827 4.99423 7.3941 5.10486 7.3941 5.22022C7.3941 5.33558 7.34827 5.44622 7.2667 5.52779C7.18513 5.60937 7.07449 5.65519 6.95913 5.65519ZM7.82907 3.91531H2.60942C2.49406 3.91531 2.38343 3.86948 2.30185 3.78791C2.22028 3.70634 2.17445 3.5957 2.17445 3.48034C2.17445 3.36498 2.22028 3.25434 2.30185 3.17277C2.38343 3.0912 2.49406 3.04537 2.60942 3.04537H7.82907C7.94443 3.04537 8.05507 3.0912 8.13664 3.17277C8.21821 3.25434 8.26404 3.36498 8.26404 3.48034C8.26404 3.5957 8.21821 3.70634 8.13664 3.78791C8.05507 3.86948 7.94443 3.91531 7.82907 3.91531Z"
                className="fill-black transition-colors group-hover:fill-white"
              />
            </g>
            <defs>
              <clipPath id="chat">
                <rect width="10.4393" height="10.4393" fill="white" />
              </clipPath>
            </defs>
          </svg>
          CHAT
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-[8px] font-poppins text-[12px] font-semibold text-black transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="transition-colors"
          >
            <g clipPath="url(#call)">
              <path
                d="M10.1549 7.66139L8.69811 6.20455C8.17781 5.68426 7.2933 5.8924 7.08519 6.56876C6.9291 7.03705 6.4088 7.2972 5.94053 7.19312C4.89993 6.93297 3.49513 5.5802 3.23498 4.48757C3.07889 4.01928 3.39107 3.49898 3.85934 3.34291C4.53573 3.1348 4.74384 2.25029 4.22355 1.72999L2.76671 0.273156C2.35047 -0.0910521 1.72612 -0.0910521 1.36191 0.273156L0.373342 1.26172C-0.615225 2.30232 0.477401 5.0599 2.9228 7.5053C5.3682 9.9507 8.12578 11.0954 9.16638 10.0548L10.1549 9.06619C10.5192 8.64995 10.5192 8.0256 10.1549 7.66139Z"
                className="fill-black transition-colors group-hover:fill-white"
              />
            </g>
            <defs>
              <clipPath id="call">
                <rect width="10.4393" height="10.4393" fill="white" />
              </clipPath>
            </defs>
          </svg>
          CALL
        </button>
      </div>

      {/* Rating & experience row */}
      <div className="relative px-[18px] pb-[10px]">
        <div className="flex items-center justify-center gap-3 px-[20px] py-1 rounded-[10px] bg-[rgba(255,111,0,0.09)]">
          {/* Star + rating */}
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <g clipPath="url(#star)">
                <path
                  d="M11.3554 4.30853C11.2808 4.08105 11.0764 3.91948 10.8344 3.89797L7.54841 3.60355L6.24902 0.602537C6.15321 0.382601 5.93501 0.240234 5.69257 0.240234C5.45014 0.240234 5.23194 0.382601 5.13613 0.603051L3.83674 3.60355L0.55019 3.89797C0.30871 3.92 0.104756 4.08105 0.0297926 4.30853C-0.0451703 4.536 0.0240596 4.78551 0.206733 4.94279L2.69058 7.09226L1.95815 10.2758C1.90456 10.5099 1.99663 10.7519 2.19347 10.8923C2.29927 10.9677 2.42305 11.0061 2.54787 11.0061C2.65549 11.0061 2.76225 10.9775 2.85806 10.9209L5.69257 9.24928L8.52605 10.9209C8.73339 11.044 8.99476 11.0328 9.19116 10.8923C9.38808 10.7515 9.48007 10.5094 9.42647 10.2758L8.69404 7.09226L11.1779 4.94322C11.3606 4.78551 11.4303 4.53643 11.3554 4.30853Z"
                  fill="#FF6F00"
                />
              </g>
              <defs>
                <clipPath id="star">
                  <rect width="11.385" height="11.2341" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="font-euclid text-[10px] text-text-subtle whitespace-nowrap">
              {consultant.rating} | {consultant.reviews} reviews
            </span>
          </div>

          {/* Satisfaction + experience */}
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.78381 1.3297L8.15141 2.28502C8.16245 2.31375 8.18819 2.33218 8.21927 2.33367L9.25363 2.38343C9.32397 2.38681 9.35278 2.47427 9.29787 2.5178L8.49069 3.15798C8.46643 3.17722 8.4566 3.20708 8.46476 3.2367L8.73645 4.22275C8.75492 4.2898 8.67956 4.34387 8.62062 4.30578L7.75416 3.74612C7.72811 3.72931 7.69633 3.72931 7.67028 3.74612L6.80382 4.30581C6.74491 4.34387 6.66953 4.28983 6.68799 4.22278L6.95968 3.2367C6.96784 3.20705 6.95804 3.17722 6.93375 3.15798L6.12657 2.5178C6.07166 2.47427 6.10047 2.38681 6.17081 2.38343L7.20517 2.33367C7.23628 2.33218 7.26199 2.31375 7.27303 2.28502L7.6406 1.3297C7.66549 1.2651 7.75898 1.2651 7.78381 1.3297ZM12.5837 9.19054C13.9403 9.19054 15.0401 10.2757 15.0401 11.6144C15.0401 12.953 13.9403 14.0382 12.5837 14.0382C11.2271 14.0382 10.1273 12.953 10.1273 11.6144C10.1273 10.2757 11.2271 9.19054 12.5837 9.19054ZM12.2611 11.8281L11.7122 11.2865C11.57 11.1462 11.3392 11.1462 11.1969 11.2865C11.0547 11.4269 11.0547 11.6546 11.1969 11.795L12.0042 12.5915C12.1464 12.7319 12.3772 12.7319 12.5194 12.5915C13.006 12.1114 13.4871 11.6258 13.9714 11.1435C14.1127 11.0029 14.1122 10.7759 13.9698 10.6362C13.8275 10.4965 13.5968 10.4969 13.4554 10.6378L12.2611 11.8281ZM7.71225 5.17808C8.71974 5.17808 9.53647 5.98398 9.53647 6.97811C9.53647 7.97225 8.71974 8.77815 7.71225 8.77815C6.70476 8.77815 5.88803 7.97225 5.88803 6.97811C5.88803 5.98398 6.70476 5.17808 7.71225 5.17808ZM4.48004 12.2545L9.7141 12.2544C9.66713 12.0485 9.64218 11.8343 9.64218 11.6143C9.64218 11.0177 9.82472 10.4632 10.1375 10.002C9.49687 9.42757 8.64609 9.07735 7.71225 9.07735C5.97842 9.07735 4.53034 10.2842 4.18343 11.893C4.14304 12.0802 4.2861 12.2545 4.48004 12.2545ZM14.9218 5.47776L14.2671 6.26954C14.2474 6.29333 14.2441 6.32453 14.2584 6.35185L14.7319 7.26065C14.7641 7.32247 14.7017 7.39077 14.6361 7.36564L13.6706 6.99595C13.6416 6.98485 13.6105 6.99134 13.5886 7.01315L12.859 7.73836C12.8094 7.78767 12.7243 7.7503 12.7282 7.68088L12.7862 6.66063C12.7879 6.62996 12.772 6.60279 12.7442 6.58894L11.8198 6.12838C11.7569 6.09705 11.7667 6.00561 11.8348 5.98787L12.836 5.727C12.8661 5.71916 12.8874 5.69585 12.8922 5.66548L13.0504 4.65564C13.0612 4.58694 13.1523 4.56782 13.1905 4.62626L13.7513 5.4853C13.7682 5.51112 13.7972 5.5239 13.8279 5.51896L14.8502 5.35542C14.9193 5.34434 14.9661 5.42423 14.9218 5.47776ZM11.916 2.46009C11.9272 2.3919 11.8463 2.34576 11.792 2.38945L10.9896 3.03543C10.9655 3.05484 10.9338 3.05813 10.9062 3.04407L9.98515 2.57684C9.92254 2.54506 9.85328 2.60658 9.87875 2.67138L10.2534 3.62402C10.2647 3.65265 10.2581 3.68332 10.236 3.70498L9.50103 4.42492C9.45103 4.47387 9.48893 4.55786 9.55925 4.55397L10.5932 4.49676C10.6243 4.49503 10.6518 4.51074 10.6659 4.53814L11.1326 5.45032C11.1644 5.51238 11.2571 5.50274 11.275 5.43557L11.5394 4.44757C11.5474 4.41789 11.571 4.39689 11.6018 4.39219L12.6252 4.23604C12.6948 4.22542 12.7142 4.13548 12.6549 4.09784L11.7844 3.54443C11.7582 3.52779 11.7453 3.49913 11.7503 3.46882L11.916 2.46009ZM0.574246 5.35539L1.5965 5.51893C1.62722 5.52384 1.65627 5.51109 1.67313 5.48527L2.23397 4.62626C2.27212 4.56782 2.36327 4.58694 2.37403 4.65564L2.53228 5.66551C2.53704 5.69585 2.5583 5.71919 2.58841 5.72703L3.58968 5.9879C3.65779 6.00564 3.66752 6.09708 3.60466 6.12841L2.68022 6.589C2.65245 6.60285 2.63656 6.63002 2.63829 6.66069L2.69627 7.68094C2.70021 7.75033 2.61509 7.78773 2.56548 7.73842L1.83584 7.01312C1.81391 6.99134 1.7828 6.98482 1.75379 6.99592L0.788352 7.36561C0.722704 7.39074 0.660331 7.32244 0.692564 7.26062L1.16608 6.35182C1.18033 6.3245 1.17699 6.2933 1.15731 6.26951L0.502655 5.47773C0.458384 5.4242 0.505141 5.34432 0.574246 5.35539ZM3.63244 2.38945C3.57819 2.34576 3.49723 2.3919 3.50845 2.46009L3.67419 3.46876C3.67916 3.49907 3.66625 3.52773 3.64008 3.54437L2.76949 4.09778C2.71027 4.13542 2.72965 4.22536 2.79927 4.23598L3.82271 4.39213C3.85346 4.39683 3.87708 4.4178 3.88505 4.44751L4.14943 5.43551C4.16741 5.50271 4.26008 5.51232 4.29183 5.45026L4.75858 4.53808C4.77262 4.51068 4.80015 4.495 4.83123 4.4967L5.86519 4.55391C5.93551 4.5578 5.97341 4.47381 5.92341 4.42483L5.18846 3.70492C5.16635 3.68329 5.15977 3.65259 5.17102 3.62396L5.54569 2.6713C5.57116 2.60652 5.50193 2.54497 5.43929 2.57678L4.51831 3.04401C4.49062 3.05804 4.45899 3.05478 4.43489 3.03537L3.63244 2.38945Z"
                fill="#FF6F00"
              />
            </svg>
            <span className="font-euclid text-[10px] text-text-subtle whitespace-nowrap">
              {consultant.experience} Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
