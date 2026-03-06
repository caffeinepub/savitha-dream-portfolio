import {
  Instagram,
  Linkedin,
  Pencil,
  Phone,
  Save,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../../backend.d";
import type { backendInterface } from "../../backend.d";
import PasswordModal from "../PasswordModal";

type ContactField = "instagram" | "linkedin" | "phone";

interface ContactSectionProps {
  profile: Profile | null;
  onProfileUpdate: () => void;
  actor: backendInterface | null;
}

interface ContactRow {
  key: ContactField;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  ocid: string;
}

const CONTACTS: ContactRow[] = [
  {
    key: "instagram",
    label: "Instagram",
    icon: <Instagram size={16} />,
    placeholder: "@your_handle",
    ocid: "contact.instagram.edit_button",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: <Linkedin size={16} />,
    placeholder: "linkedin.com/in/yourname",
    ocid: "contact.linkedin.edit_button",
  },
  {
    key: "phone",
    label: "Phone",
    icon: <Phone size={16} />,
    placeholder: "+91 98765 43210",
    ocid: "contact.phone.edit_button",
  },
];

export default function ContactSection({
  profile,
  onProfileUpdate,
  actor,
}: ContactSectionProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pendingField, setPendingField] = useState<ContactField | null>(null);
  const [editingField, setEditingField] = useState<ContactField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEditClick = (field: ContactField) => {
    setPendingField(field);
    setPasswordOpen(true);
  };

  const handlePasswordSuccess = () => {
    if (!pendingField) return;
    setDraftValue(profile?.[pendingField] ?? "");
    setEditingField(pendingField);
    setPendingField(null);
  };

  const handleSave = async () => {
    if (!actor || !editingField) return;
    setSaving(true);
    try {
      const updated: Record<ContactField, string> = {
        instagram: profile?.instagram ?? "",
        linkedin: profile?.linkedin ?? "",
        phone: profile?.phone ?? "",
        [editingField]: draftValue,
      };
      await actor.saveProfile(
        profile?.photoURL ?? "",
        profile?.about ?? "",
        updated.instagram,
        updated.linkedin,
        updated.phone,
      );
      onProfileUpdate();
      setEditingField(null);
      toast.success(
        `${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated!`,
      );
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="scroll-section flex flex-col items-center justify-center px-6 py-12">
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
            Contact
          </h2>
          <div className="flex-1 cosmic-divider ml-2" />
        </div>

        {/* Contact rows */}
        <div className="glass-card overflow-hidden">
          {CONTACTS.map((contact, idx) => {
            const value = profile?.[contact.key] ?? "";
            const isEditing = editingField === contact.key;

            return (
              <div
                key={contact.key}
                className={`flex items-center gap-4 px-6 py-5 ${idx < CONTACTS.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {contact.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {contact.label}
                  </p>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type={contact.key === "phone" ? "tel" : "text"}
                        className="input-space flex-1"
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave();
                          if (e.key === "Escape") setEditingField(null);
                        }}
                        placeholder={contact.placeholder}
                        style={{
                          padding: "0.4rem 0.75rem",
                          fontSize: "0.875rem",
                        }}
                      />
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)",
                        }}
                        onClick={() => setEditingField(null)}
                        disabled={saving}
                        aria-label="Cancel edit"
                      >
                        <X size={12} />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.85)",
                          border: "1px solid rgba(255,255,255,0.9)",
                          color: "#000",
                        }}
                        onClick={handleSave}
                        disabled={saving}
                        aria-label="Save"
                        data-ocid="contact.save_button"
                      >
                        {saving ? (
                          <span
                            className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Save size={12} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <p
                      className="text-sm truncate"
                      style={{
                        color: value
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.25)",
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontStyle: value ? "normal" : "italic",
                      }}
                    >
                      {value || "Not set"}
                    </p>
                  )}
                </div>

                {/* Edit button */}
                {!isEditing && (
                  <button
                    type="button"
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.45)",
                    }}
                    onClick={() => handleEditClick(contact.key)}
                    aria-label={`Edit ${contact.label}`}
                    data-ocid={contact.ocid}
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 flex items-center justify-between"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>SECTION 04</span>
          <span>✦</span>
          <span>CONTACT</span>
        </div>
      </div>

      <PasswordModal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setPendingField(null);
        }}
        onSuccess={handlePasswordSuccess}
        title={`Edit ${pendingField ? pendingField.charAt(0).toUpperCase() + pendingField.slice(1) : ""}`}
        description="Enter the password to edit this field."
      />
    </section>
  );
}
