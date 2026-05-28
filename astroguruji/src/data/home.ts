// Homepage data — src/data/home.ts

// ── Navigation ────────────────────────────────────────────────
export const NAV_LINKS = [
  "Horoscope",
  "Panchang",
  "Live Astrologer",
  "Chat With Astrolger",
  "Call With Astrolger",
  "Our Blog",
];

// ── Hero stats ────────────────────────────────────────────────
export const HERO_STATS = [
  { value: "42,066+",           label: "Best Astrologers",          color: "#ff6f00" },
  { value: "84.0 Million",      label: "Done Consultant",           color: "#ff6f00" },
  { value: "300+ Colobs",       label: "Lorem ipsum Here Content",  color: "#d41000" },
  { value: "1207+ Million Minutes", label: "Lorem ipsum Here Content", color: "#d41000" },
];

// ── Service pills (Quick-action row / mobile 2-center-2 layout) ──
export interface ServicePill {
  label: string;
  icon: string;
  color: string;
  link: string;
}

export const SERVICE_PILLS: ServicePill[] = [
  { label: "Chat to Astrologer", icon: "chat",  color: "#ff81ca", link: "/chat-with-astrolger" },
  { label: "Talk to Astrologer", icon: "talk",  color: "#34cfb6", link: "/call-with-astrolger" },
  { label: "Astro Mall",         icon: "mall",  color: "#67a9ff", link: "#" },
  { label: "Book A Pooja",       icon: "pooja", color: "#34a853", link: "#" },
];

// ── Service cards (icon grid section) ────────────────────────
export interface ServiceCard {
  title: string;
  description: string;
  link: string;
}

export const SERVICE_CARDS: ServiceCard[] = [
  {
    title: "Chadhava",
    description:
      "Get detailed insights about upcoming auspicious dates, festivals, and rituals with accurate Chadwas calculations.",
    link: "#",
  },
  {
    title: "Free Kundali",
    description:
      "Generate your free Kundali instantly with complete birth chart analysis, dosha details, and future predictions.",
    link: "/free_kundli",
  },
  {
    title: "Today's Horoscope",
    description:
      "Check your daily horoscope for accurate predictions on love, career, health, and finances.",
    link: "/horoscope",
  },
  {
    title: "Today Panchang",
    description:
      "Get today's Panchang details including tithi, nakshatra, yoga, and auspicious timings for important activities.",
    link: "/panchang",
  },
  {
    title: "Vastu Shastra",
    description:
      "Improve your home and workplace energy with expert Vastu tips for success, prosperity, and peace.",
    link: "/vastu",
  },
  {
    title: "Numerology",
    description:
      "Discover the power of numbers in your life with personalized numerology predictions and guidance.",
    link: "/numerology",
  },
  {
    title: "Tarot Reading",
    description:
      "Get intuitive tarot card readings to uncover answers about love, career, and life decisions.",
    link: "/tarot-reading",
  },
];

// ── Live astrologers (mock / fallback data) ───────────────────
export interface LiveAstrologer {
  name: string;
  specialties: string;
  image: string;
  badge: "live" | "follow";
}

export const LIVE_ASTROLOGERS: LiveAstrologer[] = [
  { name: "Astro Deepak Ji",  specialties: "Vedic, Vastu, Pooja, Kundali", image: "/images/v2/live-astrologer-1.png", badge: "live" },
  { name: "Anto Thomas",      specialties: "Vedic, Vastu, Pooja, Kundali", image: "/images/v2/live-astrologer-2.png", badge: "follow" },
  { name: "Pulkit Jhakahar",  specialties: "Vedic, Vastu, Pooja, Kundali", image: "/images/v2/live-astrologer-3.png", badge: "live" },
  { name: "Aditya Roy",       specialties: "Vedic, Vastu, Pooja, Kundali", image: "/images/v2/live-astrologer-4.png", badge: "follow" },
  { name: "Rahul Sharma",     specialties: "Numerology, Tarot, Palmistry",  image: "/images/v2/live-astrologer-5.png", badge: "live" },
  { name: "Priya Verma",      specialties: "Vedic, Horoscope, Kundali",     image: "/images/v2/live-astrologer-1.png", badge: "follow" },
  { name: "Suresh Nair",      specialties: "Vastu, Pooja, Numerology",      image: "/images/v2/live-astrologer-2.png", badge: "live" },
  { name: "Deepak Joshi",     specialties: "Tarot, Palmistry, Vedic",       image: "/images/v2/live-astrologer-3.png", badge: "follow" },
  { name: "Meera Iyer",       specialties: "Horoscope, Kundali, Vastu",     image: "/images/v2/live-astrologer-4.png", badge: "live" },
  { name: "Vikram Singh",     specialties: "Vedic, Numerology, Pooja",      image: "/images/v2/live-astrologer-5.png", badge: "follow" },
];

// ── Blog posts (fallback/mock data) ───────────────────────────
export interface BlogPost {
  title: string;
  category: string;
  date: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How Astroguruji Is Using AI to Become a Smarter, More Trusted",
    category: "Astromall",
    date: "26/11/2025",
    image: "/images/v2/blog-1.png",
  },
  {
    title: "Astrologers ka ghinona sach- Hinduism Secrets, Ancient Mysteries, Secrets",
    category: "Astromall",
    date: "26/11/2025",
    image: "/images/v2/blog-2.png",
  },
  {
    title: "Hiring Astrologers for Your App: The Future of Digital Astrology Services",
    category: "Astromall",
    date: "26/11/2025",
    image: "/images/v2/blog-3.png",
  },
  {
    title: "KP Astrology Mega Bundle - Vedic Astrogurujii",
    category: "Astromall",
    date: "26/11/2025",
    image: "/images/v2/blog-4.png",
  },
  {
    title: "Celebrity Astrologer on Changing your LIFE : 12 Houses, 9 Planets.",
    category: "Astromall",
    date: "26/11/2025",
    image: "/images/v2/blog-5.png",
  },
];

// ── Stats banner ──────────────────────────────────────────────
export const STATS = [
  { value: "50k+",  label: "Session done" },
  { value: "15k+",  label: "Verified Astrologer" },
  { value: "5000+", label: "Yr of Experience" },
];

// ── Testimonials (fallback/mock data) ─────────────────────────
export interface Testimonial {
  name: string;
  text: string;
  date: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Anshul Jangid",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: "2024-01-15",
    avatar: "/images/v2/user-avatar-1.png",
  },
  {
    name: "Priya Sharma",
    text: "Amazing experience with Astrogurujii! The astrologer was very knowledgeable and gave me accurate predictions about my career and personal life.",
    date: "2024-02-10",
    avatar: "/images/v2/user-avatar-2.png",
  },
  {
    name: "Rahul Mehta",
    text: "I was skeptical at first but the reading was surprisingly accurate. Will definitely consult again for important life decisions.",
    date: "2024-03-05",
    avatar: "/images/v2/user-avatar-3.png",
  },
  {
    name: "Sunita Rao",
    text: "The kundali analysis was very detailed and helpful. Got clarity on my marriage prospects and family matters.",
    date: "2024-03-20",
    avatar: "/images/v2/user-avatar-1.png",
  },
  {
    name: "Vikash Kumar",
    text: "Best astrology app I have used so far. The astrologers are genuine and the predictions are accurate.",
    date: "2024-04-01",
    avatar: "/images/v2/user-avatar-2.png",
  },
];

// ── FAQ ───────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does online astrology consultation work?",
    answer:
      "You can connect with our verified astrologers via chat or voice call. Simply choose an astrologer, add wallet balance, and start your session instantly.",
  },
  {
    question: "Are the astrologers on AstroGurujii verified?",
    answer:
      "Yes, all astrologers on our platform go through a strict verification process including background checks, skill assessments, and regular performance reviews.",
  },
  {
    question: "How much does a consultation cost?",
    answer:
      "Consultation charges vary by astrologer and are displayed per minute on their profile. You can choose any astrologer based on your budget.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use industry-standard encryption to protect your data. Your personal information is never shared with third parties.",
  },
  {
    question: "Can I get a free consultation?",
    answer:
      "New users get special introductory offers. Check our promotions section for current free or discounted consultation offers.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major payment methods including UPI, credit/debit cards, net banking, and popular wallets like Paytm and PhonePe.",
  },
];

// ── Consultant tabs (used by FilterBar.tsx) ───────────────────
// These are the category filter tabs on the consultant listing page
export const CONSULTANT_TABS = [
  "All",
  "Vedic",
  "Tarot",
  "Numerology",
  "Palmistry",
  "KP System",
  "Vastu",
  "Face Reading",
  "Prashna",
  "Psychic",
  "Nadi",
  "Western",
];

// ── Consultant sort options (used by FilterBar.tsx) ───────────
export const CONSULTANT_SORTS = [
  { label: "Relevance",         value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Experience",        value: "experience" },
  { label: "Rating",            value: "rating" },
  { label: "Orders",            value: "orders" },
];

// ── Language filter options ───────────────────────────────────
export const CONSULTANT_LANGUAGES = [
  "All",
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Kannada",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Malayalam",
  "Punjabi",
];