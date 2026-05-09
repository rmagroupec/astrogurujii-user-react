// components/common/MasterLoader.tsx
export default function MasterLoader({
    text = "Loading...",
  }: {
    text?: string;
  }) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-orange border-t-transparent"></div>
  
        {/* Text */}
        <p className="mt-4 font-poppins text-sm text-gray-500">{text}</p>
      </div>
    );
  }