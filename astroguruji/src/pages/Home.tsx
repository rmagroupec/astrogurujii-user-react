import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/v2/Navbar";
import Hero from "@/components/v2/Hero";
import Services from "@/components/v2/Services";
import Consultants from "@/components/v2/Consultants";
import LiveAstrologers from "@/components/v2/LiveAstrologers";
import Blog from "@/components/v2/Blog";
import StatsBanner from "@/components/v2/StatsBanner";
import Testimonials from "@/components/v2/Testimonials";
import Faq from "@/components/v2/Faq";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";
import MainAstrologerProfile from "@/components/v2/User Account/component/MainAstrologerProfile";
import HomeBannerSlider from "./HomebannerSlider";



const API_BASE_URL = "https://admin.astrogurujii.com";

export default function Home() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_BASE_URL}/user_api/home_data`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
  if (loading) return <MasterLoader text="Loading Home..." />;
  return (
    
    <div className="min-h-screen w-full bg-white font-euclid">
      <Navbar />
      {/* <Hero /> */}
      {/* <Services />
      <Consultants />
      <LiveAstrologers />
      <Blog />
      <StatsBanner />
      <Testimonials />
      <Faq /> */}
      <HomeBannerSlider
        banners={homeData?.banner || []}
        isLoading={loading}
      />
      <Hero />
      
<MainAstrologerProfile />
<Services  />

 <Consultants data={homeData?.astrologer || []} />

<LiveAstrologers data={homeData?.live_astrologers || []} />
{/* <HomeBannerSlider
        banners={homeData?.banner_ads || []}
        isLoading={loading}
      /> */}

{/* ✅ FIX HERE */}
<Blog data={homeData?.blog || []} />

<StatsBanner  />

<Testimonials data={homeData?.testimonials || []} />

<Faq  /> 
      <Footer />
    </div>
  );
}
