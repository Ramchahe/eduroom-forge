import { useEffect } from "react";
import { MotionConfig, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";

import heroDashboard from "@/assets/hero-dashboard.png";
import aiShapes from "@/assets/ai-shapes.png";

import { ScrollProgress } from "@/pages/home/components/ScrollProgress";
import { LandingNav } from "@/pages/home/components/LandingNav";

import { HeroSection } from "@/pages/home/sections/HeroSection";
import { AiTelemetrySection } from "@/pages/home/sections/AiTelemetrySection";
import { FeaturesSection } from "@/pages/home/sections/FeaturesSection";
import { AiStorySection } from "@/pages/home/sections/AiStorySection";
import { PricingSection } from "@/pages/home/sections/PricingSection";
import { TestimonialsSection } from "@/pages/home/sections/TestimonialsSection";
import { FaqSection } from "@/pages/home/sections/FaqSection";
import { ContactSection } from "@/pages/home/sections/ContactSection";
import { CtaSection } from "@/pages/home/sections/CtaSection";
import { FooterSection } from "@/pages/home/sections/FooterSection";

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const title = "EduAI | AI Online Teaching Management Software";
    const desc =
      "AI online teaching management software for courses, live classes, assessments, communities, and analytics—built to boost outcomes and save time.";

    document.title = title;

    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", desc);
    document.head.appendChild(meta);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", window.location.origin + "/");
    document.head.appendChild(canonical);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EduAI",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description: desc,
      url: window.location.origin,
    };

    const script =
      document.querySelector('script[type="application/ld+json"]') || document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <ScrollProgress progress={scrollYProgress} />

        <LandingNav
          onLogoClick={() => navigate("/")}
          onSignIn={() => navigate("/login")}
          onGetStarted={() => navigate("/login")}
        />

        <main>
          <HeroSection heroImage={heroDashboard} onPrimaryCta={() => navigate("/login")} />
          <AiTelemetrySection />
          <FeaturesSection />
          <AiStorySection />
          <PricingSection onGetStarted={() => navigate("/login")} />
          <TestimonialsSection />
          <FaqSection />
          <ContactSection decorativeImage={aiShapes} />
          <CtaSection onGetStarted={() => navigate("/login")} />
        </main>

        <FooterSection />
      </div>
    </MotionConfig>
  );
};

export default Home;

