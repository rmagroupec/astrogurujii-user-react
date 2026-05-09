interface ServiceCardProps {
  title: string;
  description: string;
}

function LotusIcon() {
  return (
    <img
      src="/images/logo-small-non-color.png"
      alt="Lotus"
      className="w-8 h-5 transition-colors duration-200"
    />
  );
}

export default function ServiceCard({
  title,
  description,
}: Readonly<ServiceCardProps>) {
  return (
    <div
      className="group bg-white rounded-[10px] border-b-4 border-primary shadow-[0px_5px_25px_0px_rgba(0,0,0,0.15)] p-4 grid grid-rows-subgrid gap-3"
      style={{ gridRow: "1 / -1" }}
    >
      {/* Icon + Title bar */}
      <div className="flex items-stretch border border-primary rounded-[5px] min-w-0 min-h-[48px]">
        <div className="bg-primary w-[60px] flex items-center justify-center flex-shrink-0 text-white group-hover:text-primary transition-colors duration-200">
          <LotusIcon />
        </div>
        <div className="flex-1 flex items-center justify-center py-3 px-2 bg-white min-w-0">
          <span className="font-poppins font-semibold text-[17px] capitalize text-black group-hover:text-primary transition-colors duration-200 text-center break-words">
            {title}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="font-poppins text-[11px] text-neutral-600 leading-5">
        {description}
      </p>
    </div>
  );
}
