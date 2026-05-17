import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CSVLink } from "react-csv";

import api from "../../api/axios";

import type { Lead, LeadsResponse } from "../../types/lead.types";

import CreateLeadModal from "../../components/CreateLeadModal";

import EditLeadModal from "../../components/EditLeadModal";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [source, setSource] = useState("");

  const [sort, setSort] = useState("latest");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { user } = useAuth();

  /*
    FETCH LEADS
  */
  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await api.get<LeadsResponse>(
        `/leads?search=${debouncedSearch}&status=${status}&source=${source}&sort=${sort}&page=${currentPage}`,
      );

      setLeads(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/leads/${id}`);

      fetchLeads();
    } catch (error) {
      alert("Failed to delete lead");
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
  }, [debouncedSearch, status, source, sort, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, source, sort]);

  /*
    LOADING STATE
  */
  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <div className="animate-pulse text-lg font-medium">
          Loading leads...
        </div>
      </div>
    );
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
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold mb-2">No Leads Found</h3>

        <p className="text-gray-500">
          Try changing filters or create a new lead.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Qualified":
        return "bg-green-100 text-green-700";

      case "Lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalLeads = leads.length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified",
  ).length;

  const lostLeads = leads.filter((lead) => lead.status === "Lost").length;

  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const csvData = leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    CreatedAt: new Date(lead.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Leads</p>

          <h3 className="text-3xl font-bold mt-2">{totalLeads}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500 text-sm">Qualified</p>

          <h3 className="text-3xl font-bold mt-2 text-green-600">
            {qualifiedLeads}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500 text-sm">New Leads</p>

          <h3 className="text-3xl font-bold mt-2 text-blue-600">{newLeads}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500 text-sm">Lost Leads</p>

          <h3 className="text-3xl font-bold mt-2 text-red-600">{lostLeads}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-2xl font-bold">Leads</h2>

              {/* ADD LEAD */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                + Add Lead
              </button>

              {/* EXPORT CSV */}
              <CSVLink
                data={csvData}
                filename="leads.csv"
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Export CSV
              </CSVLink>
            </div>

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

                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{lead.name}</td>

                  <td className="p-4">{lead.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        lead.status,
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="p-4">{lead.source}</td>

                  <td className="p-4">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      {/* DELETE BUTTON */}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => deleteLead(lead._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-4 border-t">
            {/* PREVIOUS BUTTON */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            {/* PAGE INFO */}
            <div className="flex items-center gap-2">
              {Array.from({
                length: totalPages,
              }).map((_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === page ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* NEXT BUTTON */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        {showModal && (
          <CreateLeadModal
            onClose={() => setShowModal(false)}
            onLeadCreated={fetchLeads}
          />
        )}

        {selectedLead && (
          <EditLeadModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onLeadUpdated={() => {
              fetchLeads();

              setSelectedLead(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Leads;
