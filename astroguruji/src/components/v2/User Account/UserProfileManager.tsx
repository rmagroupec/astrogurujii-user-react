import { useEffect, useState } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import axios from "axios";
import MainInput from "./component/MainInput";
import MainSelect from "./component/MainSelect";
import LocationInput from "./component/LocationInput";

export default function EditProfilePage() {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        number: "",
        dob: "",
        tob: "",
        pob: "",
        gender: "",
        rashi: "",
    });

    // ─── Get Profile (Flutter -> React) ───
    const getProfile = async () => {
        try {
            setLoading(true);

            const res = await axios.get("https://admin.astrogurujii.com/user_api/get_profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data.status) {
                const data = res.data.results_web || res.data.results;

                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    number: data.number || "",
                    dob: formatDateForInput(data.dob),
                    tob: formatTimeForInput(data.tob),
                    pob: data.pob || "",
                    gender: data.gender || "",
                    rashi: data.rashi || "",
                  });
            }
        } catch (e) {
            alert("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };
    const formatDateForInput = (dob: string) => {
  if (!dob) return "";
  const [day, month, year] = dob.split("/");
  return `${year}-${month}-${day}`;
};

const formatTimeForInput = (time: string) => {
  if (!time) return "";
  const [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = String(parseInt(hours) + 12);
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
};

    useEffect(() => {
        getProfile();
    }, []);

    // ─── Update Profile ───
    const updateProfile = async () => {
        const nameValid = /^[A-Za-z\s]+$/.test(form.name);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      
        if (!nameValid) return alert("Enter valid Name");
        if (!emailValid) return alert("Enter valid Email");
      
        try {
          setLoading(true);
      
          const res = await axios.put(
            "https://admin.astrogurujii.com/user_api/profile_update",
            {
              name: form.name,
              dob: form.dob,
              gender: form.gender,
              pob: form.pob,
              tob: form.tob,
              email: form.email,
              rashi: form.rashi,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
      
          if (res.data.status) {
            // ✅ update localStorage
            localStorage.setItem("name", form.name);
            localStorage.setItem("email", form.email);
      
            alert(res.data.message);
      
            getProfile();
          } else {
            alert(res.data.message);
          }
        } catch (e) {
          alert("Update failed");
        } finally {
          setLoading(false);
        }
      };

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-[#FFFDF9]">
            <Navbar />

            <BreadcrumbHeader
                title="Edit Profile"
                highlight="Astrogurujii"
                description="Update your personal and astrological details."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Profile" },
                ]}
            />

            <div className="mx-auto max-w-[800px] px-4 py-10">
                <div className="rounded-2xl border border-[#F0E8DF] bg-white p-6 shadow-sm space-y-5">

                    {/* Name */}
                    <MainInput label="Full Name" value={form.name} onChange={(v: string) => handleChange("name", v)} />

                    {/* Email */}
                    <MainInput label="Email" value={form.email} onChange={(v: string) => handleChange("email", v)} />

                    {/* Mobile */}
                    <MainInput label="Mobile Number" value={form.number} disabled />

                    {/* DOB */}
                    <MainInput label="Date of Birth" type="date" value={form.dob} onChange={(v: string) => handleChange("dob", v)} />

                    {/* TOB */}
                    <MainInput label="Time of Birth" type="time" value={form.tob} onChange={(v: string) => handleChange("tob", v)} />

                    {/* POB */}
                    <LocationInput
                        label="Place of Birth"
                        value={form.pob}
                        onChange={(v: string) => handleChange("pob", v)}
                        />

                    {/* Gender */}
                    <MainSelect
                        label="Gender"
                        value={form.gender}
                        options={["Male", "Female", "Other"]}
                        onChange={(v: string) => handleChange("gender", v)}
                    />

                    {/* Rashi */}
                    {/* <MainInput label="Rashi" value={form.rashi} onChange={(v: string) => handleChange("rashi", v)} /> */}

                    {/* Button */}
                    <button
  onClick={updateProfile}
  className="w-full rounded-full bg-brand-orange py-3 text-white font-semibold flex items-center justify-center gap-2"
>
  {loading && (
    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  {loading ? "Updating..." : "Update Profile"}
</button>
                </div>
            </div>

            <Footer />
        </div>
    );
}