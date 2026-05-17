import { useState } from "react";

import api from "../api/axios";

interface Props {
  onClose: () => void;
  onLeadCreated: () => void;
}

const CreateLeadModal = ({ onClose, onLeadCreated }: Props) => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("New");

  const [source, setSource] = useState("Website");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
    CREATE LEAD
  */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/leads", {
        name,
        email,
        status,
        source,
      });

      /*
        REFRESH LEADS
      */
      onLeadCreated();

      /*
        CLOSE MODAL
      */
      onClose();
    } catch (error) {
      setError("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Lead</h2>

          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lead name"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Lead email"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="New">New</option>

              <option value="Contacted">Contacted</option>

              <option value="Qualified">Qualified</option>

              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Source</label>

            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="Website">Website</option>

              <option value="Instagram">Instagram</option>

              <option value="Referral">Referral</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-4">
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
              {loading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;
