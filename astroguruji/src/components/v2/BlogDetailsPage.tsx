import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import { BlogItem } from "./BlogListPage";

const API_BASE_URL = "https://admin.astrogurujii.com";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [related, setRelated] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch single blog by id AND all blogs for related sidebar — parallel
      const [detailRes, listRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/user_api/blog_list`, { id }, { headers }),
        axios.post(`${API_BASE_URL}/user_api/blog_list`, {}, { headers }),
      ]);

      // Single blog: API may return results: [item] or results: item
      const detailResults = detailRes.data?.results;
      if (Array.isArray(detailResults) && detailResults.length > 0) {
        setBlog(detailResults[0]);
      } else if (detailResults && !Array.isArray(detailResults)) {
        setBlog(detailResults as BlogItem);
      } else {
        // Fallback: find in the full list
        const all: BlogItem[] = listRes.data?.results || [];
        setBlog(all.find((b) => b.id === id) || null);
      }

      // Related: all except current, max 3
      const allBlogs: BlogItem[] = listRes.data?.results || [];
      setRelated(allBlogs.filter((b) => b.id !== id).slice(0, 3));
    } catch (err) {
      console.error("Blog Detail Error:", err);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <MasterLoader text="Loading Article..." />;

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <p className="font-poppins text-[18px] text-gray-500">
            Blog not found.
          </p>
          <button
            onClick={() => navigate("/our-blog")}
            className="rounded-lg bg-brand-orange px-6 py-2 font-poppins text-[13px] font-semibold text-white"
          >
            ← Back to Blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <BreadcrumbHeader
        title={blog.title}
        highlight="Blog"
        description=""
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Article" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-[94px] lg:py-12">
        <div className="flex flex-col gap-10 lg:flex-row">

          {/* ── Main Content ── */}
          <article className="min-w-0 flex-1">
            {/* Hero image */}
            {blog.img && (
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/900x420/FFF5EC/FF6F00?text=AstroGurujii";
                  }}
                />
              </div>
            )}

            {/* Author meta */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {blog.icon && (
                <img
                  src={blog.icon}
                  alt={blog.auther}
                  className="h-9 w-9 rounded-full border-2 border-brand-orange/30 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div>
                <p className="font-poppins text-[12px] font-semibold text-brand-orange">
                  {blog.auther}
                </p>
                <p className="font-euclid text-[11px] text-gray-400">
                  {formatDate(blog.Created_date)}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-6 font-poppins text-[22px] font-bold leading-snug text-[#1A1A1A] sm:text-[26px] lg:text-[30px]">
              {blog.title}
            </h1>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[3px] w-10 rounded-full bg-brand-orange" />
              <span className="h-px flex-1 bg-[#F0E8DF]" />
            </div>

            {/* Rendered HTML content */}
            <div
              className="prose-blog max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />

            {/* Back button */}
            <div className="mt-10">
              <button
                onClick={() => navigate("/our-blog")}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-orange px-5 py-2 font-poppins text-[13px] font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Back to Blog
              </button>
            </div>
          </article>

          {/* ── Sidebar: Related Posts ── */}
          {related.length > 0 && (
            <aside className="w-full shrink-0 lg:w-[300px]">
              <div className="sticky top-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-[3px] w-6 rounded-full bg-brand-orange" />
                  <h3 className="font-poppins text-[14px] font-bold uppercase tracking-wide text-[#1A1A1A]">
                    Related Articles
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {related.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => navigate(`/blog/${r.id}`)}
                      className="group flex cursor-pointer gap-3 rounded-xl border border-[#F0E8DF] bg-white p-3 transition-all hover:border-brand-orange/40 hover:shadow-md"
                    >
                      {r.img && (
                        <img
                          src={r.img}
                          alt={r.title}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://placehold.co/64x64/FFF5EC/FF6F00?text=•";
                          }}
                        />
                      )}
                      <div className="flex min-w-0 flex-col justify-center gap-1">
                        <p className="line-clamp-2 font-poppins text-[12px] font-semibold leading-snug text-[#1A1A1A] group-hover:text-brand-orange">
                          {r.title}
                        </p>
                        <span className="font-euclid text-[10px] text-gray-400">
                          {formatDate(r.Created_date)}
                        </span>
                      </div>


                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* ── CTA Strip — Chat & Call ── */}
        <div className="mt-8 rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
            {/* Text */}
            <div className="text-center sm:text-left">
              <p className="font-poppins text-[16px] font-bold text-white leading-tight">
                Need Personal Guidance?
              </p>
              <p className="font-poppins text-[12px] text-white/80 mt-0.5">
                Connect with an expert astrologer instantly
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Chat */}
              <button
                onClick={() => navigate("/chat-with-astrolger")}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-poppins text-[13px] font-bold transition hover:bg-orange-50 active:scale-95"
                style={{ color: "#FF6F00" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Chat Now
              </button>

              {/* Call */}
              <button
                onClick={() => navigate("/call-with-astrolger")}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 font-poppins text-[13px] font-bold text-white transition active:scale-95"
                style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Now
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Scoped prose styles for rendered HTML blog content */}
      <style>{`
        .prose-blog { font-family: 'Euclid Circular A', sans-serif; font-size: 14px; line-height: 1.8; color: #4B5563; }
        .prose-blog h1, .prose-blog h2, .prose-blog h3, .prose-blog h4 {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          color: #1A1A1A; margin-top: 1.5rem; margin-bottom: 0.5rem; line-height: 1.3;
        }
        .prose-blog h1 { font-size: 1.5rem; }
        .prose-blog h2 { font-size: 1.3rem; }
        .prose-blog h3 { font-size: 1.15rem; }
        .prose-blog h4 { font-size: 1rem; }
        .prose-blog p { margin-bottom: 1rem; }
        .prose-blog ul, .prose-blog ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-blog li { margin-bottom: 0.4rem; }
        .prose-blog strong { color: #1A1A1A; font-weight: 600; }
        .prose-blog a { color: #FF6F00; text-decoration: underline; }
        .prose-blog hr { border-color: #F0E8DF; margin: 1.5rem 0; }
      `}</style>

      <Footer />
    </div>
  );
}