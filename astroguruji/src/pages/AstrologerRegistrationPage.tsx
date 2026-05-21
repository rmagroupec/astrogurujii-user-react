import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import MasterLoader from "@/components/v2/common/MasterLoader";

const API_BASE_URL = "https://admin.astrogurujii.com";

export default function AstrologerRegistration() {
  const navigate = useNavigate();
  
  // States
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [astroMsg, setAstroMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    qualification: "",
    experience: "",
  });

  // Check initial application status
  useEffect(() => {
    const checkAstroStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/user_api/astro_status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.status) {
          const status = res.data?.data?.status || res.data?.status_name;
          
          switch (status) {
            case "Request Sent":
              setAstroMsg("You have already requested for astrologer");
              break;
            case "Selected":
              setAstroMsg("Your request for astrologer is selected");
              break;
            case "Rejected":
              setAstroMsg("Your request for astrologer is rejected");
              break;
            case "Hold":
              setAstroMsg("Your request for astrologer is on Hold");
              break;
            default:
              setAstroMsg(null); // Show form
          }
        } else {
          setAstroMsg(null); // Show form
        }
      } catch (error) {
        console.error("Status check failed", error);
        setAstroMsg(null); // Show form if api fails
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkAstroStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorToast(null); // Clear errors on typing
  };

  const validateForm = () => {
    const { name, email, mobile, qualification, experience } = formData;
    
    if (!name.trim()) return "Enter your Name";
    if (name.trim().length < 3) return "Invalid Name (Too short)";
    
    if (!email.trim()) return "Enter your email";
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return "Enter a valid email";

    if (!mobile.trim()) return "Enter your mobile number";
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) return "Enter a valid 10-digit mobile number";

    if (!qualification.trim()) return "Enter your Qualification";
    if (!experience.trim()) return "Enter your Experience";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setErrorToast(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Payload matching your Flutter request exactly
      const payload = {
        name: formData.name.trim(),
        number: formData.mobile.trim(),
        email: formData.email.trim(),
        qulification: formData.qualification.trim(), // Spelled exactly like Flutter backend expects
        experience: formData.experience.trim(),
      };

      const res = await axios.post(`${API_BASE_URL}/user_api/register_astro`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status) {
        navigate("/thank-you"); // Route to your Thank you page
      } else {
        setErrorToast(res.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorToast("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) return <MasterLoader text="Checking Status..." />;

  return (
    <div className="min-h-screen bg-white font-euclid flex flex-col">
      <Navbar />
      
      {/* App Bar Equivalent */}
      <div className="w-full bg-[#FF9800] py-4 px-4 shadow-md">
        <h1 className="text-white text-xl font-semibold max-w-[1200px] mx-auto flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 transition-colors">
             {/* Back Icon */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
          Enquiry Astrologer
        </h1>
      </div>

      <div className="flex-grow w-full max-w-[600px] mx-auto px-5 py-8">
        
        {/* Status View */}
        {astroMsg ? (
          <div className="flex flex-col items-center justify-center h-[40vh]">
            <p className="text-xl font-medium text-gray-700 text-center px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
              {astroMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Form View */}
            
            {/* Error Message Display */}
            {errorToast && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{errorToast}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-gray-500">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name Here"
                maxLength={27}
                className="w-full bg-[#FDF7F7] border border-[#FDF7F7] shadow-sm rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-gray-500">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email ID"
                className="w-full bg-[#FDF7F7] border border-[#FDF7F7] shadow-sm rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Phone Number Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-gray-500">Phone Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter Your Phone Number"
                maxLength={10}
                className="w-full bg-[#FDF7F7] border border-[#FDF7F7] shadow-sm rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Qualification Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-gray-500">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter Your Qualification"
                className="w-full bg-[#FDF7F7] border border-[#FDF7F7] shadow-sm rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Experience Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-gray-500">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter Your Experience"
                className="w-full bg-[#FDF7F7] border border-[#FDF7F7] shadow-sm rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF9800] hover:bg-[#e68a00] transition-colors text-white text-[18px] font-bold py-3.5 rounded-lg shadow-md flex justify-center items-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}