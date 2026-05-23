import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ConsultantListing from "@/pages/ConsultantListing";
import ConsultantDetail from "@/pages/ConsultantDetail";
import CallWithAstrologer from "./pages/CallWithAstrologer";
import LiveAstrologersPage from "./pages/LiveAstrologerPage";
import BlogPage from "./components/v2/BlogListPage";
import BlogDetailPage from "./components/v2/BlogDetailsPage";
import HoroscopePage from "./components/v2/HoroScopePage";
import PanchangPage from "./components/v2/Panchang";
import NotificationsPage from "./components/v2/NotificationListPage";
import EditProfilePage from "./components/v2/User Account/UserProfileManager";
import WalletPage from "./components/v2/User Account/UserWalletPage";
import RechargePage from "./components/v2/User Account/WalletRechargePage";
import OrdersPage from "./components/v2/Reports/OrderPage";
import SupportChatPage from "./components/v2/Reports/CustomerChatSupport";
import ChatScreen from "./pages/ChatScreen";
import ChatCallingScreen from "./pages/ChatCallingScreen";
import ActiveCallBar from "./pages/ActiveCallBar";
import { AudioCallProvider } from "./pages/AudioCallContext";
import { ChatProvider } from "./pages/ChatContext"; 
import AudioCallScreen from "./pages/AudioCallScreen";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsAndConditionsPage from "./pages/TermsAndConditions";
import AboutUsPage from "./pages/AboutUsPage";
import CareersPage from "./pages/CareerPage";
import AstrologerRegistration from "./pages/AstrologerRegistrationPage";
import ActiveChatBar from "./pages/ActiveChatBar";  // ADD this import
import ChatViewOnlyScreen from "./pages/Chatviewonlyscreen";
import VastuPage from "./pages/Vastupagr";
import NumerologyPage from "./pages/Numerologypage";
import FreeKundliPage from "./pages/Freekundli";
import TarotReadingPage from "./pages/Tarotreadingpage";



function App() {
  return (
     <AudioCallProvider>
      <ChatProvider> 
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/chat-with-astrolger" element={<ConsultantListing />} />
      <Route path="/call-with-astrolger" element={<CallWithAstrologer />} />
      <Route path="/live-astrologer" element={<LiveAstrologersPage />} />
      <Route path="/consultants/:id" element={<ConsultantDetail />} />
      <Route path="/our-blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route path="/horoscope" element={<HoroscopePage />} />
      <Route path="/panchang" element={<PanchangPage />} />
      <Route path="/notify_list" element={<NotificationsPage />} />
      <Route path="/user_profile" element={<EditProfilePage />} />
      <Route path="/my-wallet" element={<WalletPage />} />
      <Route path="/recharge-now" element={<RechargePage />} />
      <Route path="/user-reports" element={<OrdersPage />} />
      <Route path="/customer-chat-support" element={<SupportChatPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/career" element={<CareersPage />} />
      <Route path="/astrologer-registration" element={<AstrologerRegistration />} />
      <Route path="/chat-calling" element={<ChatCallingScreen />} />
      <Route path="/chat" element={<ChatScreen />} />
      <Route path="/chat-view-only" element={<ChatViewOnlyScreen />} />
      <Route path="/audio-call" element={<AudioCallScreen />} />
      <Route path="/vastu" element ={<VastuPage/>} />
      <Route path="/numerology" element ={<NumerologyPage/>} />
      <Route path="/free_kundli" element ={<FreeKundliPage/>} />
            <Route path="/tarot_reading" element ={<TarotReadingPage/>} />

      

      
        
    
    </Routes>
    <ActiveCallBar />
    <ActiveChatBar />
      </ChatProvider>
    </AudioCallProvider>
  );
}

export default App;
