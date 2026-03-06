import { useQuery } from "@tanstack/react-query";
import { Download, Eye, FileText, Star, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { backendInterface } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import PasswordModal from "../PasswordModal";

interface ResumeSectionProps {
  actor: backendInterface | null;
}

export default function ResumeSection({ actor }: ResumeSectionProps) {
  const { isFetching } = useActor();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"upload" | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: resume, refetch: refetchResume } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getResume();
    },
    enabled: !!actor && !isFetching,
  });

  const handleUploadClick = () => {
    setPendingAction("upload");
    setPasswordOpen(true);
  };

  const handlePasswordSuccess = () => {
    if (pendingAction === "upload") {
      fileInputRef.current?.click();
    }
    setPendingAction(null);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actor) return;

    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes);
      await actor.saveResume(file.name, blob);
      await refetchResume();
      toast.success(`Resume "${file.name}" uploaded!`);
    } catch {
      toast.error("Failed to upload resume.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleView = async () => {
    if (!actor) return;
    try {
      const r = await actor.getResume();
      if (!r) {
        toast.error("No resume uploaded yet.");
        return;
      }
      const url = r.data.getDirectURL();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Failed to view resume.");
    }
  };

  const handleDownload = async () => {
    if (!actor) return;
    try {
      const r = await actor.getResume();
      if (!r) {
        toast.error("No resume uploaded yet.");
        return;
      }
      const bytes = await r.data.getBytes();
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.name || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download resume.");
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
            Resume
          </h2>
          <div className="flex-1 cosmic-divider ml-2" />
        </div>

        {/* Resume card */}
        <div className="glass-card p-7 mb-6">
          {resume ? (
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <FileText
                  size={20}
                  style={{ color: "rgba(255,255,255,0.7)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate"
                  style={{
                    color: "#fff",
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >
                  {resume.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  Resume on file
                </p>
              </div>
            </div>
          ) : (
            <div
              className="text-center py-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
              data-ocid="resume.empty_state"
            >
              <FileText size={28} className="mx-auto mb-2 opacity-40" />
              <p
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                No resume uploaded yet
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            className="btn-space justify-center"
            onClick={handleUploadClick}
            disabled={uploading}
            data-ocid="resume.upload_button"
          >
            {uploading ? (
              <span
                className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Upload size={14} />
            )}
            <span>{uploading ? "Uploading…" : "Upload"}</span>
          </button>

          <button
            type="button"
            className="btn-space justify-center"
            onClick={handleView}
            data-ocid="resume.view_button"
          >
            <Eye size={14} />
            <span>View</span>
          </button>

          <button
            type="button"
            className="btn-space justify-center"
            onClick={handleDownload}
            data-ocid="resume.download_button"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>

        <div
          className="mt-4 flex items-center justify-between"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>SECTION 03</span>
          <span>✦</span>
          <span>RESUME</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        aria-label="Upload resume file"
      />

      <PasswordModal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        title="Upload Resume"
        description="Enter the password to upload your resume."
      />
    </section>
  );
}
