import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";
import EmptyState from "@/components/v2/common/EmptyState";
import LiveCard from "@/components/v2/consultant-detail/LiveCard";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";


const API_BASE_URL = "https://admin.astrogurujii.com";

export default function LiveAstrologersPage() {
  const [liveList, setLiveList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveAstrologers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/user_api/live_astrologer_list`
      );

      if (res.data?.status) {
        setLiveList(res.data.data || []);
      } else {
        setLiveList([]);
      }
    } catch (err) {
      console.error("Live API Error:", err);
      setLiveList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAstrologers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BreadcrumbHeader
  title="Live Astrologers"
  highlight="Astrogurujii"
  description="Join live sessions with expert astrologers and get real-time guidance. Ask questions, interact, and experience astrology live."
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Live Astrologers" },
  ]}
/>
      <div className="container mx-auto px-4 py-6">

        {loading ? (
          <MasterLoader text="Loading Live Astrologers..." />
        ) : liveList.length === 0 ? (
          <EmptyState title="No Live Astrologers" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {liveList.map((item: any) => (
              <LiveCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}