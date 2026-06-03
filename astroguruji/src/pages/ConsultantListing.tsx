import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import FilterBar from "@/components/v2/FilterBar";
import ConsultantGrid from "@/components/v2/ConsultantGrid";
import TalkToAstrologerSection from "@/components/v2/TalkToAstrologerSection";
import Faq from "@/components/v2/Faq";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";
import EmptyState from "@/components/v2/common/EmptyState";

const API_BASE_URL = "https://admin.astrogurujii.com";

export default function ConsultantListing() {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");   // "" = All | category.id
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("");

  const sortedConsultants = [...consultants].sort((a, b) => {
    switch (sortValue) {
      case "low_to_high": return (parseFloat(a.per_min_chat) || 0) - (parseFloat(b.per_min_chat) || 0);
      case "high_to_low": return (parseFloat(b.per_min_chat) || 0) - (parseFloat(a.per_min_chat) || 0);
      case "experience": return (parseFloat(b.experience) || 0) - (parseFloat(a.experience) || 0);
      case "rating": return (parseFloat(b.avg_rate) || 0) - (parseFloat(a.avg_rate) || 0);  // ✅ also fix: was b.rating (count) not avg_rate
      case "orders": return (parseInt(b.consult) || 0) - (parseInt(a.consult) || 0);
      default: return 0;
    }
  });
  const fetchAstrologers = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/user_api/astrologer_list`,
        {
          search: searchQuery,
          page: "",
          is_chat: "on",
          followAstro: "",
          is_voice_call: "",
          is_video_call: "",
          cat_id: activeTab,   // category.id from API (or "" for All)
          language_id: "",
          gender: "",
          sort_val: sortValue,
          skill_id: "",
          country: "INR",
          report_id: "",
          expert_astro: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API payload:", { cat_id: activeTab, sort_val: sortValue, search: searchQuery });
      console.log("API response:", res.data);
      const results = res.data?.status ? (res.data.results ?? []) : [];
      setConsultants(results);
    } catch {
      setConsultants([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, sortValue]);

  useEffect(() => {
    const t = setTimeout(fetchAstrologers, 400);
    return () => clearTimeout(t);
  }, [fetchAstrologers]);

  return (
    <div className="min-h-screen w-full bg-white font-euclid">
      <Navbar />
      <BreadcrumbHeader
        title="Chat with Astrologer"
        highlight="Astrogurujii"
        description="Connect with expert astrologers over chat for guidance on love, career, health, and more."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Chat with Astrologer" }]}
      />

      <FilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      <main className="container mx-auto px-4 pb-12 mt-4">
        {isLoading ? (
          <MasterLoader text="Fetching Astrologers..." />
        ) : consultants.length === 0 ? (
          <EmptyState />
        ) : (
          <ConsultantGrid
            consultants={sortedConsultants}
            callType="chat"
            onFollowToggle={(id, followed) =>
              setConsultants((prev) =>
                prev.map((c) => (String(c.id) === id ? { ...c, is_Follow: followed ? "yes" : "no" } : c))
              )
            }
          />
        )}
      </main>

      <TalkToAstrologerSection />
      <Faq
        title={<h2 className="font-inter text-[22px] md:text-[30px] font-bold text-black uppercase">Frequently Asked Questions</h2>}
        showTabs={false}
      />
      <Footer />
    </div>
  );
}