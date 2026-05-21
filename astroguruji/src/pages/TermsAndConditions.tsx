import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

const API_BASE_URL = "https://admin.astrogurujii.com";

// ── Shared sub-components ─────────────────────────────────────
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

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-poppins text-[13px] text-[#575757] leading-relaxed pl-10 mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <hr className="border-none border-t border-[#FFE8D6] my-4" />;
}

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
function StaticTermsContent() {
  return (
    <div>
      <SectionTitle number="1" title="Acceptance of Terms" />
      <Body>
        By downloading, installing, or using Astro Gurujii, you confirm that you are at
        least 18 years of age and agree to comply with these Terms and Conditions.
      </Body>
      <Divider />
      <SectionTitle number="2" title="Services Provided" />
      <Body>
        Astro Gurujii provides astrology-based guidance, consultations, and content for
        entertainment and informational purposes only. Our services are not a substitute for
        professional medical, legal, financial, or psychological advice.
      </Body>
      <Divider />
      <SectionTitle number="3" title="User Account" />
      <Bullet>You are responsible for maintaining the confidentiality of your account.</Bullet>
      <Bullet>You agree to provide accurate information during registration.</Bullet>
      <Bullet>Notify us immediately of any unauthorised use of your account.</Bullet>
      <Divider />
      <SectionTitle number="4" title="Prohibited Activities" />
      <Bullet>Use the app for any unlawful or fraudulent purpose.</Bullet>
      <Bullet>Attempt to gain unauthorised access to any part of the service.</Bullet>
      <Bullet>Transmit harmful, offensive, or disruptive content.</Bullet>
      <Bullet>Reverse-engineer or decompile any part of the application.</Bullet>
      <Divider />
      <SectionTitle number="5" title="Intellectual Property" />
      <Body>
        All content, trademarks, logos, and intellectual property displayed in the app are
        the property of Astro Gurujii or its licensors. Reproduction or distribution without
        prior written permission is prohibited.
      </Body>
      <Divider />
      <SectionTitle number="6" title="Payments & Refunds" />
      <Body>
        Certain services within the app may require payment. All transactions are processed
        securely. Refunds are subject to our Refund Policy available on our website. We
        reserve the right to modify pricing at any time.
      </Body>
      <Divider />
      <SectionTitle number="7" title="Disclaimer of Warranties" />
      <Body>
        The app is provided on an "as is" and "as available" basis without warranties of any
        kind. We do not guarantee the accuracy, completeness, or usefulness of any astrological
        information provided.
      </Body>
      <Divider />
      <SectionTitle number="8" title="Limitation of Liability" />
      <Body>
        To the maximum extent permitted by law, Astro Gurujii shall not be liable for any
        indirect, incidental, special, or consequential damages arising from your use of the
        application.
      </Body>
      <Divider />
      <SectionTitle number="9" title="Termination" />
      <Body>
        We reserve the right to suspend or terminate your account at our discretion, without
        notice, for conduct that violates these Terms or is harmful to other users.
      </Body>
      <Divider />
      <SectionTitle number="10" title="Governing Law" />
      <Body>
        These Terms are governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of courts in New Delhi, India.
      </Body>
      <Divider />
      <SectionTitle number="11" title="Changes to Terms" />
      <Body>
        We may revise these Terms at any time. Continued use of the application after changes
        constitutes acceptance of the revised Terms.
      </Body>
      <Divider />
      <SectionTitle number="12" title="Contact Us" />
      <Body>
        For any queries regarding these Terms, please contact{" "}
        <a href="mailto:support@astrogurujii.com" className="text-[#FF6F00] underline">
          support@astrogurujii.com
        </a>
      </Body>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function TermsAndConditionsPage() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user_api/setting`);
        if (res.data?.status && res.data?.results?.terms_and_conditions) {
          setContent(res.data.results.terms_and_conditions);
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
        title="Terms & Conditions"
        highlight="Astrogurujii"
        description="Please read these terms carefully. By using our services, you agree to be bound by the following terms and conditions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions" },
        ]}
      />

      <div className="max-w-[860px] mx-auto px-4 py-8">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#FFE8D6] overflow-hidden shadow-sm">
          {/* Card header strip */}
          <div className="bg-gradient-to-r from-[#FF6F00] to-[#FF9A3C] px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              📄
            </div>
            <div>
              <h2 className="font-poppins text-[18px] font-bold text-white">
                Terms & Conditions
              </h2>
              <p className="font-poppins text-[12px] text-white/80">
                Last updated: January 01, 2024
              </p>
            </div>
          </div>

          {/* Intro banner */}
          <div className="mx-6 mt-5 mb-2 bg-[#FFF7F0] border-l-4 border-[#FF6F00] rounded-r-xl px-4 py-3">
            <p className="font-poppins text-[13px] text-[#575757] leading-relaxed">
              Please read these Terms and Conditions carefully before using Astro Gurujii.
              By accessing or using our service, you agree to be bound by these terms. If you
              disagree with any part of the terms, you may not access the service.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {loading ? (
              <Skeleton />
            ) : content ? (
              <div
                className="font-poppins text-[13px] text-[#575757] leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <StaticTermsContent />
            )}
          </div>

          {/* Footer strip */}
          <div className="bg-[#FFF7F0] border-t border-[#FFE8D6] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <p className="font-poppins text-[12px] text-[#7e7e7e]">
              © 2024 Astrogurujii. All rights reserved.
            </p>
            <a
              href="/privacy-policy"
              className="font-poppins text-[12px] text-[#FF6F00] font-medium hover:underline"
            >
              View Privacy Policy →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}