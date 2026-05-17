import { useEffect, useState } from "react";

import api from "../../api/axios";

import type { Lead, LeadsResponse } from "../../types/lead.types";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [source, setSource] = useState("");

  const [sort, setSort] = useState("latest");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  /*
    FETCH LEADS
  */
  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await api.get<LeadsResponse>(
        `/leads?search=${debouncedSearch}&status=${status}&source=${source}&sort=${sort}`,
      );

      setLeads(response.data.data);
    } catch (error) {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, status, source, sort]);

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
      <div className="p-6 border-b flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">Leads</h2>

          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* STATUS FILTER */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Status</option>

            <option value="New">New</option>

            <option value="Contacted">Contacted</option>

            <option value="Qualified">Qualified</option>

            <option value="Lost">Lost</option>
          </select>

          {/* SOURCE FILTER */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Sources</option>

            <option value="Website">Website</option>

            <option value="Instagram">Instagram</option>

            <option value="Referral">Referral</option>
          </select>

          {/* SORT FILTER */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="latest">Latest</option>

            <option value="oldest">Oldest</option>
          </select>
        </div>
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
