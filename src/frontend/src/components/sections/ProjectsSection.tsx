import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FolderOpen, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project, backendInterface } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import PasswordModal from "../PasswordModal";

interface ProjectsSectionProps {
  actor: backendInterface | null;
}

interface ProjectForm {
  title: string;
  description: string;
  link: string;
}

export default function ProjectsSection({ actor }: ProjectsSectionProps) {
  const { isFetching } = useActor();
  const queryClient = useQueryClient();

  const [addPasswordOpen, setAddPasswordOpen] = useState(false);
  const [deletePasswordOpen, setDeletePasswordOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<bigint | null>(null);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjects();
    },
    enabled: !!actor && !isFetching,
  });

  const refetchProjects = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const handleAddClick = () => {
    setAddPasswordOpen(true);
  };

  const handleAddPasswordSuccess = () => {
    setForm({ title: "", description: "", link: "" });
    setShowForm(true);
  };

  const handleSubmitProject = async () => {
    if (!actor || !form.title.trim()) {
      toast.error("Project title is required.");
      return;
    }
    setSubmitting(true);
    try {
      await actor.addProject({
        title: form.title.trim(),
        description: form.description.trim(),
        link: form.link.trim(),
      });
      refetchProjects();
      setShowForm(false);
      toast.success("Project added!");
    } catch {
      toast.error("Failed to add project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: bigint) => {
    setPendingDeleteId(id);
    setDeletePasswordOpen(true);
  };

  const handleDeletePasswordSuccess = async () => {
    if (pendingDeleteId === null || !actor) return;
    setDeleting(pendingDeleteId);
    try {
      await actor.removeProject(pendingDeleteId);
      refetchProjects();
      toast.success("Project removed.");
    } catch {
      toast.error("Failed to remove project.");
    } finally {
      setDeleting(null);
      setPendingDeleteId(null);
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
            Project Work
          </h2>
          <div className="flex-1 cosmic-divider ml-2" />

          <button
            type="button"
            className="btn-space flex items-center gap-2"
            onClick={handleAddClick}
            data-ocid="projects.add_button"
          >
            <Plus size={13} />
            <span>Add</span>
          </button>
        </div>

        {/* Add project form */}
        {showForm && (
          <div className="glass-card p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-sm font-semibold"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
              >
                New Project
              </p>
              <button
                type="button"
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)",
                }}
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={12} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                className="input-space"
                placeholder="Project title *"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <textarea
                className="input-space resize-none"
                rows={3}
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              />
              <input
                type="url"
                className="input-space"
                placeholder="Link (optional, e.g. https://...)"
                value={form.link}
                onChange={(e) =>
                  setForm((f) => ({ ...f, link: e.target.value }))
                }
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn-space"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-space-primary"
                  onClick={handleSubmitProject}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span
                      className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span>{submitting ? "Adding…" : "Add Project"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects grid */}
        {projects.length === 0 && !showForm ? (
          <div
            className="glass-card p-10 text-center"
            data-ocid="projects.empty_state"
          >
            <FolderOpen
              size={32}
              className="mx-auto mb-3"
              style={{ color: "rgba(255,255,255,0.2)" }}
            />
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              No projects yet. Add your first project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project, idx) => (
              <div
                key={String(project.id)}
                className="glass-card p-5"
                data-ocid={
                  `projects.item.${idx + 1}` as `projects.item.${number}`
                }
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3
                    className="font-bold text-sm leading-snug flex-1"
                    style={{
                      color: "#fff",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    {project.title}
                  </h3>
                  <button
                    type="button"
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(255,80,80,0.1)",
                      border: "1px solid rgba(255,80,80,0.2)",
                      color: "rgba(255,120,120,0.7)",
                    }}
                    onClick={() => handleDeleteClick(project.id)}
                    disabled={deleting === project.id}
                    aria-label={`Delete project ${project.title}`}
                    data-ocid={
                      `projects.delete_button.${idx + 1}` as `projects.delete_button.${number}`
                    }
                  >
                    {deleting === project.id ? (
                      <span
                        className="w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2 size={11} />
                    )}
                  </button>
                </div>

                {project.description && (
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                    }}
                  >
                    {project.description}
                  </p>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs transition-all"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "'Geist Mono', monospace",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.45)";
                    }}
                  >
                    <ExternalLink size={10} />
                    <span>View Project</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className="mt-4 flex items-center justify-between"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>SECTION 05</span>
          <span>✦</span>
          <span>PROJECTS</span>
        </div>
      </div>

      <PasswordModal
        open={addPasswordOpen}
        onClose={() => setAddPasswordOpen(false)}
        onSuccess={handleAddPasswordSuccess}
        title="Add Project"
        description="Enter the password to add a new project."
      />

      <PasswordModal
        open={deletePasswordOpen}
        onClose={() => {
          setDeletePasswordOpen(false);
          setPendingDeleteId(null);
        }}
        onSuccess={handleDeletePasswordSuccess}
        title="Delete Project"
        description="Enter the password to confirm deletion."
      />
    </section>
  );
}
