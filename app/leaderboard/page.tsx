// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// // Debounce utility
// const debounce = (func: any, wait = 300) => {
//   let timeout: any;
//   return (...args: any[]) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// export default function Leaderboard() {
//   const [data, setData] = useState<any[]>([]);
//   const [selectedGrade, setSelectedGrade] = useState("All");
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalRows, setTotalRows] = useState(0);

//   const PAGE_LIMIT = 10;

//   // Convert “Grade 8” → “8th-grade”
//   const mapGradeToDB = (grade: string) => {
//     if (grade === "All") return "All";

//     const num = grade.replace("Grade ", "");
//     const suffix =
//       num === "1" ? "st-grade" :
//       num === "2" ? "nd-grade" :
//       num === "3" ? "rd-grade" :
//       "th-grade";

//     return `${num}${suffix}`;
//   };

//   // Debounce search input
//   const handleSearchChange = debounce((value: string) => {
//     setDebouncedSearch(value);
//     setPage(1); // reset to first page
//   }, 300);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}m ${s}s`;
//   };

//   // Medal UI
//   const medalForRank = (rank: number) => {
//     if (rank === 0) return <span className="text-yellow-500 text-xl">🥇</span>;
//     if (rank === 1) return <span className="text-gray-400 text-xl">🥈</span>;
//     if (rank === 2) return <span className="text-amber-700 text-xl">🥉</span>;
//     return null;
//   };

//   // Fetch leaderboard (backend pagination + sorting + filters)
//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       const dbGrade = mapGradeToDB(selectedGrade);

//       let query = supabase
//         .from("leaderboard")
//         .select("full_name, grade, overall_score, math_score, ela_score, science_score, total_time", {
//           count: "exact",
//         })
//         .order("overall_score", { ascending: false })
//         .order("total_time", { ascending: true })
//         .range((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT - 1);

//       if (dbGrade !== "All") query = query.eq("grade", dbGrade);
//       if (debouncedSearch) query = query.ilike("full_name", `%${debouncedSearch}%`);

//       const { data, error, count } = await query;
//       if (!error && data) {
//         setData(data);
//         if (count !== null) setTotalRows(count);
//       }
//     };

//     fetchLeaderboard();
//   }, [selectedGrade, debouncedSearch, page]);

//   const totalPages = Math.ceil(totalRows / PAGE_LIMIT);

//   return (
//     <div className="p-6 max-w-6xl mx-auto animate-fadeIn cursor-pointer">
//       <h1 className="text-4xl font-bold mb-4 text-green-700 text-center">🏆 Leaderboard</h1>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">

//         {/* Grade Filter */}
//         <select
//           className="border px-3 py-2 rounded cursor-pointer bg-background"
//           value={selectedGrade}
//           onChange={(e) => {
//             setSelectedGrade(e.target.value);
//             setPage(1);
//           }}
//         >
//           <option value="All">All Grades</option>
//           {[...Array(12)].map((_, i) => (
//             <option key={i} value={`Grade ${i + 1}`}>
//               Grade {i + 1}
//             </option>
//           ))}
//         </select>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="border px-3 py-2 rounded bg-background"
//           onChange={(e) => {
//             setSearch(e.target.value);
//             handleSearchChange(e.target.value);
//           }}
//           value={search}
//         />
//       </div>

//       {/* Table */}
//       <table className="w-full border-collapse border text-center">
//         <thead>
//           <tr className="bg-green-600 text-white">
//             <th className="p-2 border">Name</th>
//             <th className="p-2 border">Grade</th>
//             <th className="p-2 border">Overall Score</th>
//             <th className="p-2 border">Math Score</th>
//             <th className="p-2 border">ELA Score</th>
//             <th className="p-2 border">Science Score</th>
//             <th className="p-2 border">Time Taken</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((entry, idx) => (
//             <tr
//               key={idx}

//               className={`animate-fadeInDelay hover:bg-muted transition-all duration-300`} style={{ animationDelay: `${idx * 0.1}s`}}
//             >
//               <td className="p-2 border flex items-center justify-center gap-2">
//                 {medalForRank(idx)}
//                 <span>{entry.full_name || "Student"}</span>
//               </td>

//               <td className="p-2 border">{entry.grade}</td>

//               <td className="p-2 border font-semibold">
//                 {Math.round(entry.overall_score)}%
//               </td>
//               <td className="p-2 border">{entry.math_score}%</td>
//               <td className="p-2 border font-medium">{entry.ela_score ? `${entry.ela_score}%` : "—"}</td>
//               <td className="p-2 border">{entry.science_score ? `${entry.science_score}%` : "—"}</td>
//               <td className="p-2 border">{formatTime(entry.total_time)}</td>
//             </tr>
//           ))}
//         </tbody>

        
//       </table>

//       {/* Pagination */}
//       <div className="flex justify-center mt-4 gap-4">
//         <button
//           className="px-4 py-2 border rounded disabled:opacity-40 bg-green-500 text-white cursor-pointer"
//           disabled={page <= 1}
//           onClick={() => setPage(page - 1)}
//         >
//           ← Prev
//         </button>

//         <span className="px-3 py-2">
//           Page {page} / {totalPages || 1}
//         </span>

//         <button
//           className="px-4 py-2 border rounded disabled:opacity-40 bg-green-500 text-white cursor-pointer"
//           disabled={page >= totalPages}
//           onClick={() => setPage(page + 1)}
//         >
//           Next →
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

// ── Types ────────────────────────────────────────────────────
interface LeaderboardEntry {
  full_name: string;
  grade: string;
  overall_score: number;
  math_score: number;
  ela_score: number | null;
  science_score: number | null;
  total_time: number;
}

// ── Constants ────────────────────────────────────────────────
const PAGE_LIMIT = 10;

const AVATAR_COLORS: [string, string][] = [
  ["#B5D4F4", "#0C447C"],
  ["#9FE1CB", "#085041"],
  ["#FAC775", "#633806"],
  ["#CECBF6", "#3C3489"],
  ["#F4C0D1", "#72243E"],
  ["#C0DD97", "#27500A"],
];

// ── Helpers ──────────────────────────────────────────────────
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const avatarStyle = (idx: number) => {
  const [bg, fg] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return { backgroundColor: bg, color: fg };
};

const mapGradeToDB = (grade: string) => {
  if (grade === "All") return "All";
  const num = grade.replace("Grade ", "");
  const suffix =
    num === "1" ? "st-grade" :
    num === "2" ? "nd-grade" :
    num === "3" ? "rd-grade" : "th-grade";
  return `${num}${suffix}`;
};

// ── Sub-components ───────────────────────────────────────────

function Avatar({ name, idx, size = 36 }: { name: string; idx: number; size?: number }) {
  return (
    <div
      style={{ ...avatarStyle(idx), width: size, height: size, fontSize: size * 0.36 }}
      className="rounded-full flex items-center justify-center font-medium flex-shrink-0"
    >
      {getInitials(name)}
    </div>
  );
}

function ScoreBadge({ value }: { value: number | null }) {
  if (value == null)
    return <span className="text-xs text-gray-400">—</span>;
  const cls =
    value >= 70
      ? "bg-green-100 text-green-800"
      : value >= 50
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${cls}`}>
      {Math.round(value)}%
    </span>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[40px]">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${Math.round(value)}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 min-w-[32px] text-right">
        {Math.round(value)}%
      </span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-medium text-gray-900">{value}</p>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 1
      ? "bg-yellow-200 text-yellow-800"
      : rank === 2
      ? "bg-gray-200 text-gray-600"
      : rank === 3
      ? "bg-amber-200 text-amber-800"
      : "bg-gray-100 text-gray-500";
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium ${cls}`}>
      {rank}
    </div>
  );
}

function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length < 1) return null;

  const podiumOrder =
    entries.length >= 3
      ? [
          { entry: entries[1], rank: 2, height: 70 },
          { entry: entries[0], rank: 1, height: 100 },
          { entry: entries[2], rank: 3, height: 50 },
        ]
      : entries.map((e, i) => ({ entry: e, rank: i + 1, height: 100 - i * 25 }));

  const blockColors: Record<number, [string, string]> = {
    1: ["#FAC775", "#633806"],
    2: ["#D3D1C7", "#444441"],
    3: ["#EF9F27", "#412402"],
  };

  return (
    <div className="flex items-end justify-center gap-3 mb-8">
      {podiumOrder.map(({ entry, rank, height }, i) => {
        const [bg, fg] = blockColors[rank] || ["#E5E7EB", "#6B7280"];
        return (
          <div key={rank} className="flex flex-col items-center gap-1.5 flex-1 max-w-[130px]">
            <Avatar name={entry.full_name} idx={rank - 1} size={40} />
            <p className="text-xs font-medium text-gray-800 text-center truncate w-full px-1">
              {entry.full_name.split(" ")[0]}
            </p>
            <p className="text-[11px] text-gray-500">{Math.round(entry.overall_score)}%</p>
            <div
              className="w-full rounded-t-md flex items-center justify-center"
              style={{ height, backgroundColor: bg }}
            >
              <span className="text-sm font-medium" style={{ color: fg }}>
                #{rank}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [allGrades, setAllGrades] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<keyof LeaderboardEntry>("overall_score");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  };

  // Load distinct grades for filter dropdown
  useEffect(() => {
    const loadGrades = async () => {
      const { data } = await supabase
        .from("leaderboard")
        .select("grade");
      if (data) {
        const unique = [...new Set(data.map((d: any) => d.grade))].sort() as string[];
        setAllGrades(unique);
      }
    };
    loadGrades();
  }, []);

  // Fetch leaderboard with filters + sorting + pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dbGrade = mapGradeToDB(selectedGrade);

      let query = supabase
        .from("leaderboard")
        .select("full_name, grade, overall_score, math_score, ela_score, science_score, total_time", {
          count: "exact",
        })
        .order(sortCol as string, { ascending: sortAsc })
        .range((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT - 1);

      if (dbGrade !== "All") query = query.eq("grade", dbGrade);
      if (debouncedSearch) query = query.ilike("full_name", `%${debouncedSearch}%`);

      const { data: rows, error, count } = await query;
      if (!error && rows) {
        setData(rows);
        if (count !== null) setTotalRows(count);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedGrade, debouncedSearch, page, sortCol, sortAsc]);

  // ── Derived stats ────────────────────────────────────────
  const avg = (key: keyof LeaderboardEntry) =>
    data.length
      ? Math.round(data.reduce((a, d) => a + ((d[key] as number) || 0), 0) / data.length)
      : 0;

  const topScore = data.length
    ? Math.round(Math.max(...data.map((d) => d.overall_score)))
    : 0;

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_LIMIT));

  // ── Sort handler ─────────────────────────────────────────
  const handleSort = (col: keyof LeaderboardEntry) => {
    if (sortCol === col) {
      setSortAsc((p) => !p);
    } else {
      setSortCol(col);
      setSortAsc(col === "total_time");
    }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: keyof LeaderboardEntry }) => (
    <span className="ml-1 text-[10px] opacity-50">
      {sortCol === col ? (sortAsc ? "↑" : "↓") : "↕"}
    </span>
  );

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-1">🏆 Leaderboard</h1>
        <p className="text-sm text-gray-400">Rankings across all grades and sections</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <StatCard label="Students" value={String(totalRows)} />
        <StatCard label="Avg overall" value={`${avg("overall_score")}%`} />
        <StatCard label="Top score" value={`${topScore}%`} />
        <StatCard label="Avg math" value={`${avg("math_score")}%`} />
        <StatCard label="Avg ELA" value={`${avg("ela_score")}%`} />
        <StatCard label="Avg science" value={`${avg("science_score")}%`} />
      </div>

      {/* Podium — top 3 of current filtered page */}
      <Podium entries={data.slice(0, 3)} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          className="border border-gray-200 px-3 py-2 rounded-xl text-sm bg-white cursor-pointer flex-1"
          value={selectedGrade}
          onChange={(e) => { setSelectedGrade(e.target.value); setPage(1); }}
        >
          <option value="All">All grades</option>
          {allGrades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          className="border border-gray-200 px-3 py-2 rounded-xl text-sm bg-white cursor-pointer flex-1"
          value={sortCol}
          onChange={(e) => {
            const col = e.target.value as keyof LeaderboardEntry;
            setSortCol(col);
            setSortAsc(col === "total_time");
            setPage(1);
          }}
        >
          <option value="overall_score">Sort by overall score</option>
          <option value="math_score">Sort by math</option>
          <option value="ela_score">Sort by ELA</option>
          <option value="science_score">Sort by science</option>
          <option value="total_time">Sort by time taken</option>
        </select>

        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-200 px-3 py-2 rounded-xl text-sm flex-1 max-w-xs"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left w-10 text-[11px] uppercase tracking-wide text-gray-400 font-medium">#</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium">Grade</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("overall_score")}>
                Overall <SortIcon col="overall_score" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium cursor-pointer hover:text-gray-700 hidden md:table-cell" onClick={() => handleSort("math_score")}>
                Math <SortIcon col="math_score" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium cursor-pointer hover:text-gray-700 hidden md:table-cell" onClick={() => handleSort("ela_score")}>
                ELA <SortIcon col="ela_score" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium cursor-pointer hover:text-gray-700 hidden lg:table-cell" onClick={() => handleSort("science_score")}>
                Science <SortIcon col="science_score" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("total_time")}>
                Time <SortIcon col="total_time" />
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                  No results found
                </td>
              </tr>
            ) : (
              data.map((entry, idx) => {
                const rank = (page - 1) * PAGE_LIMIT + idx + 1;
                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <RankBadge rank={rank} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={entry.full_name} idx={idx} size={32} />
                        <span className="font-medium text-gray-900 truncate max-w-[160px]">
                          {entry.full_name || "Student"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {entry.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar value={entry.overall_score} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <ScoreBadge value={entry.math_score} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <ScoreBadge value={entry.ela_score} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <ScoreBadge value={entry.science_score} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatTime(entry.total_time)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <p className="text-xs text-gray-400">
          Showing {Math.min((page - 1) * PAGE_LIMIT + 1, totalRows)}–{Math.min(page * PAGE_LIMIT, totalRows)} of {totalRows}
        </p>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-green-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-green-600 transition-colors"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="px-3 py-2 text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>
          <button
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-green-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-green-600 transition-colors"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

    </div>
  );
}
