


// app/components/ResultsScreen.tsx
// Post-submission results UI — score cards, progress bars, action buttons

// interface ResultsScreenProps {
//   isGrade9Or10: boolean;
//   isSat?: boolean;
//   satReadingScore?: number | null;
//   satMathScore?: number | null;
//   satCorrectCount?: number;
//   calculateSectionScore: (section: "math" | "ela" | "science") => string | null;
//   calculateScore: () => { combined?: string; mathScore?: string; elaScore?: string; combinedScore?: string };
//   totalQuestions: number;
//   answeredCount: number;
//   onGoHome: () => void;
//   onReview: () => void;
// }

// // SAT readiness band from raw correct count (out of 20)
// function getSatReadinessBand(correctCount: number): {
//   label: string;
//   desc: string;
//   colorClass: string;
//   bgClass: string;
// } {
//   if (correctCount >= 18) return {
//     label: "Strong",
//     desc: "On track for a competitive SAT score.",
//     colorClass: "text-emerald-700",
//     bgClass: "bg-emerald-50 border-emerald-200",
//   };
//   if (correctCount >= 14) return {
//     label: "Solid Foundation",
//     desc: "Focus on missed question types for refinement.",
//     colorClass: "text-blue-700",
//     bgClass: "bg-blue-50 border-blue-200",
//   };
//   if (correctCount >= 10) return {
//     label: "Developing",
//     desc: "Review core concepts in both sections before full-length practice tests.",
//     colorClass: "text-amber-700",
//     bgClass: "bg-amber-50 border-amber-200",
//   };
//   return {
//     label: "Foundational",
//     desc: "Foundational review recommended before timed practice.",
//     colorClass: "text-red-700",
//     bgClass: "bg-red-50 border-red-200",
//   };
// }

// export default function ResultsScreen({
//   isGrade9Or10,
//   isSat = false,
//   satReadingScore,
//   satMathScore,
//   satCorrectCount = 0,
//   calculateSectionScore,
//   calculateScore,
//   totalQuestions,
//   answeredCount,
//   onGoHome,
//   onReview,
// }: ResultsScreenProps) {

//   const satBand = isSat ? getSatReadinessBand(satCorrectCount) : null;

//   return (
//     <div className="w-full max-w-2xl mx-auto px-4 py-8">

//       {/* ── Badge + Title ── */}
//       <div className="text-center mb-8">
//         <span className="inline-block bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
//           Quiz Complete 🎉
//         </span>
//         <h1 className="text-3xl font-extrabold text-gray-900">Your Results</h1>
//         <p className="text-sm text-gray-400 font-semibold mt-1">
//           {isSat
//             ? "Here's how you did across each SAT section"
//             : "Here's how you did across each section"}
//         </p>
//       </div>

//       {/* ── Answered counter ── */}
//       <p className="text-center font-medium text-xl text-gray-600 mb-6">
//         {answeredCount} of {totalQuestions} questions answered
//       </p>

//       {/* ════════════════════════════════════════════════════
//           SAT score cards
//           ════════════════════════════════════════════════════ */}
//       {isSat ? (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 cursor-pointer">

//             {/* Reading & Writing */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
//               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
//               <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 mb-1">Mathematics</p>
//               {satReadingScore != null ? (
//                 <>
//                   <p className="text-4xl font-extrabold text-emerald-600 leading-none">
//                     {satReadingScore}%
//                   </p>
//                   <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
//                     <div className="h-full rounded-full bg-emerald-500" style={{ width: `${satReadingScore}%` }} />
//                   </div>
//                 </>
//               ) : (
//                 <p className="text-lg font-bold text-gray-400 mt-1">—</p>
//               )}
//             </div>

//             {/* SAT Math */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
//               <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
//               <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-1">Reading and Writing</p>
//               {satMathScore != null ? (
//                 <>
//                   <p className="text-4xl font-extrabold text-indigo-600 leading-none">
//                     {satMathScore}%
//                   </p>
//                   <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
//                     <div className="h-full rounded-full bg-indigo-500" style={{ width: `${satMathScore}%` }} />
//                   </div>
//                 </>
//               ) : (
//                 <p className="text-lg font-bold text-gray-400 mt-1">—</p>
//               )}
//             </div>

//           </div>

//           {/* ── SAT Readiness Band ── */}
//           {satBand && (
//             <div className={`border rounded-2xl px-6 py-4 mb-8 text-center ${satBand.bgClass}`}>
//               <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-1">
//                 SAT Readiness · {satCorrectCount} / 20 correct
//               </p>
//               <p className={`text-2xl font-extrabold mb-1 ${satBand.colorClass}`}>
//                 {satBand.label}
//               </p>
//               <p className={`text-sm font-medium ${satBand.colorClass}`}>
//                 {satBand.desc}
//               </p>
//             </div>
//           )}
//         </>

//       ) : isGrade9Or10 ? (
//         /* ════════════════════════════════════════════════════
//            Grade 1–10 section score cards (unchanged)
//            ════════════════════════════════════════════════════ */
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 cursor-pointer">

//           {/* Math */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
//             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
//             <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-1">Math</p>
//             <p className="text-4xl font-extrabold text-indigo-600 leading-none">
//               {calculateSectionScore("math")}%
//             </p>
//             <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
//               <div className="h-full rounded-full bg-indigo-500" style={{ width: `${calculateSectionScore("math")}%` }} />
//             </div>
//           </div>

//           {/* ELA */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
//             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
//             <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 mb-1">ELA</p>
//             {calculateSectionScore("ela") !== null ? (
//               <>
//                 <p className="text-4xl font-extrabold text-emerald-600 leading-none">
//                   {calculateSectionScore("ela")}%
//                 </p>
//                 <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
//                   <div className="h-full rounded-full bg-emerald-500" style={{ width: `${calculateSectionScore("ela")}%` }} />
//                 </div>
//               </>
//             ) : (
//               <p className="text-lg font-bold text-gray-400 mt-1">Skipped</p>
//             )}
//           </div>

//           {/* Science */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
//             <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mx-auto mb-3">🔬</div>
//             <p className="text-xs font-extrabold uppercase tracking-widest text-amber-500 mb-1">Science</p>
//             {calculateSectionScore("science") !== null ? (
//               <>
//                 <p className="text-4xl font-extrabold text-amber-600 leading-none">
//                   {calculateSectionScore("science")}%
//                 </p>
//                 <div className="mt-3 h-1.5 rounded-full bg-amber-100 overflow-hidden">
//                   <div className="h-full rounded-full bg-amber-500" style={{ width: `${calculateSectionScore("science")}%` }} />
//                 </div>
//               </>
//             ) : (
//               <p className="text-lg font-bold text-gray-400 mt-1">Skipped</p>
//             )}
//           </div>

//         </div>

//       ) : (
//         /* ── Combined score for non-grade quizzes (unchanged) ── */
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
//           <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2">Overall Score</p>
//           <p className="text-6xl font-extrabold text-indigo-600">
//             {Number(calculateScore().combined).toFixed(2)}%
//           </p>
//           <div className="mt-4 h-2 rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
//             <div
//               className="h-full rounded-full bg-indigo-500"
//               style={{ width: `${Number(calculateScore().combined)}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {/* ── Action buttons ── */}
//       <div className="text-center">
//         {Number(calculateScore().combined) === 100 ? (
//           <button
//             className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
//             onClick={onGoHome}
//           >
//             🏠 Back to Home
//           </button>
//         ) : (
//           <button
//             className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
//             onClick={onReview}
//           >
//             📝 Review Test
//           </button>
//         )}
//       </div>

//     </div>
//   );
// }





// app/modals/resultScreen.tsx
// Post-submission results UI — score cards, progress bars, action buttons
// UPDATED: adds a GED branch (4 section cards) — all existing branches unchanged.

interface ResultsScreenProps {
  isGrade9Or10: boolean;
  isSat?: boolean;
  isGed?: boolean; // NEW
  satReadingScore?: number | null;
  satMathScore?: number | null;
  satCorrectCount?: number;
  gedScores?: { math: string; rla: string; science: string; social: string; overall: string }; // NEW
  calculateSectionScore: (section: "math" | "ela" | "science") => string | null;
  calculateScore: () => { combined?: string; mathScore?: string; elaScore?: string; combinedScore?: string };
  totalQuestions: number;
  answeredCount: number;
  onGoHome: () => void;
  onReview: () => void;
}

function getSatReadinessBand(correctCount: number): {
  label: string; desc: string; colorClass: string; bgClass: string;
} {
  if (correctCount >= 18) return { label: "Strong", desc: "On track for a competitive SAT score.", colorClass: "text-emerald-700", bgClass: "bg-emerald-50 border-emerald-200" };
  if (correctCount >= 14) return { label: "Solid Foundation", desc: "Focus on missed question types for refinement.", colorClass: "text-blue-700", bgClass: "bg-blue-50 border-blue-200" };
  if (correctCount >= 10) return { label: "Developing", desc: "Review core concepts in both sections before full-length practice tests.", colorClass: "text-amber-700", bgClass: "bg-amber-50 border-amber-200" };
  return { label: "Foundational", desc: "Foundational review recommended before timed practice.", colorClass: "text-red-700", bgClass: "bg-red-50 border-red-200" };
}

// GED proficiency band, per the SmartMathz Proficiency Framework
function getGedBand(score: number): { label: string; colorClass: string } {
  if (score >= 85) return { label: "Strong",       colorClass: "text-emerald-700" };
  if (score >= 70) return { label: "Proficient",   colorClass: "text-blue-700"    };
  if (score >= 50) return { label: "Developing",   colorClass: "text-amber-700"   };
  if (score >= 30) return { label: "Emerging",     colorClass: "text-orange-700"  };
  return             { label: "Foundational", colorClass: "text-red-700"     };
}

export default function ResultsScreen({
  isGrade9Or10,
  isSat = false,
  isGed = false,
  satReadingScore,
  satMathScore,
  satCorrectCount = 0,
  gedScores,
  calculateSectionScore,
  calculateScore,
  totalQuestions,
  answeredCount,
  onGoHome,
  onReview,
}: ResultsScreenProps) {

  const satBand = isSat ? getSatReadinessBand(satCorrectCount) : null;

  const isPerfect = isGed
    ? Number(gedScores?.overall ?? 0) === 100
    : Number(calculateScore().combined) === 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">

      {/* ── Badge + Title ── */}
      <div className="text-center mb-8">
        <span className="inline-block bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Quiz Complete 🎉
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">Your Results</h1>
        <p className="text-sm text-gray-400 font-semibold mt-1">
          {isGed
            ? "Here's how you did across each GED section"
            : isSat
            ? "Here's how you did across each SAT section"
            : "Here's how you did across each section"}
        </p>
      </div>

      {/* ── Answered counter ── */}
      <p className="text-center font-medium text-xl text-gray-600 mb-6">
        {answeredCount} of {totalQuestions} questions answered
      </p>

      {/* ════════════════════════════════════════════════════
          NEW — GED score cards (4 sections)
          ════════════════════════════════════════════════════ */}
      {isGed && gedScores ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { key: "math",    label: "Math",             emoji: "🔢", score: gedScores.math,    colorClass: "text-indigo-600", barClass: "bg-indigo-500", bgClass: "bg-indigo-50" },
              { key: "rla",     label: "RLA",               emoji: "📖", score: gedScores.rla,     colorClass: "text-emerald-600", barClass: "bg-emerald-500", bgClass: "bg-emerald-50" },
              { key: "science", label: "Science",           emoji: "🔬", score: gedScores.science, colorClass: "text-amber-600", barClass: "bg-amber-500", bgClass: "bg-amber-50" },
              { key: "social",  label: "Social Studies",    emoji: "🌍", score: gedScores.social,  colorClass: "text-violet-600", barClass: "bg-violet-500", bgClass: "bg-violet-50" },
            ].map(({ key, label, emoji, score, colorClass, barClass, bgClass }) => (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
                <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center text-xl mx-auto mb-3`}>{emoji}</div>
                <p className={`text-xs font-extrabold uppercase tracking-widest ${colorClass} mb-1`}>{label}</p>
                <p className={`text-3xl font-extrabold ${colorClass} leading-none`}>{score}%</p>
                <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${barClass}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Overall + proficiency band */}
          {(() => {
            const overall = Number(gedScores.overall);
            const band = getGedBand(overall);
            return (
              <div className="border rounded-2xl px-6 py-4 mb-8 text-center bg-gray-50 border-gray-200">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                  Overall GED Readiness
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mb-1">{gedScores.overall}%</p>
                <p className={`text-sm font-bold ${band.colorClass}`}>{band.label}</p>
              </div>
            );
          })()}
        </>

      ) : isSat ? (
        /* ════════════════════════════════════════════════════
           SAT score cards (unchanged)
           ════════════════════════════════════════════════════ */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 cursor-pointer">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 mb-1">Mathematics</p>
              {satReadingScore != null ? (
                <>
                  <p className="text-4xl font-extrabold text-emerald-600 leading-none">{satReadingScore}%</p>
                  <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${satReadingScore}%` }} />
                  </div>
                </>
              ) : <p className="text-lg font-bold text-gray-400 mt-1">—</p>}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-1">Reading and Writing</p>
              {satMathScore != null ? (
                <>
                  <p className="text-4xl font-extrabold text-indigo-600 leading-none">{satMathScore}%</p>
                  <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${satMathScore}%` }} />
                  </div>
                </>
              ) : <p className="text-lg font-bold text-gray-400 mt-1">—</p>}
            </div>
          </div>

          {satBand && (
            <div className={`border rounded-2xl px-6 py-4 mb-8 text-center ${satBand.bgClass}`}>
              <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                SAT Readiness · {satCorrectCount} / 20 correct
              </p>
              <p className={`text-2xl font-extrabold mb-1 ${satBand.colorClass}`}>{satBand.label}</p>
              <p className={`text-sm font-medium ${satBand.colorClass}`}>{satBand.desc}</p>
            </div>
          )}
        </>

      ) : isGrade9Or10 ? (
        /* ════════════════════════════════════════════════════
           Grade 1–10 section score cards (unchanged)
           ════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 cursor-pointer">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-1">Math</p>
            <p className="text-4xl font-extrabold text-indigo-600 leading-none">{calculateSectionScore("math")}%</p>
            <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${calculateSectionScore("math")}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 mb-1">ELA</p>
            {calculateSectionScore("ela") !== null ? (
              <>
                <p className="text-4xl font-extrabold text-emerald-600 leading-none">{calculateSectionScore("ela")}%</p>
                <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${calculateSectionScore("ela")}%` }} />
                </div>
              </>
            ) : <p className="text-lg font-bold text-gray-400 mt-1">Skipped</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mx-auto mb-3">🔬</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-500 mb-1">Science</p>
            {calculateSectionScore("science") !== null ? (
              <>
                <p className="text-4xl font-extrabold text-amber-600 leading-none">{calculateSectionScore("science")}%</p>
                <div className="mt-3 h-1.5 rounded-full bg-amber-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${calculateSectionScore("science")}%` }} />
                </div>
              </>
            ) : <p className="text-lg font-bold text-gray-400 mt-1">Skipped</p>}
          </div>
        </div>

      ) : (
        /* ── Combined score for non-grade quizzes (unchanged) ── */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2">Overall Score</p>
          <p className="text-6xl font-extrabold text-indigo-600">
            {Number(calculateScore().combined).toFixed(2)}%
          </p>
          <div className="mt-4 h-2 rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Number(calculateScore().combined)}%` }} />
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="text-center">
        {isPerfect ? (
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={onGoHome}>
            🏠 Back to Home
          </button>
        ) : (
          <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={onReview}>
            📝 Review Test
          </button>
        )}
      </div>

    </div>
  );
}