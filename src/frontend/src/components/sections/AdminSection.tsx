import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Visitor, backendInterface } from "../../backend.d";
import PasswordModal from "../PasswordModal";

interface AdminSectionProps {
  actor: backendInterface | null;
}

export default function AdminSection({ actor }: AdminSectionProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewClick = () => {
    setPasswordOpen(true);
  };

  const handlePasswordSuccess = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const data = await actor.getVisitors();
      setVisitors(data);
    } catch {
      toast.error("Failed to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="scroll-section flex flex-col items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-2xl z-10 animate-fade-slide-up"
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
            Admin Panel
          </h2>
          <div className="flex-1 cosmic-divider ml-2" />
        </div>

        {/* Admin card */}
        <div className="glass-card p-7">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Shield size={20} style={{ color: "rgba(255,255,255,0.6)" }} />
            </div>
            <div>
              <p
                className="font-semibold"
                style={{
                  color: "#fff",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
              >
                Visitor Registry
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'Geist Mono', monospace",
                }}
              >
                {visitors !== null
                  ? `${visitors.length} visitor${visitors.length !== 1 ? "s" : ""} recorded`
                  : "Protected — authenticate to view"}
              </p>
            </div>
          </div>

          {!visitors && !loading && (
            <button
              type="button"
              className="btn-space-primary w-full justify-center"
              onClick={handleViewClick}
              data-ocid="admin.view_button"
            >
              <Users size={14} />
              <span>View Visitors</span>
            </button>
          )}

          {loading && (
            <div
              className="flex items-center justify-center py-8 gap-3"
              data-ocid="admin.loading_state"
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"
                aria-hidden="true"
              />
              <span
                className="text-sm"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "'Geist Mono', monospace",
                }}
              >
                Loading…
              </span>
            </div>
          )}

          {visitors !== null && !loading && (
            <div>
              {visitors.length === 0 ? (
                <div
                  className="text-center py-6"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  data-ocid="admin.empty_state"
                >
                  <Users size={28} className="mx-auto mb-2 opacity-30" />
                  <p
                    style={{
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      fontSize: "0.9rem",
                    }}
                  >
                    No visitors recorded yet.
                  </p>
                </div>
              ) : (
                <div
                  className="overflow-auto space-scrollbar"
                  style={{ maxHeight: "280px" }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ borderColor: "rgba(255,255,255,0.08)" }}
                      >
                        <TableHead
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          #
                        </TableHead>
                        <TableHead
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          Username
                        </TableHead>
                        <TableHead
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          Date / Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitors.map((visitor, idx) => (
                        <TableRow
                          key={`${visitor.username}-${idx}`}
                          style={{ borderColor: "rgba(255,255,255,0.05)" }}
                        >
                          <TableCell
                            style={{
                              color: "rgba(255,255,255,0.25)",
                              fontFamily: "'Geist Mono', monospace",
                              fontSize: "0.75rem",
                            }}
                          >
                            {idx + 1}
                          </TableCell>
                          <TableCell
                            style={{
                              color: "rgba(255,255,255,0.75)",
                              fontFamily: "'Cabinet Grotesk', sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            {visitor.username}
                          </TableCell>
                          <TableCell
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontFamily: "'Geist Mono', monospace",
                              fontSize: "0.75rem",
                            }}
                          >
                            {formatDate(visitor.date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <button
                type="button"
                className="btn-space mt-4 text-xs"
                onClick={handleViewClick}
                style={{ opacity: 0.6 }}
              >
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="mt-6 text-center"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <p>SECTION 06 ✦ ADMIN</p>
          <div className="cosmic-divider w-32 mx-auto mt-3 mb-3" />
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.2)" }}
            className="hover:opacity-60 transition-opacity"
          >
            © {new Date().getFullYear()} · Built with ♡ using caffeine.ai
          </a>
        </div>
      </div>

      <PasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={handlePasswordSuccess}
        title="Admin Access"
        description="Enter the password to view the visitor registry."
      />
    </section>
  );
}
