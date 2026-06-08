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

// ── Client-side sort helper ───────────────────────────────────────────────────
function clientSort(data: any[], sortValue: string): any[] {
  if (!sortValue) return data;
  return [...data].sort((a, b) => {
    switch (sortValue) {
      case "low_to_high": return (parseFloat(a.per_min_voice_call) || 0) - (parseFloat(b.per_min_voice_call) || 0);
      case "high_to_low": return (parseFloat(b.per_min_voice_call) || 0) - (parseFloat(a.per_min_voice_call) || 0);
      case "experience":  return (parseFloat(b.experience)         || 0) - (parseFloat(a.experience)         || 0);
      case "rating":      return (parseFloat(b.avg_rate)           || 0) - (parseFloat(a.avg_rate)           || 0);
      case "orders":      return (parseInt(b.consult)              || 0) - (parseInt(a.consult)              || 0);
      default: return 0;
    }
  });
}

export default function CallWithAstrologer() {
  const [consultants,  setConsultants]  = useState<any[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [activeTab,    setActiveTab]    = useState("");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [sortValue,    setSortValue]    = useState("");

  // ── Client-side sort applied on top of API results ────────────────────────
  const sortedConsultants = clientSort(consultants, sortValue);

  const fetchAstrologers = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/user_api/astrologer_list`,
        {
          search:        searchQuery,
          page:          "",
          is_chat:       "",
          followAstro:   "",
          is_voice_call: "on",
          is_video_call: "",
          cat_id:        activeTab,
          language_id:   "",
          gender:        "",
          sort_val:      sortValue,
          is_question:   "",
          skill_id:      "",
          country:       "INR",
          report_id:     "",
          expert_astro:  "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConsultants(res.data?.status ? (res.data.results ?? []) : []);
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
        title="Call with Astrologer"
        highlight="Astrogurujii"
        description="Talk to expert astrologers over voice call for instant guidance on all life matters."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Call with Astrologer" }]}
      />

      <FilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      <div className="mt-4 mb-4" />

      <main className="container mx-auto px-4 pb-12 mt-4">
        {isLoading ? (
          <MasterLoader text="Fetching Astrologers..." />
        ) : consultants.length === 0 ? (
          <EmptyState />
        ) : (
          <ConsultantGrid
            consultants={sortedConsultants}
            callType="audio"
            onFollowToggle={(id, followed) =>
              setConsultants((prev) =>
                prev.map((c) =>
                  String(c.id) === id ? { ...c, is_Follow: followed ? "yes" : "no" } : c
                )
              )
            }
          />
        )}
      </main>

      <TalkToAstrologerSection />
      <Faq
        title={
          <h2 className="font-inter text-[22px] md:text-[30px] font-bold text-black uppercase">
            Frequently Asked Questions
          </h2>
        }
        showTabs={false}
      />
      <Footer />
    </div>
  );
}