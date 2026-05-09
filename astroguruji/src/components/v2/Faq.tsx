
import { useState } from "react";
import { FAQ_DATA } from "@/data/FAQ_data";


interface FaqProps {
  title?: React.ReactNode;
 
  
  
  showTabs?: boolean;
  className?: string;
}

export default function Faq({
  title,
  
  
  
  showTabs = true,
  className = "",
}: FaqProps = {}) {
  

  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState<string | null>("left-0");
  
  const faqTabs = FAQ_DATA.map((item) => item.tab);
  
  const currentFaq = FAQ_DATA[activeTab] || { left: [], right: [] };
  
  const faqLeft = currentFaq.left;
  const faqRight = currentFaq.right;

  return (
    <section
      className={`w-full bg-gradient-to-b from-[#fefbec] to-white py-12 lg:py-16 ${className}`}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[104px]">
        {/* Title */}
        {title !== undefined ? (
          <div className="text-center mb-8">{title}</div>
        ) : (
          <h2 className="font-outfit text-[30px] font-bold uppercase text-center mb-8">
            <span className="text-neutral-800">Got Questions?</span>{" "}
            <span className="text-[#D41000]">We&apos;ve Got Answers.</span>
          </h2>
        )}

        {/* Tabs */}
        {showTabs && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {faqTabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`rounded-[5px] px-4 py-2 font-inter text-[14px] font-semibold transition-colors ${
                  i === activeTab
                    ? "bg-[#34A853] text-white"
                    : "bg-white border border-neutral-200 text-[#787878]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Two-column FAQ */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[60px]">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-y-2 md:gap-y-[24px]">
            {faqLeft.map((faq, i) => {
              const id = `left-${i}`;
              const isOpen = openIndex === id;
              return isOpen ? (
                <div
                  key={id}
                  className={`bg-white border border-black/5 rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] mb-1 p-4`}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setOpenIndex(null)}
                  >
                    <p className="font-instrument text-[16px] font-semibold text-[#FF6F00]">
                      {faq.question}
                    </p>
                    <svg
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      className="shrink-0 rotate-180"
                    >
                      <path
                        d="M1 1l6.5 6.5L14 1"
                        stroke="#ff6f00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {faq.answer && (
                    <>
                      <hr className="my-3 border-black/10" />
                      <p className="font-instrument text-[15px] leading-[29px] text-neutral-800">
                        {faq.answer}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div
                  key={id}
                  className="bg-white border-b border-black/[0.06] py-3 px-4 cursor-pointer"
                  onClick={() => setOpenIndex(id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-instrument text-[16px] font-semibold text-neutral-800">
                      {faq.question}
                    </p>
                    <svg
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M1 1l6.5 6.5L14 1"
                        stroke="#313131"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col gap-y-2 md:gap-y-[24px]">
            {faqRight.map((faq, i) => {
              const id = `right-${i}`;
              const isOpen = openIndex === id;
              return isOpen ? (
                <div
                  key={id}
                  className="bg-white border border-black/5 rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] mb-1 p-4"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setOpenIndex(null)}
                  >
                    <p className="font-instrument text-[16px] font-semibold text-[#FF6F00]">
                      {faq.question}
                    </p>
                    <svg
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      className="shrink-0 rotate-180"
                    >
                      <path
                        d="M1 1l6.5 6.5L14 1"
                        stroke="#ff6f00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {faq.answer && (
                    <>
                      <hr className="my-3 border-black/10" />
                      <p className="font-instrument text-[15px] leading-[29px] text-neutral-800">
                        {faq.answer}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div
                  key={id}
                  className="bg-white border-b border-black/[0.06] py-3 px-4 cursor-pointer"
                  onClick={() => setOpenIndex(id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-instrument text-[16px] font-semibold text-neutral-800">
                      {faq.question}
                    </p>
                    <svg
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M1 1l6.5 6.5L14 1"
                        stroke="#313131"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
