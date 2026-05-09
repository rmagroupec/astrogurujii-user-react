import type { Specialty } from "@/data/consultant-detail";
import SpecialtyCard from "./SpecialtyCard";

interface AboutSectionProps {
  paragraphs: string[];
  specialties: Specialty[];
}

export default function AboutSection({
  paragraphs,
  specialties,
}: Readonly<AboutSectionProps>) {
  return (
    <>
      <section
        className="rounded-[10px] bg-white p-4 sm:p-7 border border-[rgba(238,128,44,0.23)]"
        data-testid="about-section"
      >
        <h2 className="mb-4 font-outfit text-[20px] sm:text-[25px] font-bold uppercase text-brand-orange">
          About Me
        </h2>
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="mb-3 font-poppins text-[13px] font-normal leading-[29px] text-black last:mb-0"
          >
            {para}
          </p>
        ))}
      </section>
      {/* Specialty Row */}
      <div className="flex flex-wrap rounded-[10px] justify-center sm:justify-between gap-3 sm:gap-0 pt-8">
        {specialties.map((spec) => (
          <SpecialtyCard key={spec.label} specialty={spec} />
        ))}
      </div>
    </>
  );
}
