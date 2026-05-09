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
  return (
    <div
      className="h-auto w-full bg-white p-5 rounded-[10px] border border-[rgba(238,128,44,0.23)]"
      data-testid="gallery-card"
    >
      <h3 className="mb-3 font-poppins text-[20px] font-medium text-brand-orange">
        Gallery
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative h-[80px] w-full overflow-hidden"
            style={{
              background: `url(${img.src}) lightgray 50% / cover no-repeat`,
            }}
          >
            {img.overlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-[rgba(4,0,0,0.58)]">
                <span className="font-outfit text-[25px] font-bold text-white">
                  {img.count}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
