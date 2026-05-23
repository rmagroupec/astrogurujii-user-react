// Homepage data — extracted from Figma design (file: 5wTCK6j7p1lnfUgGeAMHMS, node: 2007:2419)

export const NAV_LINKS = [
  "Horoscope",
  "Panchang",
 
  "Live Astrologer",
  "Chat With Astrolger",
  "Call With Astrolger",
  "Our Blog"
];

export const HERO_STATS = [
  { value: "42,066+", label: "Best Astrologers", color: "#ff6f00" },
  { value: "84.0 Million", label: "Done Consultant", color: "#ff6f00" },
  { value: "300+ Colobs", label: "Lorem ipsum Here Content", color: "#d41000" },
  {
    value: "1207+ Million Minutes",
    label: "Lorem ipsum Here Content",
    color: "#d41000",
  },
];

export const SERVICE_PILLS = [
  { label: "Chat to Astrologer", icon: "chat", color: "#ff81ca", link:"/chat-with-astrolger" },
  { label: "Talk to Astrologer", icon: "talk", color: "#34cfb6", link:"/call-with-astrolger" },
  { label: "Astro Mall", icon: "mall", color: "#67a9ff", link:"#" },
  { label: "Book A Pooja", icon: "pooja", color: "#34a853", link:"#" },
];

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
      link: "#"
    },
    {
      title: "Free Kundali",
      description:
        "Generate your free Kundali instantly with complete birth chart analysis, dosha details, and future predictions.",
      link: "/free_kundli"
    },
    {
      title: "Today's Horoscope",
      description:
        "Check your daily horoscope for accurate predictions on love, career, health, and finances.",
      link: "/horoscope"   
    },
    {
      title: "Today Panchang",
      description:
        "Get today's Panchang details including tithi, nakshatra, yoga, and auspicious timings for important activities.",
      link: "/panchang"
    },
    {
      title: "Vastu Shastra",
      description:
        "Improve your home and workplace energy with expert Vastu tips for success, prosperity, and peace.",
      link: "/vastu"
    },
    {
      title: "Numerology",
      description:
        "Discover the power of numbers in your life with personalized numerology predictions and guidance.",
      link: "/numerology"
    },
    {
      title: "Tarot Reading",
      description:
        "Get intuitive tarot card readings to uncover answers about love, career, and life decisions.",
      link: "/tarot-reading"
    },
  ];

export const CONSULTANT_TABS = [
  "Kundali",
  "Horoscope",
  "Panchang",
  "Compatibility",
];

export interface Consultant {
  id: number;
  name: string;
  specialty: string;
  rating: string;
  reviews: number;
  experience: string;
  location: string;
  price: number;
  originalPrice: number;
  image: string;
  online: boolean;
  group: (typeof CONSULTANT_TABS)[number];
}
export const mapAstrologerData = (apiData: any[]) => {
  return apiData.map((item) => ({
    id: item.id,
    name: item.name,
    profile_img: item.profile_img,
 
    // Pricing
    price: item.per_min_chat || 0,
    originalPrice: item.per_min_chat_offer
      ? parseFloat(item.per_min_chat_offer)
      : item.per_min_chat + 10,
 
    // Pass raw pricing fields through for ConsultantCard
    per_min_chat: item.per_min_chat || 0,
    per_min_chat_offer: item.per_min_chat_offer || "",
    per_min_voice_call: item.per_min_voice_call || 0,
    per_min_voice_call_offer: item.per_min_voice_call_offer || "",
 
    // Specialty (join categories)
    specialty: item.category
      ?.map((c: any) => c.name.trim())
      .slice(0, 3)
      .join(", "),
 
    // Location
    location: "India",
 
    // Rating
    rating: item.avg_rate || 0,
    reviews: item.consult || 0,
 
    // Experience
    experience: `${item.experience} Years`,
 
    // ✅ FIXED: correct field names from API (isChatOnline not is_chat_online)
    isChatOnline: item.isChatOnline || "off",
    isVoiceOnline: item.isVoiceOnline || "off",
    isVideoOnline: item.isVideoOnline || "off",
    is_busy: item.is_busy ?? 0,
    is_Follow: item.is_Follow || "no",
    watting_time: item.watting_time || 0,
 
    // online boolean for backward compat — derived from correct fields
    online:
      (item.isChatOnline === "on" || item.isVoiceOnline === "on") &&
      item.is_busy === 0,
  }));
};
 


export const CONSULTANTS: Consultant[] = [
  // ── Kundali (10 consultants) ──
  {
    id: 1,
    name: "Anurag Kashyap",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-1.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 2,
    name: "Durgesh Meena",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-2.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 3,
    name: "Ramesh Meena",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-5.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 4,
    name: "Yogesh Nai",
    specialty: "Vedic Astrology | Prashna",
    rating: "4.8",
    reviews: 5,
    experience: "3 Years",
    location: "Jaipur | Rajasthan",
    price: 15,
    originalPrice: 28,
    image: "/images/v2/consultant-8.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 5,
    name: "Lovkesh Jangid",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-3.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 6,
    name: "Shakti Singh",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-6.png",
    online: false,
    group: "Kundali",
  },
  {
    id: 7,
    name: "Durgesh Meena",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-9.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 8,
    name: "Harikesh Yadav",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-11.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 9,
    name: "Umesh Padiwal",
    specialty: "Vedic Astrology | Prashna",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-4.png",
    online: true,
    group: "Kundali",
  },
  {
    id: 10,
    name: "Vickey Rajput",
    specialty: "Vedic Astrology | Prashna",
    rating: "4.9",
    reviews: 7,
    experience: "2 Years",
    location: "Jaipur | Rajasthan",
    price: 14,
    originalPrice: 25,
    image: "/images/v2/consultant-7.png",
    online: true,
    group: "Kundali",
  },

  // ── Horoscope (9 consultants) ──
  {
    id: 11,
    name: "Naresh Choudhary",
    specialty: "Horoscope Reading | Nadi",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-10.png",
    online: true,
    group: "Horoscope",
  },
  {
    id: 12,
    name: "Umang Dhaiyya",
    specialty: "Horoscope Reading | Nadi",
    rating: "5.0",
    reviews: 3,
    experience: "1 Year",
    location: "Jaipur | Rajasthan",
    price: 12,
    originalPrice: 23,
    image: "/images/v2/consultant-12.png",
    online: true,
    group: "Horoscope",
  },
  {
    id: 13,
    name: "Priya Sharma",
    specialty: "Horoscope Reading | KP System",
    rating: "4.7",
    reviews: 12,
    experience: "4 Years",
    location: "Delhi | NCR",
    price: 18,
    originalPrice: 30,
    image: "/images/v2/consultant-1.png",
    online: true,
    group: "Horoscope",
  },
  {
    id: 14,
    name: "Anil Verma",
    specialty: "Horoscope Reading | Vedic",
    rating: "4.6",
    reviews: 8,
    experience: "5 Years",
    location: "Mumbai | Maharashtra",
    price: 20,
    originalPrice: 35,
    image: "/images/v2/consultant-2.png",
    online: false,
    group: "Horoscope",
  },
  {
    id: 15,
    name: "Kavita Joshi",
    specialty: "Horoscope Reading | Nadi",
    rating: "4.9",
    reviews: 15,
    experience: "6 Years",
    location: "Udaipur | Rajasthan",
    price: 22,
    originalPrice: 38,
    image: "/images/v2/consultant-3.png",
    online: true,
    group: "Horoscope",
  },
  {
    id: 16,
    name: "Suresh Patel",
    specialty: "Horoscope Reading | KP System",
    rating: "4.5",
    reviews: 6,
    experience: "3 Years",
    location: "Ahmedabad | Gujarat",
    price: 15,
    originalPrice: 27,
    image: "/images/v2/consultant-4.png",
    online: true,
    group: "Horoscope",
  },
  {
    id: 17,
    name: "Deepak Rathore",
    specialty: "Horoscope Reading | Vedic",
    rating: "4.8",
    reviews: 10,
    experience: "7 Years",
    location: "Jodhpur | Rajasthan",
    price: 25,
    originalPrice: 40,
    image: "/images/v2/consultant-5.png",
    online: true,
    group: "Horoscope",
  },
  {
    id: 18,
    name: "Meena Kumari",
    specialty: "Horoscope Reading | Nadi",
    rating: "4.4",
    reviews: 4,
    experience: "2 Years",
    location: "Lucknow | UP",
    price: 10,
    originalPrice: 20,
    image: "/images/v2/consultant-6.png",
    online: false,
    group: "Horoscope",
  },
  {
    id: 19,
    name: "Rajendra Prasad",
    specialty: "Horoscope Reading | Vedic",
    rating: "5.0",
    reviews: 20,
    experience: "10 Years",
    location: "Varanasi | UP",
    price: 30,
    originalPrice: 50,
    image: "/images/v2/consultant-7.png",
    online: true,
    group: "Horoscope",
  },

  // ── Panchang (9 consultants) ──
  {
    id: 20,
    name: "Gopal Krishna",
    specialty: "Panchang | Muhurat",
    rating: "5.0",
    reviews: 18,
    experience: "8 Years",
    location: "Haridwar | Uttarakhand",
    price: 28,
    originalPrice: 45,
    image: "/images/v2/consultant-8.png",
    online: true,
    group: "Panchang",
  },
  {
    id: 21,
    name: "Neeraj Sharma",
    specialty: "Panchang | Tithi Analysis",
    rating: "4.6",
    reviews: 9,
    experience: "4 Years",
    location: "Jaipur | Rajasthan",
    price: 16,
    originalPrice: 28,
    image: "/images/v2/consultant-9.png",
    online: true,
    group: "Panchang",
  },
  {
    id: 22,
    name: "Sunita Devi",
    specialty: "Panchang | Muhurat",
    rating: "4.8",
    reviews: 11,
    experience: "5 Years",
    location: "Patna | Bihar",
    price: 14,
    originalPrice: 25,
    image: "/images/v2/consultant-10.png",
    online: false,
    group: "Panchang",
  },
  {
    id: 23,
    name: "Mahesh Trivedi",
    specialty: "Panchang | Tithi Analysis",
    rating: "4.9",
    reviews: 22,
    experience: "12 Years",
    location: "Ujjain | MP",
    price: 35,
    originalPrice: 55,
    image: "/images/v2/consultant-11.png",
    online: true,
    group: "Panchang",
  },
  {
    id: 24,
    name: "Ravi Shankar",
    specialty: "Panchang | Muhurat",
    rating: "4.7",
    reviews: 6,
    experience: "3 Years",
    location: "Kashi | UP",
    price: 13,
    originalPrice: 22,
    image: "/images/v2/consultant-12.png",
    online: true,
    group: "Panchang",
  },
  {
    id: 25,
    name: "Manish Tiwari",
    specialty: "Panchang | Nakshatra",
    rating: "4.5",
    reviews: 5,
    experience: "2 Years",
    location: "Bhopal | MP",
    price: 11,
    originalPrice: 20,
    image: "/images/v2/consultant-1.png",
    online: true,
    group: "Panchang",
  },
  {
    id: 26,
    name: "Poonam Gupta",
    specialty: "Panchang | Muhurat",
    rating: "4.8",
    reviews: 14,
    experience: "6 Years",
    location: "Allahabad | UP",
    price: 20,
    originalPrice: 35,
    image: "/images/v2/consultant-2.png",
    online: true,
    group: "Panchang",
  },
  {
    id: 27,
    name: "Dinesh Bhatt",
    specialty: "Panchang | Tithi Analysis",
    rating: "4.3",
    reviews: 2,
    experience: "1 Year",
    location: "Rishikesh | Uttarakhand",
    price: 10,
    originalPrice: 18,
    image: "/images/v2/consultant-3.png",
    online: false,
    group: "Panchang",
  },
  {
    id: 28,
    name: "Vijay Pandey",
    specialty: "Panchang | Nakshatra",
    rating: "4.6",
    reviews: 7,
    experience: "4 Years",
    location: "Indore | MP",
    price: 17,
    originalPrice: 30,
    image: "/images/v2/consultant-4.png",
    online: true,
    group: "Panchang",
  },

  // ── Compatibility (8 consultants) ──
  {
    id: 29,
    name: "Sanjay Mishra",
    specialty: "Compatibility | Kundali Milan",
    rating: "5.0",
    reviews: 25,
    experience: "10 Years",
    location: "Varanasi | UP",
    price: 30,
    originalPrice: 50,
    image: "/images/v2/consultant-5.png",
    online: true,
    group: "Compatibility",
  },
  {
    id: 30,
    name: "Rekha Agarwal",
    specialty: "Compatibility | Gun Milan",
    rating: "4.9",
    reviews: 19,
    experience: "8 Years",
    location: "Agra | UP",
    price: 25,
    originalPrice: 42,
    image: "/images/v2/consultant-6.png",
    online: true,
    group: "Compatibility",
  },
  {
    id: 31,
    name: "Ashok Kumar",
    specialty: "Compatibility | Kundali Milan",
    rating: "4.7",
    reviews: 10,
    experience: "5 Years",
    location: "Jaipur | Rajasthan",
    price: 18,
    originalPrice: 32,
    image: "/images/v2/consultant-7.png",
    online: false,
    group: "Compatibility",
  },
  {
    id: 32,
    name: "Geeta Rani",
    specialty: "Compatibility | Gun Milan",
    rating: "4.6",
    reviews: 8,
    experience: "4 Years",
    location: "Chandigarh | Punjab",
    price: 16,
    originalPrice: 28,
    image: "/images/v2/consultant-8.png",
    online: true,
    group: "Compatibility",
  },
  {
    id: 33,
    name: "Prakash Jha",
    specialty: "Compatibility | Kundali Milan",
    rating: "4.8",
    reviews: 13,
    experience: "6 Years",
    location: "Ranchi | Jharkhand",
    price: 22,
    originalPrice: 38,
    image: "/images/v2/consultant-9.png",
    online: true,
    group: "Compatibility",
  },
  {
    id: 34,
    name: "Anjali Dubey",
    specialty: "Compatibility | Gun Milan",
    rating: "4.5",
    reviews: 4,
    experience: "2 Years",
    location: "Pune | Maharashtra",
    price: 12,
    originalPrice: 22,
    image: "/images/v2/consultant-10.png",
    online: true,
    group: "Compatibility",
  },
  {
    id: 35,
    name: "Mohan Lal",
    specialty: "Compatibility | Kundali Milan",
    rating: "5.0",
    reviews: 30,
    experience: "15 Years",
    location: "Mathura | UP",
    price: 35,
    originalPrice: 55,
    image: "/images/v2/consultant-11.png",
    online: true,
    group: "Compatibility",
  },
  {
    id: 36,
    name: "Kiran Bala",
    specialty: "Compatibility | Gun Milan",
    rating: "4.4",
    reviews: 3,
    experience: "1 Year",
    location: "Dehradun | Uttarakhand",
    price: 10,
    originalPrice: 18,
    image: "/images/v2/consultant-12.png",
    online: false,
    group: "Compatibility",
  },
];

export interface LiveAstrologer {
  name: string;
  specialties: string;
  image: string;
  badge: "live" | "follow";
}

export const LIVE_ASTROLOGERS: LiveAstrologer[] = [
  {
    name: "Ankush Meena",
    specialties: "Vedic, Vastu, Pooja, Kundali",
    image: "/images/v2/live-astrologer-1.png",
    badge: "live",
  },
  {
    name: "Anto Thomas",
    specialties: "Vedic, Vastu, Pooja, Kundali",
    image: "/images/v2/live-astrologer-2.png",
    badge: "follow",
  },
  {
    name: "Pulkit Jhakahar",
    specialties: "Vedic, Vastu, Pooja, Kundali",
    image: "/images/v2/live-astrologer-3.png",
    badge: "live",
  },
  {
    name: "Aditya Roy",
    specialties: "Vedic, Vastu, Pooja, Kundali",
    image: "/images/v2/live-astrologer-4.png",
    badge: "follow",
  },
  {
    name: "Rahul Sharma",
    specialties: "Numerology, Tarot, Palmistry",
    image: "/images/v2/live-astrologer-5.png",
    badge: "live",
  },
  {
    name: "Priya Verma",
    specialties: "Vedic, Horoscope, Kundali",
    image: "/images/v2/live-astrologer-1.png",
    badge: "follow",
  },
  {
    name: "Suresh Nair",
    specialties: "Vastu, Pooja, Numerology",
    image: "/images/v2/live-astrologer-2.png",
    badge: "live",
  },
  {
    name: "Deepak Joshi",
    specialties: "Tarot, Palmistry, Vedic",
    image: "/images/v2/live-astrologer-3.png",
    badge: "follow",
  },
  {
    name: "Meera Iyer",
    specialties: "Horoscope, Kundali, Vastu",
    image: "/images/v2/live-astrologer-4.png",
    badge: "live",
  },
  {
    name: "Vikram Singh",
    specialties: "Vedic, Numerology, Pooja",
    image: "/images/v2/live-astrologer-5.png",
    badge: "follow",
  },
];

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
    title:
      "Astrologers ka ghinona sach- Hinduism Secrets, Ancient Mysteries, Secrets",
    category: "Astromall",
    date: "26/11/2025",
    image: "/images/v2/blog-2.png",
  },
  {
    title:
      "Hiring Astrologers for Your App: The Future of Digital Astrology Services",
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

export const STATS = [
  { value: "50k+", label: "Session done" },
  { value: "15k+", label: "Verified Astrologer" },
  { value: "5000+", label: "Yr of Experience" },
];

export interface Testimonial {
  name: string;
  text: string;
  date: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Anshul Jangid",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of ...",
    date: "2025-05-08",
    avatar: "/images/v2/testimonial-avatar-1.png",
  },
  {
    name: "Anshul Jangid",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of ...",
    date: "2025-05-08",
    avatar: "/images/v2/testimonial-avatar-1.png",
  },
  {
    name: "Mahul Jain",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of ...",
    date: "2025-05-08",
    avatar: "/images/v2/testimonial-avatar-2.png",
  },
  {
    name: "Vindor Jarkhar",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of ...",
    date: "2025-05-08",
    avatar: "/images/v2/testimonial-avatar-3.png",
  },
  {
    name: "Anshul Jangid",
    text: '"An absolutely magical experience! The festival was filled with colors, music, and unforgettable memories. Everything felt beautifully planned with Fiestro."',
    date: "2025-05-08",
    avatar: "/images/v2/testimonial-avatar-4.png",
  },
];

export const FAQ_TABS = [
  "GENERAL",
  "ASTROLOGER",
  "ASTROMALL",
  "PAYMENTS & TRANSACTIONS",
  "PANCHANG",
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_LEFT: FaqItem[] = [
  {
    question: "Who can join ASTROGURJII ?",
    answer:
      "Anyone with genuine knowledge and experience in astrology and related spiritual sciences can join ASTROGURJII...",
  },
  {
    question: "Why should I choose ASTROGURJII over traditional methods ?",
    answer:
      "ASTROGURJII offers verified astrologers, instant consultations, and secure payments — all from the comfort of your home without waiting in long queues.",
  },
  {
    question: "Who can join ASTROGURJII ?",
    answer:
      "Certified astrologers, tarot readers, numerologists, and Vastu experts with verifiable credentials can register on the platform.",
  },
  {
    question: "Is there any registration fee for ASTROGURJII ?",
    answer:
      "No, registration on ASTROGURJII is completely free for both users and astrologers. You only pay for the consultations you book.",
  },
];

export const FAQ_RIGHT: FaqItem[] = [
  {
    question: "How can my user post a requirement ?",
    answer:
      "Users can post their requirements by navigating to the consultation section, selecting the relevant category, and submitting their query with details.",
  },
  {
    question: "What services can user find on ASTROGURJII ?",
    answer:
      "Users can access horoscope readings, Kundli matching, Panchang, Vastu consultation, tarot reading, numerology, and live astrologer chat or call services.",
  },
  {
    question: "How do I contact support ?",
    answer:
      "You can reach our support team via the Help section in the app, email us at support@astrogurjii.com, or call our helpline available 24/7.",
  },
  {
    question: "How does ASTROGURJII ensure user authenticity ?",
    answer:
      "All astrologers go through a rigorous verification process including ID verification, credential checks, and test consultations before being listed.",
  },
  {
    question: "How do Astrologer join the platform ?",
    answer:
      "Astrologers can apply through the 'Join as Astrologer' page, submit their credentials, and once verified by our team, they can start offering consultations.",
  },
];
