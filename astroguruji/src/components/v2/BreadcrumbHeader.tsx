type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbHeaderProps {
  title: string;
  highlight?: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function BreadcrumbHeader({
  title,
  highlight,
  description,
  breadcrumbs,
}: BreadcrumbHeaderProps) {
  return (
    <section
      className="w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 204, 51, 0.10) 0%, rgba(255, 255, 255, 0.00) 98.56%)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[101px] pt-6 pb-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1 font-poppins text-[13px] text-text-subtle">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-1">
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-brand-orange font-medium">
                    {item.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 && (
                  <span className="text-text-subtle">&gt;</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title */}
        <h1 className="font-poppins text-[24px] md:text-[36px] font-bold text-[#151924] mb-3">
          {highlight && (
            <span className="text-brand-orange">{highlight} </span>
          )}
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="font-poppins text-[13px] md:text-[14px] text-black leading-[22px] md:leading-[30px] max-w-[1185px]">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}