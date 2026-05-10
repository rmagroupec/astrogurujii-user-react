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

function App() {
  return (
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
      <Route path="/chat/:channelId" element={<ChatScreen />} />
    </Routes>
  );
}

export default App;
