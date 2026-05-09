import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";
import EmptyState from "@/components/v2/common/EmptyState";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

const API_BASE_URL = "https://admin.astrogurujii.com";

// Matches actual API response shape
export type BlogItem = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  auther: string;
  img: string;
  icon: string;
  Created_date: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function BlogCard({ blog, index }: { blog: BlogItem; index: number }) {
  const navigate = useNavigate();
  const excerpt = stripHtml(blog.description).slice(0, 130) + "...";
  const isFeatured = index === 0;

  return (
    <article
      onClick={() => navigate(`/blog/${blog.id}`)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-[#F0E8DF] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,111,0,0.12)] hover:border-brand-orange/40 ${
        isFeatured ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-[#FFF5EC] ${
          isFeatured ? "h-[260px] sm:h-[320px]" : "h-[180px]"
        }`}
      >
        {blog.img ? (
          <img
            src={blog.img}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/600x300/FFF5EC/FF6F00?text=AstroGurujii";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-poppins text-[13px] text-brand-orange/40">
              AstroGurujii
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent" />
        {blog.icon && (
          <div className="absolute left-3 top-3 h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-md">
            <img
              src={blog.icon}
              alt={blog.auther}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 p-4 ${isFeatured ? "lg:p-5" : ""}`}>
        {/* Meta */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF0E0] px-2.5 py-0.5 font-poppins text-[10px] font-semibold text-brand-orange">
            ✦ {blog.auther}
          </span>
          <span className="font-euclid text-[10px] text-gray-400">
            {formatDate(blog.Created_date)}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-poppins font-semibold leading-snug text-[#1A1A1A] transition-colors group-hover:text-brand-orange ${
            isFeatured
              ? "text-[16px] sm:text-[19px] lg:text-[21px]"
              : "text-[13px] sm:text-[14px] line-clamp-2"
          }`}
        >
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p
          className={`font-euclid text-[12px] leading-[1.6] text-gray-500 ${
            isFeatured ? "line-clamp-3" : "line-clamp-2 hidden sm:block"
          }`}
        >
          {excerpt}
        </p>

        {/* Read more */}
        <div className="mt-1 flex items-center gap-1">
          <span className="font-poppins text-[11px] font-semibold text-brand-orange">
            Read More
          </span>
          <svg
            className="h-3 w-3 text-brand-orange transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}/user_api/blog_list`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (res.data?.status) {
        // API returns { status: true, message: "...", results: [...] }
        setBlogs(res.data.results || []);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error("Blog API Error:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <BreadcrumbHeader
        title="Astrology Blog"
        highlight="Astrogurujii"
        description="Explore insights on astrology, festivals, planetary influences, and spiritual remedies from our expert astrologers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-[94px] lg:py-12">
        {loading ? (
          <MasterLoader text="Loading Blogs..." />
        ) : blogs.length === 0 ? (
          <EmptyState title="No Blogs Found" />
        ) : (
          <>
            {/* Section label */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[3px] w-8 rounded-full bg-brand-orange" />
              <span className="font-poppins text-[13px] font-semibold uppercase tracking-widest text-brand-orange">
                Latest Articles
              </span>
              <span className="h-[3px] flex-1 rounded-full bg-[#F0E8DF]" />
            </div>

            {/* Grid — first card spans 2 cols as featured */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}