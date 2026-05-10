import { useState, useEffect } from "react";

interface GalleryImage {
  id: string;
  src: string;
  overlay: boolean;
  count?: string;
}

interface GalleryCardProps {
  images: GalleryImage[];
}

export default function GalleryCard({ images }: Readonly<GalleryCardProps>) {
  // Track which image is currently open in the lightbox
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex]);

  // Navigation Handlers
  const closeLightbox = () => setSelectedIndex(null);

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setSelectedIndex((selectedIndex + 1) % images.length);
      if (e.key === "ArrowLeft") setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <>
      {/* ─── Standard Gallery Grid ─── */}
      <div
        className="h-auto w-full bg-white p-5 rounded-[10px] border border-[rgba(238,128,44,0.23)]"
        data-testid="gallery-card"
      >
        <h3 className="mb-3 font-poppins text-[20px] font-medium text-brand-orange">
          Gallery
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className="relative h-[80px] w-full overflow-hidden rounded-md cursor-pointer transition-transform duration-300 hover:scale-[1.03] shadow-sm"
              style={{
                background: `url(${img.src}) lightgray 50% / cover no-repeat`,
              }}
            >
              {img.overlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(4,0,0,0.58)] transition-colors hover:bg-[rgba(4,0,0,0.4)]">
                  <span className="font-outfit text-[25px] font-bold text-white">
                    {img.count}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Lightbox / Broad View Modal ─── */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-orange hover:text-white transition-colors"
            title="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Main Content Container */}
          <div className="relative flex w-full max-w-5xl items-center justify-center px-4 md:px-16 h-full">
            
            {/* Prev Arrow */}
            {images.length > 1 && (
              <button
                onClick={showPrev}
                className="absolute left-2 md:left-4 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-orange transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
            )}

            {/* Current Image */}
            <img
              src={images[selectedIndex].src}
              alt={`Gallery view ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-slideUp"
              onClick={(e) => e.stopPropagation()} // Prevent clicking the image from closing the modal
            />

            {/* Next Arrow */}
            {images.length > 1 && (
              <button
                onClick={showNext}
                className="absolute right-2 md:right-4 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-orange transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            )}
            
          </div>

          {/* Image Counter Badge */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1.5 font-poppins text-sm font-semibold tracking-wider text-white backdrop-blur-md">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}