import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

const API_BASE_URL = "https://admin.astrogurujii.com";

// ── Section heading ───────────────────────────────────────────
function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 mt-6">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#FF6F00] text-white font-poppins text-[12px] font-bold flex-shrink-0">
        {number}
      </span>
      <h3 className="font-poppins text-[15px] font-semibold text-[#1a1a1a]">
        {title}
      </h3>
    </div>
  );
}

// ── Bullet item ───────────────────────────────────────────────
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 mb-2 pl-10">
      <span className="text-[#FF6F00] flex-shrink-0 font-bold">•</span>
      <span className="font-poppins text-[13px] text-[#575757] leading-relaxed">
        {children}
      </span>
    </div>
  );
}

// ── Body paragraph ────────────────────────────────────────────
function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-poppins text-[13px] text-[#575757] leading-relaxed pl-10 mb-2">
      {children}
    </p>
  );
}

// ── Divider ───────────────────────────────────────────────────
function Divider() {
  return <hr className="border-none border-t border-[#FFE8D6] my-4" />;
}

// ── Skeleton loader ───────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-orange-100 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}

// ── Static fallback content ───────────────────────────────────
function StaticPrivacyContent() {
  return (
    <div>
      <SectionTitle number="1" title="Information We Collect" />
      <Bullet>Mobile number and country code provided during login.</Bullet>
      <Bullet>Name, email, date of birth, birth time, and birth place after sign-up.</Bullet>
      <Bullet>Device FCM token for push notifications.</Bullet>
      <Bullet>Usage data such as features accessed and session duration.</Bullet>
      <Divider />
      <SectionTitle number="2" title="How We Use Your Information" />
      <Bullet>Authenticate users via OTP and maintain sessions.</Bullet>
      <Bullet>Provide personalised astrology consultations and recommendations.</Bullet>
      <Bullet>Send updates and promotional content via push notifications.</Bullet>
      <Bullet>Improve the performance and features of our application.</Bullet>
      <Bullet>Comply with applicable legal obligations.</Bullet>
      <Divider />
      <SectionTitle number="3" title="Sharing of Information" />
      <Body>
        We do not sell, trade, or rent your personal information to third parties. We may share
        data with trusted service providers operating under strict confidentiality agreements.
      </Body>
      <Divider />
      <SectionTitle number="4" title="Data Retention" />
      <Body>
        We retain your personal data only for as long as necessary to fulfil the purposes
        outlined in this policy, or as required by applicable law.
      </Body>
      <Divider />
      <SectionTitle number="5" title="Security" />
      <Body>
        We implement appropriate technical and organisational measures to protect your
        information against unauthorised access, alteration, disclosure, or destruction.
      </Body>
      <Divider />
      <SectionTitle number="6" title="Your Rights" />
      <Bullet>Access the personal data we hold about you.</Bullet>
      <Bullet>Request correction of inaccurate data.</Bullet>
      <Bullet>Request deletion of your data, subject to legal requirements.</Bullet>
      <Bullet>Opt out of promotional notifications via device settings.</Bullet>
      <Divider />
      <SectionTitle number="7" title="Children's Privacy" />
      <Body>
        Our services are not directed to individuals under the age of 13. We do not knowingly
        collect personal information from children.
      </Body>
      <Divider />
      <SectionTitle number="8" title="Changes to This Policy" />
      <Body>
        We may update this Privacy Policy periodically. Changes will be reflected by the
        updated date shown above.
      </Body>
      <Divider />
      <SectionTitle number="9" title="Contact Us" />
      <Body>
        For questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:support@astrogurujii.com" className="text-[#FF6F00] underline">
          support@astrogurujii.com
        </a>
      </Body>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user_api/setting`);
        if (res.data?.status && res.data?.results?.privacy_policy) {
          setContent(res.data.results.privacy_policy);
        }
      } catch {
        // silently fall through to static content
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <BreadcrumbHeader
        title="Privacy Policy"
        highlight="Astrogurujii"
        description="Your privacy matters to us. Learn how we collect, use, and protect your personal information."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <div className="max-w-[860px] mx-auto px-4 py-8">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] overflow-hidden shadow-sm">
          {/* Card header strip */}
          <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🔒
            </div>
            <div>
              <h2 className="font-poppins text-[18px] font-bold text-white">Privacy Policy</h2>
              <p className="font-poppins text-[12px] text-white/80">Last updated: January 01, 2024</p>
            </div>
          </div>

          {/* Intro banner */}
          <div className="mx-6 mt-5 mb-2 bg-[#FFF7F0] border-l-4 border-[#FF6F00] rounded-r-xl px-4 py-3">
            <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
              Astro Gurujii is committed to protecting your personal information and your right
              to privacy. This policy explains how we collect, use, disclose, and safeguard your
              information when you use our application.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {loading ? (
              <Skeleton />
            ) : content ? (
              // If API returns HTML content
              <div
                className="font-poppins text-[13px] text-[#575757] leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <StaticPrivacyContent />
            )}
          </div>

          {/* Footer strip */}
          <div className="bg-[#FFF7F0] border-t border-[#FFE8D6] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <p className="font-poppins text-[12px] text-[#7e7e7e]">
              © 2024 Astrogurujii. All rights reserved.
            </p>
            <a
              href="/terms-and-conditions"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              View Terms & Conditions →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}