import {
  FOOTER_COL1,
  FOOTER_CONTACT,
  FOOTER_IMPORTANT_LINKS,
  FOOTER_IMPORTANT_LINKS_2,
  FOOTER_SECURE_ITEMS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_USEFUL_LINKS,
} from "@/data/footer";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#2d2d2d]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-[30px] pt-[40px] md:px-6 md:pb-[40px] md:pt-[60px] lg:px-[94px]">
        {/* Columns */}
        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 - Horoscope 2026 */}
          <div>
            <h4 className="mb-[16px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
              Horoscope 2026
            </h4>
            <ul className="space-y-[8px]">
              {FOOTER_COL1.horoscope2026.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.link}
                    className="font-euclid text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="mb-[16px] mt-[28px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
              Horoscope
            </h4>
            <ul className="space-y-[8px]">
              {FOOTER_COL1.horoscope.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.link}
                    className="font-euclid text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="mb-[16px] mt-[28px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
              Shubh Muhurat
            </h4>
            <ul className="space-y-[8px]">
              {FOOTER_COL1.shubhMuhurat.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.link}
                    className="font-euclid text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 - Important Links */}
          <div>
            <h4 className="mb-[16px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
              Important Links
            </h4>
            <ul className="space-y-[8px]">
              {FOOTER_IMPORTANT_LINKS.map((item) => (
                <li key={item.label} className="flex items-start gap-[6px]">
                  <a
                    href={item.link}
                    className="font-euclid text-[13px] leading-snug text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                  {"isNew" in item && item.isNew && (
                    <span className="relative top-[-2px] rounded-full bg-[#FF0000] px-[6px] py-[1px] font-euclid text-[9px] font-medium text-white">
                      New
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Important Links 2 */}
          <div>
            <h4 className="mb-[16px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
              Important Links
            </h4>
            <ul className="space-y-[8px]">
              {FOOTER_IMPORTANT_LINKS_2.map((item) => (
                <li key={item.label} className="flex items-start gap-[6px]">
                  <a
                    href={item.link}
                    className="font-euclid text-[13px] leading-snug text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                  {"isNew" in item && item.isNew && (
                    <span className="relative top-[-2px] rounded-full bg-[#FF0000] px-[6px] py-[1px] font-euclid text-[9px] font-medium text-white">
                      New
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Useful Links */}
          <div>
            <h4 className="mb-[16px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
              Useful Links
            </h4>
            <ul className="space-y-[8px]">
              {FOOTER_USEFUL_LINKS.map((item) => (
                <li key={item.link}>
                  <a
                    href={item.link}
                    className="font-euclid text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Us */}
            <div className="mt-[28px]">
              <h4 className="mb-[16px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
                Contact Us
              </h4>
              <div className="space-y-[8px]">
                <p className="font-euclid text-[13px] text-white/70">
                  <span className="font-bold text-white">Phone:</span>
                  {FOOTER_CONTACT.phone}
                </p>
                <p className="font-euclid text-[13px] text-white/70">
                  <span className="font-bold text-white">Whatsapp:</span>{" "}
                  {FOOTER_CONTACT.whatsapp}
                </p>
                <p className="font-euclid text-[13px] text-white/70">
                  <span className="font-bold text-white">Email:</span>
                  {FOOTER_CONTACT.email}
                </p>
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-[16px] flex gap-[10px]">
              {FOOTER_SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  aria-label={s.name}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-brand-orange"
                >
                  <img
                    src={s.icon}
                    alt={s.name}
                    className="h-[18px] w-[18px] brightness-0 invert"
                  />
                </a>
              ))}
            </div>

            {/* Secure */}
            <div className="mt-[28px]">
              <h4 className="mb-[16px] font-euclid text-[15px] font-bold text-white/70 underline decoration-brand-orange underline-offset-[6px]">
                Secure
              </h4>
              <div className="space-y-[16px]">
                {FOOTER_SECURE_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-[12px]"
                  >
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-white/10">
                      <span className="text-[20px]">{item.icon}</span>
                    </div>
                    <span className="font-euclid text-[13px] text-white/70">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* App Store badges */}
            <div className="mt-[24px] flex gap-[10px]">
              <div className="flex h-[40px] items-center gap-[6px] rounded-lg bg-white/10 px-[12px]">
                <span className="text-[18px]">▶</span>
                <div>
                  <p className="font-euclid text-[8px] text-white/60">
                    GET IT ON
                  </p>
                  <p className="font-euclid text-[12px] font-semibold text-white">
                    Google Play
                  </p>
                </div>
              </div>
              <div className="flex h-[40px] items-center gap-[6px] rounded-lg bg-white/10 px-[12px]">
                <span className="text-[18px]">🍎</span>
                <div>
                  <p className="font-euclid text-[8px] text-white/60">
                    Download on the
                  </p>
                  <p className="font-euclid text-[12px] font-semibold text-white">
                    App Store
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-center justify-center bg-[#222222] py-[24px]">
        <p className="font-euclid text-[14px] text-white">
          Copyright © Astrogurujii 2026
        </p>
      </div>
    </footer>
  );
}