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

export default function CallWithAstrologer() {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAstrologers = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/user_api/astrologer_list`,
        {
          search: searchQuery,
          page: "",
          is_chat: "",
          followAstro: "",
          is_voice_call: "on",
          is_video_call: "",
          cat_id: activeTab,
          language_id: "",
          gender: "",
          sort_val: "",
          is_question: "",
          skill_id: "",
          country: "INR",
          report_id: "",
          expert_astro: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        // ✅ Pass RAW results — do NOT run through mapAstrologerData
        // mapAstrologerData strips isChatOnline / isVoiceOnline / is_busy
        setConsultants(response.data.results ?? []);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const delay = setTimeout(() => fetchAstrologers(), 400);
    return () => clearTimeout(delay);
  }, [fetchAstrologers]);

  const handleFollowToggle = (id: string, followed: boolean) => {
    setConsultants((prev) =>
      prev.map((c) => (String(c.id) === id ? { ...c, is_Follow: followed ? "yes" : "no" } : c))
    );
  };

  return (
    <div className="min-h-screen w-full bg-white font-euclid">
      <Navbar />
      <BreadcrumbHeader
        title="Consultant"
        highlight="Astrogurujii"
        description="Life can often feel uncertain—whether you're facing challenges in your career, relationships, health, or family matters. At Astroguruji, we connect you with trusted astrologers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Astroguruji Consultant" },
        ]}
      />
      <FilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-4">
        {isLoading ? (
          <MasterLoader text="Fetching Astrologers..." />
        ) : consultants.length === 0 ? (
          <EmptyState />
        ) : (
          <ConsultantGrid
            consultants={consultants}
            callType="audio"
            onFollowToggle={handleFollowToggle}
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