import React from "react";
import StarYellowIcon from "@/assets/icons/star-yellow.svg";

const MainAstrologerProfile = () => {
  return (
    <section className="w-full bg-[#FFFBF0] py-16 px-4 font-euclid">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side: Astrologer Image & Quick Stats */}
        <div className="w-full md:w-5/12 flex flex-col items-center">
          <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full p-2 bg-gradient-to-tr from-[#FFD15B] to-[#FF9800]">
            <img
              src="/images/v2/astrologer-circle.png" // Replace with the actual main astrologer image path
              alt="Main Astrologer"
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
            />
            {/* Rating Badge */}
            <div className="absolute bottom-6 right-2 bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <img src={StarYellowIcon} alt="Star" className="w-5 h-5" />
              <span className="font-bold text-gray-800">4.95</span>
            </div>
          </div>
          
          <div className="flex gap-6 mt-8 w-full justify-center">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800">15+</h4>
              <p className="text-sm text-gray-500">Years Exp.</p>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800">50K+</h4>
              <p className="text-sm text-gray-500">Consultations</p>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800">100%</h4>
              <p className="text-sm text-gray-500">Privacy</p>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Content */}
        <div className="w-full md:w-7/12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              Astro Guruji
            </h2>
            {/* ✅ FIXED: Accessing verified.svg directly from the public folder */}
            <img src="/images/verified.svg" alt="Verified" className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          
          <h3 className="text-lg md:text-xl font-medium text-[#FF9800] mb-6">
            Vedic Astrology • Tarot Card Reading • Numerology
          </h3>
          
          <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
            <p>
              Welcome to my profile. With over 15 years of deep expertise in Vedic Astrology, Tarot Reading, and Vastu Shastra, I have helped thousands of individuals find clarity, peace, and direction in their lives. 
            </p>
            <p>
              My approach blends ancient astrological wisdom with practical, modern-day solutions. Whether you are facing challenges in your career, love life, marriage, or finances, I provide accurate readings and effective remedies to help you navigate through life's complexities.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[#FF9800] hover:bg-[#E68A00] transition-colors text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V20C22 20.5523 21.5523 21 21 21C10.5066 21 2 12.4934 2 2C2 1.44772 2.44772 1 3 1H6.08C6.58 1 7.03 1.37 7.14 1.86L7.85 5.09C7.94 5.5 7.82 5.92 7.53 6.21L5.67 8.07C7.39 11.08 9.92 13.61 12.93 15.33L14.79 13.47C15.08 13.18 15.5 13.06 15.91 13.15L19.14 13.86C19.63 13.97 20 14.42 20 14.92V16.92Z" fill="currentColor"/>
              </svg>
              Call for ₹15/min
            </button>
            
            <button className="bg-white border-2 border-[#FF9800] text-[#FF9800] hover:bg-orange-50 transition-colors font-semibold py-3 px-8 rounded-full shadow-sm flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
              </svg>
              Chat for ₹10/min
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MainAstrologerProfile;