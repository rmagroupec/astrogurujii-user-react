import BlogCard from "./BlogCard";
function formatDate(dateStr: string) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
export default function Blog({ data = [] }: { data: any[] }) {
  // Hide section if no blogs
  console.log("BLOG DATA:", data);
  if (!data.length) return null;

  return (
    <section className="w-full bg-white py-[24px] md:py-[40px]">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="font-poppins text-[25px] font-bold uppercase text-black">
            OUR <span className="italic text-[#FF6F00]">INFORMATIVE</span> BLOG
          </h2>
          <p className="mt-4 font-outfit text-[14px] text-[#575757]">
            Explore insights, astrology tips, and guidance to improve your life.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {data.slice(0, 10).map((post: any) => (
            <BlogCard
              key={post._id}
              image={post.img}
              title={post.title}
              category="Astrology"
              id={post._id}
              date={formatDate(post.Created_date)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}