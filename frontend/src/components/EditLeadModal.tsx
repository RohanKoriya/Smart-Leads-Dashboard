import { useState } from "react";

import api from "../api/axios";

import type { Lead } from "../types/lead.types";

interface Props {
  lead: Lead;

  onClose: () => void;

  onLeadUpdated: () => void;
}

const EditLeadModal = ({ lead, onClose, onLeadUpdated }: Props) => {
  const [name, setName] = useState(lead.name);

  const [email, setEmail] = useState(lead.email);

  const [status, setStatus] = useState(lead.status);

  const [source, setSource] = useState(lead.source);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
    UPDATE LEAD
  */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.put(`/leads/${lead._id}`, {
        name,
        email,
        status,
        source,
      });

      onLeadUpdated();

      onClose();
    } catch (error) {
      setError("Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Edit Lead</h2>

          <button onClick={onClose} className="text-xl text-gray-500">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Name"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Email"
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Lead["status"])}
            className="w-full border rounded-lg p-3"
          >
            <option value="New">New</option>

            <option value="Contacted">Contacted</option>

            <option value="Qualified">Qualified</option>

            <option value="Lost">Lost</option>
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value as Lead["source"])}
            className="w-full border rounded-lg p-3"
          >
            <option value="Website">Website</option>

            <option value="Instagram">Instagram</option>

            <option value="Referral">Referral</option>
          </select>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
