export default function MainSelect({ label, value, options, onChange }: any) {
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E0D5CC] px-4 py-2 text-sm focus:border-brand-orange outline-none"
        >
          <option value="">Select</option>
          {options.map((o: string) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }