export default function MainInput({
    label,
    value,
    onChange,
    type = "text",
    disabled = false,
  }: any) {
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E0D5CC] px-4 py-2 text-sm focus:border-brand-orange outline-none"
        />
      </div>
    );
  }