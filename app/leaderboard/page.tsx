"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Debounce utility
const debounce = (func: any, wait = 300) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const PAGE_LIMIT = 10;

  // Convert “Grade 8” → “8th-grade”
  const mapGradeToDB = (grade: string) => {
    if (grade === "All") return "All";

    const num = grade.replace("Grade ", "");
    const suffix =
      num === "1" ? "st-grade" :
      num === "2" ? "nd-grade" :
      num === "3" ? "rd-grade" :
      "th-grade";

    return `${num}${suffix}`;
  };

  // Debounce search input
  const handleSearchChange = debounce((value: string) => {
    setDebouncedSearch(value);
    setPage(1); // reset to first page
  }, 300);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Medal UI
  const medalForRank = (rank: number) => {
    if (rank === 0) return <span className="text-yellow-500 text-xl">🥇</span>;
    if (rank === 1) return <span className="text-gray-400 text-xl">🥈</span>;
    if (rank === 2) return <span className="text-amber-700 text-xl">🥉</span>;
    return null;
  };

  // Fetch leaderboard (backend pagination + sorting + filters)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const dbGrade = mapGradeToDB(selectedGrade);

      let query = supabase
        .from("leaderboard")
        .select("full_name, grade, overall_score, math_score, ela_score, total_time", {
          count: "exact",
        })
        .order("overall_score", { ascending: false })
        .order("total_time", { ascending: true })
        .range((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT - 1);

      if (dbGrade !== "All") query = query.eq("grade", dbGrade);
      if (debouncedSearch) query = query.ilike("full_name", `%${debouncedSearch}%`);

      const { data, error, count } = await query;
      if (!error && data) {
        setData(data);
        if (count !== null) setTotalRows(count);
      }
    };

    fetchLeaderboard();
  }, [selectedGrade, debouncedSearch, page]);

  const totalPages = Math.ceil(totalRows / PAGE_LIMIT);

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn cursor-pointer">
      <h1 className="text-4xl font-bold mb-4 text-green-700 text-center">🏆 Leaderboard</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">

        {/* Grade Filter */}
        <select
          className="border px-3 py-2 rounded cursor-pointer bg-background"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Grades</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={`Grade ${i + 1}`}>
              Grade {i + 1}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-3 py-2 rounded bg-background"
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearchChange(e.target.value);
          }}
          value={search}
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse border text-center">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Grade</th>
            <th className="p-2 border">Overall Score</th>
            <th className="p-2 border">Math Score</th>
            <th className="p-2 border">ELA Score</th>
            <th className="p-2 border">Time Taken</th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry, idx) => (
            <tr
              key={idx}

              className={`animate-fadeInDelay hover:bg-muted transition-all duration-300`} style={{ animationDelay: `${idx * 0.1}s`}}
            >
              <td className="p-2 border flex items-center justify-center gap-2">
                {medalForRank(idx)}
                <span>{entry.full_name || "Student"}</span>
              </td>

              <td className="p-2 border">{entry.grade}</td>

              <td className="p-2 border font-semibold">
                {Math.round(entry.overall_score)}%
              </td>
              <td className="p-2 border">{entry.math_score}%</td>
              <td className="p-2 border font-medium">{entry.ela_score ? `${entry.ela_score}%` : "—"}</td>
              <td className="p-2 border">{formatTime(entry.total_time)}</td>
            </tr>
          ))}
        </tbody>

        
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          className="px-4 py-2 border rounded disabled:opacity-40 bg-green-500 text-white cursor-pointer"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          ← Prev
        </button>

        <span className="px-3 py-2">
          Page {page} / {totalPages || 1}
        </span>

        <button
          className="px-4 py-2 border rounded disabled:opacity-40 bg-green-500 text-white cursor-pointer"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
