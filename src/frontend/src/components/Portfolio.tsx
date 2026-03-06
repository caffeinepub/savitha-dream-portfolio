import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Profile } from "../backend.d";
import { useActor } from "../hooks/useActor";
import StarField from "./StarField";
import AboutSection from "./sections/AboutSection";
import AdminSection from "./sections/AdminSection";
import ContactSection from "./sections/ContactSection";
import ProjectsSection from "./sections/ProjectsSection";
import ResumeSection from "./sections/ResumeSection";
import WelcomeSection from "./sections/WelcomeSection";

interface PortfolioProps {
  username: string;
}

const SECTION_LABELS = [
  "Welcome",
  "About",
  "Resume",
  "Contact",
  "Projects",
  "Admin",
];

export default function Portfolio({ username }: PortfolioProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  // Load profile once
  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });

  const refetchProfile = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  }, [queryClient]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = container.querySelectorAll(".scroll-section");
    const observers: IntersectionObserver[] = [];

    let idx = 0;
    for (const section of Array.from(sections)) {
      const i = idx;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(i);
          }
        },
        { root: container, threshold: 0.5 },
      );
      observer.observe(section);
      observers.push(observer);
      idx++;
    }

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  const scrollToSection = (idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const sections = container.querySelectorAll(".scroll-section");
    const target = sections[idx] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Fixed star background */}
      <StarField />

      {/* Fixed nebula */}
      <div className="nebula-bg" style={{ position: "fixed", zIndex: 0 }}>
        <div className="nebula-1" />
        <div className="nebula-2" />
        <div className="nebula-3" />
      </div>

      {/* Navigation dots */}
      <nav
        aria-label="Section navigation"
        style={{
          position: "fixed",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {SECTION_LABELS.map((label, idx) => (
          <button
            type="button"
            key={label}
            className={`nav-dot ${activeSection === idx ? "active" : ""}`}
            onClick={() => scrollToSection(idx)}
            aria-label={`Navigate to ${label}`}
            title={label}
            data-ocid={
              `nav.dot.${idx + 1}` as `nav.dot.${1 | 2 | 3 | 4 | 5 | 6}`
            }
          />
        ))}
      </nav>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="scroll-container"
        style={{ position: "relative", zIndex: 10 }}
      >
        <WelcomeSection
          username={username}
          profile={profile ?? null}
          onProfileUpdate={refetchProfile}
          actor={actor}
        />
        <AboutSection
          profile={profile ?? null}
          onProfileUpdate={refetchProfile}
          actor={actor}
        />
        <ResumeSection actor={actor} />
        <ContactSection
          profile={profile ?? null}
          onProfileUpdate={refetchProfile}
          actor={actor}
        />
        <ProjectsSection actor={actor} />
        <AdminSection actor={actor} />
      </div>
    </div>
  );
}
