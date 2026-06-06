// LocationInput.tsx
// Plain text input — no Google Maps dependency.
// The Autocomplete from @react-google-maps/api was crashing because
// LoadScript wasn't mounted with libraries={["places"]}.

export default function LocationInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your birth place..."
        className="mt-1 w-full rounded-lg border border-[#E0D5CC] px-4 py-2 text-sm focus:border-brand-orange outline-none transition-colors"
      />
    </div>
  );
}