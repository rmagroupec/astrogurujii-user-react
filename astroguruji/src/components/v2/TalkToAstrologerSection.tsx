import {
  TALK_TO_ASTROLOGER_INTRO,
  TALK_SECTIONS,
} from "@/data/talk-to-astrologer";

export default function TalkToAstrologerSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-[101px] py-12">
      {/* Main heading */}
      <h2 className="font-poppins text-[22px] md:text-[30px] font-bold text-black mb-4">
        {TALK_TO_ASTROLOGER_INTRO.title}
        <span className="text-brand-orange">ASTROLOGER</span>
      </h2>

      {/* Intro paragraphs */}
      {TALK_TO_ASTROLOGER_INTRO.paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="font-poppins text-[14px] text-text-subtle leading-relaxed mb-4"
        >
          {paragraph}
        </p>
      ))}

      {/* Sub-sections */}
      <div className="mt-6 space-y-6">
        {TALK_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="font-poppins text-[18px] md:text-[24px] font-semibold text-brand-orange mb-2">
              {section.title}
            </h3>
            <p className="font-poppins text-[14px] text-text-subtle leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
