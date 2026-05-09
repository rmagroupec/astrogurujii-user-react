import vedicIcon from "@/assets/icons/specialties/vedic.svg";
import careerIcon from "@/assets/icons/specialties/career.svg";
import loveIcon from "@/assets/icons/specialties/love.svg";
import faceReadingIcon from "@/assets/icons/specialties/face-reading.svg";

export interface ConsultantDetailData {
  id: string;
  name: string;
  location: string;
  avatar: string;
  languages: string;
  rating: number;
  orders: string;
  experience: string;
  followers: string;
  avgTime: string;
  totalConsultations: string;
  chatPrice: number;
  chatOriginal: number;
  callPrice: number;
  callOriginal: number;
  verified: boolean;
  aboutParagraphs: string[];
}

export interface Specialty {
  label: string;
  color: string;
  bgLight: string;
  icon: string;
}

export interface RatingBar {
  stars: number;
  percent: number;
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

export const CONSULTANT_DETAIL: ConsultantDetailData = {
  id: "1",
  name: "Anurag Kashyap",
  location: "Jaipur | Rajasthan",
  avatar: "/images/v2/consultant-1.png",
  languages: "English / Hindi",
  rating: 5,
  orders: "50K+",
  experience: "15+",
  followers: "23K",
  avgTime: "4h",
  totalConsultations: "1050",
  chatPrice: 12,
  chatOriginal: 23,
  callPrice: 30,
  callOriginal: 38,
  verified: true,
  aboutParagraphs: [
    "Namaste! I am Gururaj, a certified Vedic Astrologer and Face Reader with over 15 years of divine experience. My journey into the mystic arts began at a young age, guided by the traditional Guru-Shishya parampara in Karnataka.",
    "I specialize in providing accurate predictions regarding Marriage, Career, and Financial stability. My approach is not just prediction, but finding a path forward through simple, effective remedies. I believe that while stars indicate the path, our karma drives the journey. Let me help you decode the cosmic signals.",
  ],
};

export const SPECIALTIES: Specialty[] = [
  { label: "Vedic", color: "#ff6f00", bgLight: "#fff5ee", icon: vedicIcon },
  { label: "Career", color: "#2196f3", bgLight: "#e3f2fd", icon: careerIcon },
  { label: "Love", color: "#e91e63", bgLight: "#fce4ec", icon: loveIcon },
  {
    label: "Face Reading",
    color: "#00bcd4",
    bgLight: "#e0f7fa",
    icon: faceReadingIcon,
  },
];

export const RATING_BARS: RatingBar[] = [
  { stars: 5, percent: 70 },
  { stars: 4, percent: 50 },
  { stars: 3, percent: 30 },
  { stars: 2, percent: 10 },
  { stars: 1, percent: 5 },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Vijay Jangid",
    avatar: "/images/gallery-image-i.png",
    date: "2 days ago",
    rating: 5,
    text: "I had a great learning experience at DataCube Softech Pvt. Ltd. After completing my course certification, I gained valuable knowledge and hands-on experience that helped me build a strong foundation. After completing my course certification, I gained valuable knowledge and hands-on experience...",
  },
  {
    id: 2,
    name: "Vijay Jangid",
    avatar: "/images/gallery-image-i.png",
    date: "2 days ago",
    rating: 5,
    text: "I had a great learning experience at DataCube Softech Pvt. Ltd. After completing my course certification, I gained valuable knowledge and hands-on experience that helped me build a strong foundation. After completing my course certification, I gained valuable knowledge and hands-on experience...",
  },
  {
    id: 3,
    name: "Vijay Jangid",
    avatar: "/images/gallery-image-i.png",
    date: "2 days ago",
    rating: 5,
    text: "I had a great learning experience at DataCube Softech Pvt. Ltd. After completing my course certification, I gained valuable knowledge and hands-on experience that helped me build a strong foundation. After completing my course certification, I gained valuable knowledge and hands-on experience...",
  },
  {
    id: 4,
    name: "Vijay Jangid",
    avatar: "/images/gallery-image-i.png",
    date: "2 days ago",
    rating: 5,
    text: "I had a great learning experience at DataCube Softech Pvt. Ltd. After completing my course certification, I gained valuable knowledge and hands-on experience that helped me build a strong foundation. After completing my course certification, I gained valuable knowledge and hands-on experience...",
  },
];

export const GALLERY_IMAGES = [
  { id: "gallery-1", src: "/images/gallery-image-i.png", overlay: false },
  { id: "gallery-2", src: "/images/gallery-image-ii.png", overlay: false },
  {
    id: "gallery-3",
    src: "/images/gallery-image-iii.png",
    overlay: true,
    count: "12+",
  },
];
