import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/v2/Navbar";
import Hero from "@/components/v2/Hero";
import Services from "@/components/v2/Services";
import Consultants from "@/components/v2/Consultants";
import Blog from "@/components/v2/Blog";
import StatsBanner from "@/components/v2/StatsBanner";
import Testimonials from "@/components/v2/Testimonials";
import Faq from "@/components/v2/Faq";
import Footer from "@/components/v2/Footer";
import MainAstrologerProfile from "@/components/v2/User Account/component/MainAstrologerProfile";
import HomeBannerSlider from "./HomebannerSlider";
import LiveAstrologersData from "./LivreAstrologerListHome";

const API_BASE_URL = "https://admin.astrogurujii.com";

export default function Home() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
const controller = new AbortController();

      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${API_BASE_URL}/user_api/home_data`, {
        headers,
          cache: "no-store",

            signal: controller.signal,

        timeout: 10000,
      });

      if (res?.data.status) {
        setHomeData(res?.data);
      }
    } catch (err) {
      console.error("Home API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white font-euclid">
      <Navbar />
      <HomeBannerSlider
        banners={homeData?.banner || []}
        isLoading={loading}
      />
      <Hero />
      <MainAstrologerProfile /> {/* ✅ Always visible */}
      <Services />
      <Consultants data={homeData?.astrologer || []} />
      <LiveAstrologersData  data={homeData?.live || []} />
      <Blog data={homeData?.blog || []} />
      <StatsBanner />
      <Testimonials data={homeData?.testimonials || []} />
      <Faq />
      <Footer />
    </div>
  );
}