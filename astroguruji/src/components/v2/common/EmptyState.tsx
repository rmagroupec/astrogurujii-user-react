// components/common/EmptyState.tsx
export default function EmptyState({
    title = "No Astrologers Found",
    subtitle = "Try changing filters or search something else",
  }: {
    title?: string;
    subtitle?: string;
  }) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">🔮</div>
  
        <h3 className="font-poppins text-lg font-semibold text-black">
          {title}
        </h3>
  
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      </div>
    );
  }