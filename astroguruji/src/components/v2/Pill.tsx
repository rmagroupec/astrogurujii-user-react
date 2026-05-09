interface PillProps {
  readonly variant: "live" | "follow";
}

const VARIANT_STYLES = {
  live: "bg-brand-red",
  follow: "bg-brand-green",
} as const;

const VARIANT_LABELS = {
  live: "Live",
  follow: "+ Follow",
} as const;

export default function Pill({ variant }: PillProps) {
  return (
    <span
      className={`inline-flex h-[23px] items-center justify-center rounded-[5px] px-2 font-poppins text-sm font-semibold text-white ${VARIANT_STYLES[variant]}`}
    >
      {VARIANT_LABELS[variant]}
    </span>
  );
}
