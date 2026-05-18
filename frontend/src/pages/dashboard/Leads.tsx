import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CSVLink } from "react-csv";
import api from "../../api/axios";
import type { Lead, LeadsResponse } from "../../types/lead.types";
import CreateLeadModal from "../../components/CreateLeadModal";
import EditLeadModal from "../../components/EditLeadModal";

const statusStyles: Record<string, string> = {
  New: "bg-sky-50 text-sky-700 border border-sky-200",
  Contacted: "bg-amber-50 text-amber-700 border border-amber-200",
  Qualified: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Lost: "bg-red-50 text-red-600 border border-red-200",
};

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

  const hasActiveFilters = search !== "" || status !== "" || source !== "";

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setSource("");
    setSort("latest");
    setCurrentPage(1);
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get<LeadsResponse>(
        `/leads?search=${debouncedSearch}&status=${status}&source=${source}&sort=${sort}&page=${currentPage}`,
      );
      setLeads(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch {
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
    } catch {
      alert("Failed to delete lead");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, status, source, sort, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, source, sort]);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
  const lostLeads = leads.filter((l) => l.status === "Lost").length;
  const newLeads = leads.filter((l) => l.status === "New").length;

  const csvData = leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    CreatedAt: new Date(lead.createdAt).toLocaleDateString(),
  }));

  const statCards = [
    {
      label: "Total Leads",
      value: totalLeads,
      valueClass: "text-zinc-900",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: "Qualified",
      value: qualifiedLeads,
      valueClass: "text-emerald-600",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "New",
      value: newLeads,
      valueClass: "text-sky-600",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sky-500"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: "Lost",
      value: lostLeads,
      valueClass: "text-red-600",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
  ];

  // ── Loading state ──
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse"
            >
              <div className="h-3 w-20 bg-zinc-100 rounded mb-4" />
              <div className="h-8 w-12 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-8 flex justify-center animate-pulse">
          <div className="h-4 w-32 bg-zinc-100 rounded" />
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-xl p-6 flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-500 shrink-0"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm7.25-3a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 6a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchLeads}
          className="ml-auto text-xs font-medium text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                {card.label}
              </p>
              <div className="w-7 h-7 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <p
              className={`text-3xl font-bold tracking-tight ${card.valueClass}`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── MAIN TABLE CARD ── */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Title + actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-semibold text-zinc-900">Leads</h2>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition-all"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Lead
              </button>
              <CSVLink
                data={csvData}
                filename="leads.csv"
                className="inline-flex items-center gap-1.5 border border-zinc-200 text-sm font-medium text-zinc-600 px-3.5 py-1.5 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export CSV
              </CSVLink>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition-shadow bg-white"
              />
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                value: status,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatus(e.target.value),
                options: [
                  { value: "", label: "All Status" },
                  { value: "New", label: "New" },
                  { value: "Contacted", label: "Contacted" },
                  { value: "Qualified", label: "Qualified" },
                  { value: "Lost", label: "Lost" },
                ],
              },
              {
                value: source,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSource(e.target.value),
                options: [
                  { value: "", label: "All Sources" },
                  { value: "Website", label: "Website" },
                  { value: "Instagram", label: "Instagram" },
                  { value: "Referral", label: "Referral" },
                ],
              },
              {
                value: sort,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSort(e.target.value),
                options: [
                  { value: "latest", label: "Latest first" },
                  { value: "oldest", label: "Oldest first" },
                ],
              },
            ].map((filter, i) => (
              <select
                key={i}
                value={filter.value}
                onChange={filter.onChange}
                className="border border-zinc-200 text-sm text-zinc-700 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition-shadow cursor-pointer appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}

            {/* Clear filters pill — only visible when a filter is active */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 border border-zinc-200 bg-white px-3 py-1.5 rounded-lg hover:bg-zinc-50 hover:text-zinc-800 transition-colors"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                {[
                  "Name",
                  "Email",
                  "Status",
                  "Source",
                  "Created",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                        {hasActiveFilters ? (
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a1a1aa"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          >
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                          </svg>
                        ) : (
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a1a1aa"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          >
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm font-medium text-zinc-700">
                        {hasActiveFilters
                          ? "No leads match your filters"
                          : "No leads yet"}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {hasActiveFilters
                          ? "Clear your filters to see all leads"
                          : "Add your first lead to get started"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1.5 text-xs font-medium border border-zinc-200 bg-white text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Clear filters
                          </button>
                        )}
                        <button
                          onClick={() => setShowModal(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          Add lead
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="group hover:bg-zinc-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-600 shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-zinc-800">
                          {lead.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">{lead.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[lead.status] ?? "bg-zinc-100 text-zinc-600 border border-zinc-200"}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">{lead.source}</td>
                    <td className="px-5 py-3.5 text-zinc-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs font-medium text-zinc-600 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                        >
                          Edit
                        </button>
                        {user?.role === "admin" && (
                          <button
                            onClick={() => deleteLead(lead._id)}
                            className="text-xs font-medium text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {leads.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-100 bg-zinc-50/40">
            <p className="text-xs text-zinc-500">
              Page{" "}
              <span className="font-medium text-zinc-700">{currentPage}</span>{" "}
              of <span className="font-medium text-zinc-700">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      currentPage === page
                        ? "bg-zinc-900 text-white border border-zinc-900"
                        : "border border-zinc-200 text-zinc-600 hover:bg-white hover:text-zinc-900"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
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
  );
};

export default Leads;
