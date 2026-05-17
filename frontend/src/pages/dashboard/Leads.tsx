import { useEffect, useState } from "react";

import api from "../../api/axios";

import type { Lead, LeadsResponse } from "../../types/lead.types";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
    FETCH LEADS
  */
  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await api.get<LeadsResponse>("/leads");

      setLeads(response.data.data);
    } catch (error) {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /*
    LOADING STATE
  */
  if (loading) {
    return <div className="p-6">Loading leads...</div>;
  }

  /*
    ERROR STATE
  */
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  /*
    EMPTY STATE
  */
  if (leads.length === 0) {
    return <div className="p-6">No leads found</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Leads</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Email</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Source</th>

              <th className="text-left p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{lead.name}</td>

                <td className="p-4">{lead.email}</td>

                <td className="p-4">{lead.status}</td>

                <td className="p-4">{lead.source}</td>

                <td className="p-4">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;
