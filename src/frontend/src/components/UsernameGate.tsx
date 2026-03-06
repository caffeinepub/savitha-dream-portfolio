import { AlertCircle, Rocket } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useActor } from "../hooks/useActor";
import StarField from "./StarField";

interface UsernameGateProps {
  onEnter: (username: string) => void;
}

export default function UsernameGate({ onEnter }: UsernameGateProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actor } = useActor();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter your name to continue.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      if (actor) {
        await actor.recordVisitor(trimmed, new Date().toISOString());
      }
    } catch {
      // Non-blocking — continue even if recording fails
    }

    setTimeout(() => {
      onEnter(trimmed);
    }, 500);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
    >
      <StarField />

      {/* Nebula blobs */}
      <div className="nebula-bg">
        <div className="nebula-1" />
        <div className="nebula-2" />
        <div className="nebula-3" />
      </div>

      {/* Gate card */}
      <div className="relative w-full max-w-sm mx-6" style={{ zIndex: 10 }}>
        <div className="glass-card-strong p-10 animate-fade-slide-up">
          {/* Icon */}
          <div className="flex justify-center mb-7">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center animate-float animate-pulse-glow"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              <Rocket size={24} style={{ color: "rgba(255,255,255,0.85)" }} />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center text-3xl font-black tracking-tight mb-1"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#fff",
            }}
          >
            Sky of Wings
          </h1>
          <p
            className="text-center text-xs tracking-widest uppercase mb-8"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            Personal Portfolio
          </p>

          <div className="cosmic-divider mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="username-input"
                className="block text-xs tracking-widest uppercase mb-2"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'Geist Mono', monospace",
                }}
              >
                Your Name
              </label>
              <input
                id="username-input"
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your name to explore…"
                className="input-space"
                autoComplete="name"
                data-ocid="gate.username_input"
                disabled={isSubmitting}
              />
              {error && (
                <div
                  className="flex items-center gap-2 mt-2"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle size={13} style={{ color: "#ff6b6b" }} />
                  <p style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-space-primary w-full justify-center"
              data-ocid="gate.submit_button"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "wait" : "pointer",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin"
                    aria-hidden="true"
                  />
                  <span>Entering…</span>
                </>
              ) : (
                <span>Enter the Universe →</span>
              )}
            </button>
          </form>

          <div className="cosmic-divider mt-8 mb-4" />
          <p
            className="text-center text-xs tracking-widest"
            style={{
              color: "rgba(255,255,255,0.2)",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            ✦ Sky of Wings Portfolio ✦
          </p>
        </div>
      </div>
    </div>
  );
}
