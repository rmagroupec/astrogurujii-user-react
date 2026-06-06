import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";
import axios from "axios";
import MainInput from "./component/MainInput";
import MainSelect from "./component/MainSelect";
import LocationInput from "./component/LocationInput";

const API_BASE = "https://admin.astrogurujii.com";

// ─── Toast ────────────────────────────────────────────────────
type ToastType = "success" | "error";
type Toast = { id: number; message: string; type: ToastType };
let _toastId = 0;

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${t.type === "success" ? "bg-green-500" : "bg-red-500"} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-xs pointer-events-auto`}
          style={{ animation: "slideIn .25s ease" }}
        >
          <span className="font-bold flex-shrink-0">{t.type === "success" ? "✓" : "✕"}</span>
          <span className="text-sm flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-white/70 hover:text-white ml-1">×</button>
        </div>
      ))}
      <style>{`@keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = ++_toastId;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, show, remove };
}

const authToken = () => localStorage.getItem("token") ?? "";

function resolveImg(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  return `${API_BASE}/${raw.replace(/^\/+/, "")}`;
}

// Handle both "yyyy-MM-dd" and "dd/MM/yyyy" from server
function formatDateForInput(dob: string): string {
  if (!dob) return "";
  const clean = dob.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  if (clean.includes("/")) {
    const parts = clean.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (year?.length === 4) return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return "";
}

function formatTimeForInput(time: string): string {
  if (!time) return "";
  const clean = time.trim();
  if (/^\d{2}:\d{2}$/.test(clean)) return clean;
  const [t, modifier] = clean.split(" ");
  if (!t || !modifier) return clean;
  let [hours, minutes] = t.split(":");
  if (modifier === "PM" && hours !== "12") hours = String(parseInt(hours) + 12);
  if (modifier === "AM" && hours === "12") hours = "00";
  return `${hours.padStart(2, "0")}:${minutes}`;
}

// ─── Component ───────────────────────────────────────────────
export default function EditProfilePage() {
  const { toasts, show: showToast, remove } = useToast();
  const [loading, setLoading]               = useState(false);
  const [photoLoading, setPhotoLoading]     = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile]       = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", email: "", number: "",
    dob: "", tob: "", pob: "", gender: "", rashi: "",
  });

  // ─── Load profile ─────────────────────────────────────────
  const getProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user_api/get_profile`, {
        headers: { Authorization: `Bearer ${authToken()}` },
      });
      if (res.data.status) {
        const d = res.data.results_web || res.data.results;
        setForm({
          name:   d.name   || "",
          email:  d.email  || "",
          number: d.number || "",
          dob:    formatDateForInput(d.dob),
          tob:    formatTimeForInput(d.tob),
          pob:    d.pob    || "",
          gender: d.gender || "",
          rashi:  d.rashi  || "",
        });

        const rawImg = d.profile_img || d.profileImg || d.image || d.img || "";
        const resolved = resolveImg(rawImg);
        if (resolved) {
          setProfilePreview(`${resolved}?t=${Date.now()}`);
          localStorage.setItem("profile_img", resolved);
          window.dispatchEvent(new CustomEvent("profile-updated", { detail: { profile_img: resolved } }));
        }
      }
    } catch {
      showToast("Failed to load profile", "error");
    }
  };

  useEffect(() => { getProfile(); }, []);

  // ─── Photo pick ───────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Upload a valid image (JPG, PNG, WEBP)", "error"); return; }
    if (file.size > 5 * 1024 * 1024)    { showToast("Image must be under 5 MB", "error"); return; }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // ─── Upload photo ─────────────────────────────────────────
  // Mirrors Flutter exactly:
  //   POST /user_api/profile_update_img
  //   multipart/form-data  { profile_img: <file> }
  const uploadPhoto = async () => {
    if (!profileFile) return;
    setPhotoLoading(true);
    try {
      const fd = new FormData();
      fd.append("profile_img", profileFile, profileFile.name); // ✅ key = "profile_img", value = file

      const res = await fetch(`${API_BASE}/user_api/profile_update_img`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken()}` },
        // ⚠️ Do NOT set Content-Type — browser sets it with boundary automatically
        body: fd,
      });
      const data = await res.json();

      console.log("[profile_update_img] response:", JSON.stringify(data));

      if (!data?.status) {
        showToast(data?.message || "Photo update failed", "error");
        return;
      }

      // Extract new image URL from response
      const newImgRaw =
        data?.results?.profile_img ||
        data?.results?.image       ||
        data?.results?.img         ||
        data?.results              || // sometimes just a URL string
        "";

      const newImgUrl = typeof newImgRaw === "string"
        ? resolveImg(newImgRaw)
        : resolveImg(String(newImgRaw));

      // Update localStorage + Navbar instantly
      if (newImgUrl) {
        localStorage.setItem("profile_img", newImgUrl);
        window.dispatchEvent(new CustomEvent("profile-updated", { detail: { profile_img: newImgUrl } }));
        setProfilePreview(`${newImgUrl}?t=${Date.now()}`);
      }

      setProfileFile(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
      showToast("Profile photo updated!", "success");

      // Re-fetch from server after short delay to confirm
      setTimeout(getProfile, 1500);

    } catch (err) {
      console.error("[profile_update_img error]", err);
      showToast("Upload failed. Check your connection.", "error");
    } finally {
      setPhotoLoading(false);
    }
  };

  // ─── Update profile fields ────────────────────────────────
  const updateProfile = async () => {
    if (!/^[A-Za-z\s]+$/.test(form.name))               { showToast("Enter a valid Name", "error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { showToast("Enter a valid Email", "error"); return; }
    try {
      setLoading(true);
      const res = await axios.put(
        `${API_BASE}/user_api/profile_update`,
        { name: form.name, dob: form.dob, gender: form.gender, pob: form.pob, tob: form.tob, email: form.email, rashi: form.rashi },
        { headers: { Authorization: `Bearer ${authToken()}` } }
      );
      if (res.data.status) {
        localStorage.setItem("name", form.name);
        localStorage.setItem("email", form.email);
        window.dispatchEvent(new CustomEvent("profile-updated", { detail: { name: form.name } }));
        showToast(res.data.message || "Profile updated!", "success");
        getProfile();
      } else {
        showToast(res.data.message || "Update failed", "error");
      }
    } catch {
      showToast("Update failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const initials = (form.name || "U")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <ToastContainer toasts={toasts} onRemove={remove} />
      <Navbar />

      <BreadcrumbHeader
        title="Edit Profile"
        highlight="Astrogurujii"
        description="Update your personal and astrological details."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
      />

      <div className="mx-auto max-w-[800px] px-4 py-10">
        <div className="rounded-2xl border border-[#F0E8DF] bg-white p-6 shadow-sm space-y-6">

          {/* ── Profile Photo ── */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-[#F0E8DF]">

            <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FF6F00]/25 shadow-md">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FF6F00] to-[#FF9A3C] flex items-center justify-center text-white font-poppins font-bold text-2xl">
                    {initials}
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>

              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FF6F00] border-2 border-white flex items-center justify-center shadow-md pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div className="text-center">
              <p className="font-poppins text-[13px] font-semibold text-gray-800">{form.name || "Your Name"}</p>
              <p className="font-poppins text-[11px] text-gray-400 mt-0.5">JPG, PNG or WEBP · Max 5 MB</p>
            </div>

            {profileFile ? (
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="font-poppins text-[12px] text-green-600 font-medium truncate max-w-[160px]">✓ {profileFile.name}</span>
                <button
                  type="button"
                  onClick={uploadPhoto}
                  disabled={photoLoading}
                  className="flex items-center gap-1.5 bg-[#FF6F00] hover:bg-[#e56200] disabled:opacity-60 text-white font-poppins text-[12px] font-semibold px-4 py-1.5 rounded-full transition-colors"
                >
                  {photoLoading
                    ? <><span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading…</>
                    : <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Save Photo
                      </>
                  }
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileFile(null);
                    if (photoInputRef.current) photoInputRef.current.value = "";
                    getProfile();
                  }}
                  className="font-poppins text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                >Cancel</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-[#FF6F00]/40 text-[#FF6F00] font-poppins text-[12px] font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Change Photo
              </button>
            )}
          </div>

          {/* ── Form Fields ── */}
          <MainInput label="Full Name"     value={form.name}   onChange={(v: string) => handleChange("name", v)} />
          <MainInput label="Email"         value={form.email}  onChange={(v: string) => handleChange("email", v)} />
          <MainInput label="Mobile Number" value={form.number} disabled />
          <MainInput label="Date of Birth" type="date" value={form.dob} onChange={(v: string) => handleChange("dob", v)} />
          <MainInput label="Time of Birth" type="time" value={form.tob} onChange={(v: string) => handleChange("tob", v)} />
          <LocationInput label="Place of Birth" value={form.pob} onChange={(v: string) => handleChange("pob", v)} />
          <MainSelect label="Gender" value={form.gender} options={["Male", "Female", "Other"]} onChange={(v: string) => handleChange("gender", v)} />

          <button
            onClick={updateProfile}
            className="w-full rounded-full bg-brand-orange py-3 text-white font-semibold flex items-center justify-center gap-2"
          >
            {loading && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}