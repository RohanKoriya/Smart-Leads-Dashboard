import { useState } from "react";
import api from "../api/axios";
import type { Lead } from "../types/lead.types";

interface Props {
  lead: Lead;
  onClose: () => void;
  onLeadUpdated: () => void;
}

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-zinc-700">{label}</label>
    {children}
  </div>
);

const inputClass =
  "w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition-shadow";

const selectClass =
  "w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition-shadow cursor-pointer appearance-none";

const chevronBg = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "2rem",
} as React.CSSProperties;

const EditLeadModal = ({ lead, onClose, onLeadUpdated }: Props) => {
  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [status, setStatus] = useState(lead.status);
  const [source, setSource] = useState(lead.source);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.put(`/leads/${lead._id}`, { name, email, status, source });
      onLeadUpdated();
      onClose();
    } catch {
      setError("Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 py-8">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Edit lead</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Update the details for this lead
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <FormField label="Full name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
              required
            />
          </FormField>

          <FormField label="Email address">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={inputClass}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Lead["status"])}
                className={selectClass}
                style={chevronBg}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </FormField>

            <FormField label="Source">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as Lead["source"])}
                className={selectClass}
                style={chevronBg}
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </FormField>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              <svg
                className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm7.25-3a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 6a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-zinc-600 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
