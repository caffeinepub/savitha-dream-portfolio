import { Pencil, Save, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../../backend.d";
import type { backendInterface } from "../../backend.d";
import PasswordModal from "../PasswordModal";

interface AboutSectionProps {
  profile: Profile | null;
  onProfileUpdate: () => void;
  actor: backendInterface | null;
}

export default function AboutSection({
  profile,
  onProfileUpdate,
  actor,
}: AboutSectionProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [saving, setSaving] = useState(false);

  const aboutText = profile?.about || "";

  const handlePasswordSuccess = () => {
    setDraftText(aboutText);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.saveProfile(
        profile?.photoURL ?? "",
        draftText,
        profile?.instagram ?? "",
        profile?.linkedin ?? "",
        profile?.phone ?? "",
      );
      onProfileUpdate();
      setEditing(false);
      toast.success("About updated!");
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDraftText("");
  };

  return (
    <section className="scroll-section flex flex-col items-center justify-center px-6 py-12">
      {/* Star decorations */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[
          { top: "12%", right: "10%", size: 2 },
          { top: "70%", left: "6%", size: 2.5 },
          { bottom: "15%", right: "15%", size: 1.5 },
        ].map((s) => (
          <div
            key={`${s.size}-${"top" in s ? s.top : "bottom" in s ? s.bottom : "x"}`}
            className="star-decoration"
            style={{
              top: "top" in s ? s.top : undefined,
              bottom: "bottom" in s ? s.bottom : undefined,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: s.size * 2,
              height: s.size * 2,
            }}
          />
        ))}
      </div>

      <div
        className="w-full max-w-xl z-10 animate-fade-slide-up"
        style={{ position: "relative" }}
      >
        {/* Section heading */}
        <div className="flex items-center gap-3 mb-6">
          <Star size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
          <h2
            className="text-2xl font-black tracking-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#fff",
            }}
          >
            About Me
          </h2>
          <div className="flex-1 cosmic-divider ml-2" />

          {!editing && (
            <button
              type="button"
              className="btn-space flex items-center gap-2"
              onClick={() => setPasswordOpen(true)}
              aria-label="Edit about section"
              data-ocid="about.edit_button"
            >
              <Pencil size={13} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Content card */}
        <div className="glass-card p-7">
          {editing ? (
            <div className="space-y-4">
              <textarea
                className="input-space resize-none"
                rows={7}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Tell the world about yourself…"
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: "0.95rem",
                }}
                data-ocid="about.textarea"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="btn-space flex items-center gap-2"
                  onClick={handleCancel}
                  disabled={saving}
                  data-ocid="about.cancel_button"
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  className="btn-space-primary flex items-center gap-2"
                  onClick={handleSave}
                  disabled={saving}
                  data-ocid="about.save_button"
                >
                  {saving ? (
                    <span
                      className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{saving ? "Saving…" : "Save"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {aboutText ? (
                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: "1rem",
                    lineHeight: "1.85",
                  }}
                >
                  {aboutText}
                </p>
              ) : (
                <p
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: "0.95rem",
                    fontStyle: "italic",
                  }}
                  data-ocid="about.empty_state"
                >
                  Click Edit to add your story…
                </p>
              )}
            </div>
          )}
        </div>

        {/* Decorative coordinates */}
        <div
          className="mt-4 flex items-center justify-between"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>SECTION 02</span>
          <span>✦</span>
          <span>ABOUT</span>
        </div>
      </div>

      <PasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={handlePasswordSuccess}
        title="Edit About Me"
        description="Enter the password to edit your about section."
      />
    </section>
  );
}
