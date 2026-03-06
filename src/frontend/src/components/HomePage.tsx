import {
  ChevronRight,
  Download,
  Instagram,
  Linkedin,
  Phone,
} from "lucide-react";
import { useEffect, useRef } from "react";
import ElectricCanvas from "./ElectricCanvas";

interface HomePageProps {
  username: string;
}

export default function HomePage({ username }: HomePageProps) {
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger letter animations after entrance
    const el = nameRef.current;
    if (!el) return;
    const letters = el.querySelectorAll(".name-letter");
    letters.forEach((letter, i) => {
      const el = letter as HTMLElement;
      el.style.animationDelay = `${0.8 + i * 0.08}s`;
    });
  }, []);

  const nameLetters: Array<{ letter: string; pos: number }> = "SAVITHA"
    .split("")
    .map((letter, pos) => ({ letter, pos }));

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#020b18" }}
    >
      {/* Electric canvas background */}
      <ElectricCanvas />

      {/* Ambient glow layers */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,60,180,0.15) 0%, transparent 60%)",
          zIndex: 1,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0,40,120,0.1) 0%, transparent 60%)",
          zIndex: 1,
        }}
      />

      {/* Content wrapper */}
      <main
        className="relative flex flex-col items-center px-4 pb-16 pt-8"
        style={{ zIndex: 10 }}
      >
        {/* Welcome banner */}
        <WelcomeSection username={username} />

        {/* Profile photo */}
        <ProfilePhoto />

        {/* Name */}
        <NameSection nameLetters={nameLetters} nameRef={nameRef} />

        {/* About Me */}
        <AboutSection />

        {/* Resume */}
        <ResumeSection />

        {/* Contact */}
        <ContactSection />

        {/* Footer */}
        <footer
          className="mt-16 text-center animate-entrance"
          style={{ animationDelay: "1.8s" }}
        >
          <div className="lightning-divider w-48 mx-auto mb-4" />
          <p
            className="text-xs tracking-widest"
            style={{ color: "rgba(0,100,180,0.5)" }}
          >
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              style={{ color: "rgba(0,120,200,0.6)" }}
            >
              Built with ❤ using caffeine.ai
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ─── Welcome Section ──────────────────────────────────── */

function WelcomeSection({ username }: { username: string }) {
  return (
    <section
      className="w-full max-w-3xl text-center mb-12 animate-entrance"
      style={{ animationDelay: "0.1s" }}
    >
      {/* Greeting chip */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-4 text-xs tracking-widest uppercase"
        style={{
          border: "1px solid rgba(0,100,200,0.4)",
          background: "rgba(0,30,80,0.5)",
          color: "rgba(0,170,255,0.7)",
        }}
      >
        <span className="animate-electric-pulse">⚡</span>
        <span>Welcome, {username}</span>
        <span
          className="animate-electric-pulse"
          style={{ animationDelay: "0.5s" }}
        >
          ⚡
        </span>
      </div>

      {/* Main heading */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-4 animate-float animate-glow-pulse"
        style={{
          color: "#00aaff",
          fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
          animationDelay: "0s",
          letterSpacing: "0.05em",
        }}
      >
        Welcome to
        <br />
        <span style={{ color: "#00eeff", fontSize: "0.9em" }}>My Dream</span>
      </h1>

      <div className="lightning-divider w-64 mx-auto mt-6" />
    </section>
  );
}

/* ─── Profile Photo ────────────────────────────────────── */

function ProfilePhoto() {
  return (
    <section
      className="mb-10 animate-entrance"
      style={{ animationDelay: "0.3s" }}
    >
      <div
        className="relative inline-block animate-float-slow"
        style={{ animationDelay: "0.5s" }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute -inset-3 rounded-full animate-border-glow-strong"
          style={{
            background: "transparent",
            border: "1.5px solid #0066ff",
          }}
        />
        {/* Second ring */}
        <div
          className="absolute -inset-6 rounded-full"
          style={{
            border: "1px solid rgba(0,100,255,0.2)",
          }}
        />
        {/* Rotating dashes ring */}
        <svg
          className="absolute"
          style={{
            inset: "-32px",
            width: "calc(100% + 64px)",
            height: "calc(100% + 64px)",
            animation: "ringRotate 12s linear infinite",
          }}
          viewBox="0 0 200 200"
          role="presentation"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#0044cc"
            strokeWidth="0.5"
            strokeDasharray="8 12"
            opacity="0.5"
          />
        </svg>
        {/* Counter-rotating dashes */}
        <svg
          className="absolute"
          style={{
            inset: "-24px",
            width: "calc(100% + 48px)",
            height: "calc(100% + 48px)",
            animation: "ringRotateReverse 20s linear infinite",
          }}
          viewBox="0 0 200 200"
          role="presentation"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#00aaff"
            strokeWidth="0.3"
            strokeDasharray="4 20"
            opacity="0.3"
          />
        </svg>

        {/* Photo */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: 180,
            height: 180,
            border: "2px solid #0066ff",
            boxShadow:
              "0 0 30px rgba(0,100,255,0.4), 0 0 60px rgba(0,60,200,0.2)",
          }}
        >
          <img
            src="/assets/generated/savitha-profile-placeholder.dim_400x400.png"
            alt="Savitha"
            className="w-full h-full object-cover"
          />
          {/* Scan line overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,100,255,0.03) 3px, rgba(0,100,255,0.03) 4px)",
            }}
          />
        </div>

        {/* Corner sparks */}
        <SparkDot
          position={{ top: -8, left: "50%", transform: "translateX(-50%)" }}
        />
        <SparkDot
          position={{ bottom: -8, left: "50%", transform: "translateX(-50%)" }}
          delay="0.5s"
        />
        <SparkDot
          position={{ left: -8, top: "50%", transform: "translateY(-50%)" }}
          delay="0.25s"
        />
        <SparkDot
          position={{ right: -8, top: "50%", transform: "translateY(-50%)" }}
          delay="0.75s"
        />
      </div>
    </section>
  );
}

function SparkDot({
  position,
  delay = "0s",
}: { position: React.CSSProperties; delay?: string }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-electric-pulse"
      style={{
        ...position,
        background: "#00aaff",
        boxShadow: "0 0 8px #00aaff, 0 0 16px #0066ff",
        animationDelay: delay,
      }}
    />
  );
}

/* ─── Name Section ─────────────────────────────────────── */

function NameSection({
  nameLetters,
  nameRef,
}: {
  nameLetters: Array<{ letter: string; pos: number }>;
  nameRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      className="mb-12 text-center animate-entrance"
      style={{ animationDelay: "0.5s" }}
    >
      <div
        ref={nameRef}
        className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3"
      >
        {nameLetters.map(({ letter, pos }) => (
          <span
            key={`savitha-letter-${letter}-${pos}`}
            className="name-letter animate-float animate-glow-pulse animate-flicker"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 900,
              color: pos % 2 === 0 ? "#00aaff" : "#00eeff",
              fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
              display: "inline-block",
              animationDelay: `${pos * 0.1}s, ${pos * 0.15}s, ${3 + pos * 0.7}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <p
        className="mt-2 text-xs tracking-[0.5em] uppercase animate-glow-subtle"
        style={{ color: "rgba(0,150,220,0.6)" }}
      >
        · Developer · Dreamer · Creator ·
      </p>
    </section>
  );
}

/* ─── About Me ─────────────────────────────────────────── */

function AboutSection() {
  return (
    <section
      className="w-full max-w-2xl mb-8 section-card p-8 animate-entrance animate-float-subtle animate-border-glow"
      style={{ animationDelay: "0.6s, 0s, 0s" }}
    >
      <SectionHeader icon="👤" title="About Me" delay="0.6s" />

      <p
        className="text-sm sm:text-base leading-relaxed mb-4"
        style={{ color: "#b0d4f1", lineHeight: "1.9" }}
      >
        I am <span className="text-neon-blue font-semibold">Savitha</span> — a
        passionate developer, dreamer, and creator who believes in the power of
        technology to transform ideas into reality. I thrive at the intersection
        of creativity and code, crafting digital experiences that leave a
        lasting impression.
      </p>
      <p
        className="text-sm sm:text-base leading-relaxed"
        style={{ color: "#b0d4f1", lineHeight: "1.9" }}
      >
        From elegant interfaces to robust systems, I pour my heart into every
        project, always chasing that electric spark of innovation that makes the
        impossible possible. My dream is a world where technology empowers every
        human to shine.
      </p>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-2 mt-6">
        {["React", "TypeScript", "Node.js", "UI/UX", "Problem Solver"].map(
          (skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-xs rounded-full tracking-wider uppercase"
              style={{
                border: "1px solid rgba(0,100,200,0.5)",
                background: "rgba(0,30,80,0.5)",
                color: "#00aaff",
              }}
            >
              {skill}
            </span>
          ),
        )}
      </div>
    </section>
  );
}

/* ─── Resume Section ───────────────────────────────────── */

function ResumeSection() {
  return (
    <section
      className="w-full max-w-2xl mb-8 section-card p-8 animate-entrance animate-float-subtle animate-border-glow"
      style={{ animationDelay: "0.8s, 0.3s, 0s" }}
    >
      <SectionHeader icon="📄" title="Resume" delay="0.8s" />

      <p className="text-sm mb-6" style={{ color: "#7aaed4" }}>
        Explore my professional journey, skills, and achievements. Download my
        resume to learn more about what I bring to the table.
      </p>

      <a
        href="/resume.pdf"
        download
        className="btn-electric inline-flex items-center gap-3"
        data-ocid="resume.button"
        aria-label="Download Savitha's resume"
      >
        <Download size={16} />
        <span>Download Resume</span>
        <ChevronRight size={14} />
      </a>
    </section>
  );
}

/* ─── Contact Section ──────────────────────────────────── */

function ContactSection() {
  const contacts = [
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
      ocid: null,
    },
    {
      icon: <Linkedin size={18} />,
      label: "LinkedIn",
      value: "linkedin.com/in/savitha",
      href: "https://linkedin.com/in/savitha",
      ocid: "contact.link.1",
    },
    {
      icon: <Instagram size={18} />,
      label: "Instagram",
      value: "@savitha_dreams",
      href: "https://instagram.com/savitha_dreams",
      ocid: "contact.link.2",
    },
  ];

  return (
    <section
      className="w-full max-w-2xl mb-8 section-card p-8 animate-entrance animate-float-subtle animate-border-glow"
      style={{ animationDelay: "1.0s, 0.6s, 0s" }}
    >
      <SectionHeader icon="📡" title="Contact" delay="1.0s" />

      <div className="space-y-4">
        {contacts.map((contact, i) => (
          <div
            key={contact.label}
            className="flex items-center gap-4 p-4 rounded-lg group transition-all duration-300"
            style={{
              background: "rgba(0,30,80,0.3)",
              border: "1px solid rgba(0,70,180,0.3)",
              animationDelay: `${1.0 + i * 0.1}s`,
            }}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0,60,160,0.4)",
                border: "1px solid rgba(0,100,220,0.4)",
                color: "#00aaff",
              }}
            >
              {contact.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-xs uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(0,150,220,0.6)" }}
              >
                {contact.label}
              </p>
              {contact.href ? (
                <a
                  href={contact.href}
                  target={
                    contact.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    contact.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-sm font-medium transition-all duration-300 truncate block"
                  style={{ color: "#80c8ff" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = "#00eeff";
                    (e.target as HTMLAnchorElement).style.textShadow =
                      "0 0 8px #00aaff, 0 0 16px #0066ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = "#80c8ff";
                    (e.target as HTMLAnchorElement).style.textShadow = "none";
                  }}
                  data-ocid={contact.ocid ?? undefined}
                >
                  {contact.value}
                </a>
              ) : (
                <span
                  className="text-sm font-medium"
                  style={{ color: "#80c8ff" }}
                >
                  {contact.value}
                </span>
              )}
            </div>

            {/* Hover spark */}
            <div
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "#00aaff" }}
            >
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section Header helper ────────────────────────────── */

function SectionHeader({
  icon,
  title,
  delay,
}: {
  icon: string;
  title: string;
  delay: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xl">{icon}</span>
      <h2
        className="text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase animate-glow-subtle"
        style={{
          color: "#00aaff",
          fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
          animationDelay: delay,
        }}
      >
        {title}
      </h2>
      <div className="flex-1 lightning-divider ml-2" />
    </div>
  );
}
