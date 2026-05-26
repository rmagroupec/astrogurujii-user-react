// import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "motion/react";
// import Navbar from "@/components/v2/Navbar";
// import Footer from "@/components/v2/Footer";
// import { SendGiftModal } from "@/components/organisms/SendGiftModal/SendGiftModal";
// import {
//   ProfileSidebar,
//   RatingCard,
//   GalleryCard,
//   AboutSection,
//   ClientReviews,
// } from "@/components/v2/consultant-detail";
// import {
//   CONSULTANT_DETAIL,
//   SPECIALTIES,
//   RATING_BARS,
//   REVIEWS,
//   GALLERY_IMAGES,
// } from "@/data/consultant-detail";

// const SCROLL_OFFSET = 24;

// export default function ConsultantDetail() {
//   const { id } = useParams<{ id: string }>();
//   const [showGiftModal, setShowGiftModal] = useState(false);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const [sidebarTop, setSidebarTop] = useState(SCROLL_OFFSET);

//   // Future: fetch consultant by id. For now, use mock data.
//   const consultant = { ...CONSULTANT_DETAIL, id: id ?? "1" };

//   // Dynamically compute the sidebar sticky `top` so that when the sidebar is
//   // taller than the viewport it "scrolls through" and sticks once its bottom
//   // edge is visible, otherwise it simply pins to the top.
//   useEffect(() => {
//     const updateSidebarTop = () => {
//       if (!sidebarRef.current) return;
//       const sidebarHeight = sidebarRef.current.getBoundingClientRect().height;
//       const viewportHeight = window.innerHeight;

//       if (sidebarHeight > viewportHeight - SCROLL_OFFSET * 2) {
//         setSidebarTop(-(sidebarHeight - viewportHeight + SCROLL_OFFSET));
//       } else {
//         setSidebarTop(SCROLL_OFFSET);
//       }
//     };

//     updateSidebarTop();

//     const observer = new ResizeObserver(updateSidebarTop);
//     if (sidebarRef.current) observer.observe(sidebarRef.current);
//     window.addEventListener("resize", updateSidebarTop);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("resize", updateSidebarTop);
//     };
//   }, []);

//   return (
//     <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
//       <Navbar />

//       <main className="w-full bg-[linear-gradient(180deg,rgba(255,204,51,0.10)_0%,rgba(255,255,255,0)_98.56%)]">
//         <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-6 lg:px-[94px]">
//           <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
//             {/* Sidebar – sticky, scrolls naturally with the page */}
//             <div
//               ref={sidebarRef}
//               className="flex flex-col gap-5 lg:sticky lg:w-[393px] lg:shrink-0"
//               style={{ top: `${sidebarTop}px` }}
//             >
//               <ProfileSidebar
//                 consultant={consultant}
//                 specialties={SPECIALTIES}
//                 onSendGiftClick={() => setShowGiftModal(true)}
//               />
//               <GalleryCard images={GALLERY_IMAGES} />
//               <RatingCard
//                 overallRating={consultant.rating}
//                 totalReviews={5683}
//                 bars={RATING_BARS}
//               />
//             </div>

//             {/* Main Content – scroll-triggered entrance animations */}
//             <div className="flex min-w-0 flex-1 flex-col gap-6">
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//               >
//                 <AboutSection
//                   paragraphs={consultant.aboutParagraphs}
//                   specialties={SPECIALTIES}
//                 />
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
//               >
//                 <ClientReviews reviews={REVIEWS} />
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       <SendGiftModal
//         isOpen={showGiftModal}
//         onClose={() => setShowGiftModal(false)}
//         astrologerName={consultant.name}
//       />
//     </div>
//   );
// }


import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import { SendGiftModal } from "@/components/organisms/SendGiftModal/SendGiftModal";
import {
  ProfileSidebar,
  RatingCard,
  GalleryCard,
  AboutSection,
  ClientReviews,
} from "@/components/v2/consultant-detail";
import MasterLoader from "@/components/v2/common/MasterLoader";

const API_BASE_URL = "https://admin.astrogurujii.com";
const SCROLL_OFFSET = 24;

// ── API shape ────────────────────────────────────────────────────────────────
type ApiRating = {
  name: string;
  profileImg: string;
  rating: string;
  review: string;
  createdDate: string;
};

type ApiGallery = {
  file: string;
  _id: string;
};

type ApiCategory = { name: string };
type ApiLanguage = { name: string };
type ApiSkill    = { name: string };

type ApiAstrologerDetail = {
  _id: string;
  id: string;
  name: string;
  profileImg: string;
  experience: number;
  about: string;
  country: string;
  city?: string;
  state?: string;
  astro_country?: string;
  avg_rate: string;
  consult: number;
  chat_count: number;
  audio_count: number;
  video_count: number;
  rating_total_person: number;
  five_rate: string;
  four_rate: string;
  three_rate: string;
  two_rate: string;
  one_rate: string;
  perMinChat: number;
  perMinVoiceCall: number;
  perMinVideoCall: number;
  per_min_chat_offer: string;
  per_min_voice_call_offer: string;
  per_min_video_call_offer: string;
  isChatOnline: string;
  isVoiceOnline: string;
  isVideoOnline: string;
  is_busy: number;
  is_Follow: string;
  category: ApiCategory[];
  language: ApiLanguage[];
  skill: ApiSkill[];
  galary: ApiGallery[];
  rating: ApiRating[];
};

export default function ConsultantDetail() {
  const { id } = useParams<{ id: string }>();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(SCROLL_OFFSET);
  const [consultant, setConsultant] = useState<ApiAstrologerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── fetch astrologer details ───────────────────────────────────────────────
  const fetchDetail = useCallback(async () => {
    if (!id) return;
  
    try {
      setIsLoading(true);
  
      const token = localStorage.getItem("token");
  
  
      const res = await axios.post(
        `${API_BASE_URL}/user_api/astrologer_profile`,
        { id: id }, // ✅ explicit
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("DETAIL API:", res.data);
  
      if (res.data?.status && res.data?.results?.length > 0) {
        setConsultant(res.data.results[0]);
      } else {
        setError("Astrologer not found.");
      }
    } catch (err) {
      console.error("ERROR:", err);
      setError("Failed to load astrologer details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  // ── sticky sidebar height ─────────────────────────────────────────────────
  useEffect(() => {
    if (!sidebarRef.current) return;
  
    const updateSidebarTop = () => {
      const sidebarHeight =
        sidebarRef.current?.getBoundingClientRect().height || 0;
      const viewportHeight = window.innerHeight;
  
      setSidebarTop(
        sidebarHeight > viewportHeight - SCROLL_OFFSET * 2
          ? -(sidebarHeight - viewportHeight + SCROLL_OFFSET)
          : SCROLL_OFFSET
      );
    };
  
    updateSidebarTop();
  
    const observer = new ResizeObserver(updateSidebarTop);
    observer.observe(sidebarRef.current);
  
    window.addEventListener("resize", updateSidebarTop);
  
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSidebarTop);
    };
  }, [consultant]);

  // ── derived props ─────────────────────────────────────────────────────────
  const specialties =
  consultant?.category?.map((cat: any, i: number) => ({
    label: cat.name,
    icon: "", // not used
    color: "#FF6F00",
    bgLight: ["#FFE5D0", "#E3F2FD", "#E8F5E9"][i % 3],
  })) || [];
  const galleryImages =
  consultant?.galary?.map((g, i, arr) => ({
    id: g._id || String(i),
    src: g.file,
    overlay: i === 5 && arr.length > 6,
    count: i === 5 ? `+${arr.length - 6}` : "",
  })) ?? [];

  const ratingBars = consultant
  ? [
    { stars: 5, percent: Number(consultant.five_rate || 0) },
      { stars: 4, percent: Number(consultant.four_rate || 0) },
      { stars: 3, percent: Number(consultant.three_rate || 0) },
      { stars: 2, percent: Number(consultant.two_rate || 0) },
      { stars: 1, percent: Number(consultant.one_rate || 0) },
    ]
  : [];

  const reviews =
  consultant?.rating?.map((r: any, i: number) => ({
    id: i,
    name: r.name || "User",
    avatar: r.profileImg || "",
    rating: Number(r.rating || 0),
    text: r.review || "No review", // ✅ rename
    date: r.createdDate || "",
  })) || [];

  const consultantForSidebar = consultant
  ? {
      id: consultant.id ?? consultant._id,

      name: consultant.name,

      // ✅ Avatar
      avatar:
      (consultant as any).profile_img ||
        "https://ui-avatars.com/api/?name=" + consultant.name,

      // ✅ Rating
      rating: Number(consultant.avg_rate || 0),

      // ✅ Orders
      orders: String(consultant.consult || 0),

      // ✅ Location (VERY IMPORTANT)
      location: `${consultant.city || ""}, ${consultant.state || ""}`,

      // ✅ Languages
      languages:
        consultant.language?.map((l) => l.name).join(", ") || "",

      // ✅ Pricing FIX (critical)
      chatPrice: Number(
  consultant.per_min_chat_offer || consultant.per_min_chat || 0
),
callPrice: Number(
  consultant.per_min_voice_call_offer || consultant.per_min_voice_call || 0
),

chatOriginal: consultant.per_min_chat || 0,
callOriginal: consultant.per_min_voice_call || 0,
videoOriginal: consultant.per_min_video_call || 0,

      // ✅ Experience
      experience: String(consultant.experience || 0),

      // ✅ Followers
      followers: (consultant as any).follow_count || 0,
      // ✅ Wait time (not in API → fallback)
      avgTime: "5-10 min",
      totalConsultations: String(consultant.consult || 0),
verified: true,

      // ✅ Required for About section
      aboutParagraphs: consultant.about ? [consultant.about] : [],
    }
  : null;
  // ── render ────────────────────────────────────────────────────────────────
  if (isLoading) return <MasterLoader text="Loading Astrologer..." />;

  if (error || !consultantForSidebar) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="font-euclid text-[16px] text-[#606060]">
            {error ?? "Astrologer not found."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <Navbar />

      <main className="w-full bg-[linear-gradient(180deg,rgba(255,204,51,0.10)_0%,rgba(255,255,255,0)_98.56%)]">
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-6 lg:px-[94px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

            {/* Sidebar */}
            <div
              ref={sidebarRef}
              className="flex flex-col gap-5 lg:sticky lg:w-[393px] lg:shrink-0"
              style={{ top: `${sidebarTop}px` }}
            >
              <ProfileSidebar
                consultant={consultantForSidebar}
                specialties={specialties}
                onSendGiftClick={() => setShowGiftModal(true)}
              />
              <GalleryCard images={galleryImages} />
              <RatingCard
                overallRating={parseFloat(consultant!.avg_rate)}
                totalReviews={consultant!.rating_total_person}
                bars={ratingBars}
              />
            </div>

            {/* Main content */}
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <AboutSection
                  paragraphs={consultantForSidebar.aboutParagraphs}
                  specialties={specialties}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              >
                <ClientReviews reviews={reviews} />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <SendGiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        astrologerName={consultantForSidebar.name}
      />
    </div>
  );
}