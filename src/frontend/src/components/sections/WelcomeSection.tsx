import { Camera, Pencil, Star } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../../backend.d";
import type { backendInterface } from "../../backend.d";
import PasswordModal from "../PasswordModal";

interface WelcomeSectionProps {
  username: string;
  profile: Profile | null;
  onProfileUpdate: () => void;
  actor: backendInterface | null;
}

export default function WelcomeSection({
  username,
  profile,
  onProfileUpdate,
  actor,
}: WelcomeSectionProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headingText = "Welcome to My Sky of Wings";

  const handlePasswordSuccess = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actor) return;

    setUploading(true);
    try {
      // Convert to base64 data URL
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const photoURL = ev.target?.result as string;
        await actor.saveProfile(
          photoURL,
          profile?.about ?? "",
          profile?.instagram ?? "",
          profile?.linkedin ?? "",
          profile?.phone ?? "",
        );
        onProfileUpdate();
        toast.success("Profile photo updated!");
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to upload photo.");
      setUploading(false);
    }
    e.target.value = "";
  };

  const photoSrc = profile?.photoURL || null;

  return (
    <section className="scroll-section flex flex-col items-center justify-center px-6 py-12">
      {/* Floating star decorations */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[
          { top: "15%", left: "8%", size: 3, delay: "0s" },
          { top: "25%", right: "12%", size: 2, delay: "0.8s" },
          { bottom: "20%", left: "15%", size: 2.5, delay: "1.5s" },
          { bottom: "30%", right: "8%", size: 2, delay: "0.4s" },
          { top: "60%", left: "5%", size: 1.5, delay: "2s" },
        ].map((s) => (
          <div
            key={`${s.delay}-${s.size}`}
            className="star-decoration"
            style={{
              top: "top" in s ? s.top : undefined,
              bottom: "bottom" in s ? s.bottom : undefined,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: s.size * 2,
              height: s.size * 2,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      {/* Main heading */}
      <div className="text-center mb-10 z-10" style={{ position: "relative" }}>
        <div
          className="flex flex-wrap justify-center gap-1 mb-3"
          aria-label={headingText}
        >
          {headingText.split("").map((char, i) => (
            <span
              key={`${char}-pos-${headingText.slice(0, i)}`}
              className="animate-letter-reveal"
              style={{
                animationDelay: `${i * 0.035}s`,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
                fontWeight: 900,
                color: char === " " ? "transparent" : "#fff",
                display: "inline-block",
                minWidth: char === " " ? "0.5em" : undefined,
                textShadow:
                  char !== " " ? "0 0 20px rgba(255,255,255,0.2)" : undefined,
                letterSpacing: "-0.02em",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
        <div className="cosmic-divider w-48 mx-auto" />
        <p
          className="mt-3 text-xs tracking-widest uppercase animate-fade-in"
          style={{
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'Geist Mono', monospace",
            animationDelay: "1.5s",
          }}
        >
          ✦ Personal Universe ✦
        </p>
      </div>

      {/* Profile photo */}
      <div className="relative z-10" style={{ position: "relative" }}>
        {/* Orbit rings */}
        <div
          className="absolute rounded-full animate-orbit"
          style={{
            inset: "-28px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full animate-orbit-reverse"
          style={{
            inset: "-48px",
            border: "1px dashed rgba(255,255,255,0.07)",
            borderRadius: "50%",
          }}
          aria-hidden="true"
        />

        {/* Star dots on orbit */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 5,
              height: 5,
              marginTop: -2.5,
              marginLeft: -2.5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
              boxShadow: "0 0 6px rgba(255,255,255,0.4)",
              transform: `rotate(${deg}deg) translateX(128px)`,
            }}
          />
        ))}

        {/* Photo container */}
        <div
          className="relative rounded-full overflow-hidden animate-pulse-glow"
          style={{
            width: 200,
            height: 200,
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          {photoSrc ? (
            <img
              src={photoSrc}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Camera size={32} style={{ color: "rgba(255,255,255,0.3)" }} />
              <p
                className="text-xs mt-2"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "'Geist Mono', monospace",
                }}
              >
                No photo
              </p>
            </div>
          )}

          {uploading && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"
                aria-label="Uploading..."
              />
            </div>
          )}
        </div>

        {/* Edit button */}
        <button
          type="button"
          className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
          }}
          onClick={() => setPasswordOpen(true)}
          aria-label="Edit profile photo"
          data-ocid="welcome.edit_button"
          disabled={uploading}
        >
          <Pencil size={13} />
        </button>
      </div>

      {/* Welcome note */}
      <div
        className="mt-10 text-center z-10 animate-fade-in"
        style={{ animationDelay: "1.8s" }}
      >
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Star size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
          <span
            className="text-sm"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            Hello, {username}
          </span>
          <Star size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: "2.5s" }}
        aria-hidden="true"
      >
        <p
          className="text-xs tracking-widest"
          style={{
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          SCROLL
        </p>
        <div
          className="w-px h-10 animate-pulse-glow"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        data-ocid="welcome.upload_button"
        aria-label="Upload profile photo"
      />

      <PasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={handlePasswordSuccess}
        title="Edit Profile Photo"
        description="Enter the password to upload a new profile photo."
      />
    </section>
  );
}
