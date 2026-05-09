import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export default function LocationInput({
  label,
  value,
  onChange,
}: any) {
  const autocompleteRef = useRef<any>(null);

  const onLoad = (autocomplete: any) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (place && place.formatted_address) {
      onChange(place.formatted_address);
    }
  };

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your birth place..."
          className="mt-1 w-full rounded-lg border border-[#E0D5CC] px-4 py-2 text-sm focus:border-brand-orange outline-none"
        />
      </Autocomplete>
    </div>
  );
}