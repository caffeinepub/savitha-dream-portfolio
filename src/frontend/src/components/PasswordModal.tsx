import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Lock } from "lucide-react";
import { useState } from "react";

const ADMIN_PASSWORD = "SNOWBEE";

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export default function PasswordModal({
  open,
  onClose,
  onSuccess,
  title = "Protected Action",
  description = "Enter the password to continue.",
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setPassword("");
      setError("");
      onSuccess();
      onClose();
    } else {
      setError("Incorrect password. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-sm"
        style={{
          background: "rgba(10,10,10,0.95)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          color: "#fff",
        }}
        data-ocid="password.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Lock size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
            </div>
            <DialogTitle
              style={{
                color: "#fff",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {title}
            </DialogTitle>
          </div>
          <DialogDescription
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}
          >
            {description}
          </DialogDescription>
        </DialogHeader>

        <div
          className="py-2"
          style={{
            animation: shaking ? "shake 0.5s ease-in-out" : "none",
          }}
        >
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-6px); }
              80% { transform: translateX(6px); }
            }
          `}</style>
          <input
            type="password"
            className="input-space"
            placeholder="Enter password…"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoComplete="current-password"
            data-ocid="password.input"
          />
          {error && (
            <div
              className="flex items-center gap-2 mt-2"
              role="alert"
              aria-live="polite"
              data-ocid="password.error_state"
            >
              <AlertCircle size={13} style={{ color: "#ff6b6b" }} />
              <p style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <button
            type="button"
            className="btn-space"
            onClick={handleClose}
            data-ocid="password.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-space-primary"
            onClick={handleSubmit}
            data-ocid="password.confirm_button"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
