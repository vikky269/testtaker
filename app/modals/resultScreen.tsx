// app/components/ResultsScreen.tsx
// Post-submission results UI — score cards, progress bars, action buttons

interface ResultsScreenProps {
  isGrade9Or10: boolean;
  calculateSectionScore: (section: "math" | "ela" | "science") => string | null;
  calculateScore: () => { combined?: string; mathScore?: string; elaScore?: string; combinedScore?: string };
  totalQuestions: number;
  answeredCount: number;
  onGoHome: () => void;
  onReview: () => void;
}

export default function ResultsScreen({
  isGrade9Or10,
  calculateSectionScore,
  calculateScore,
  totalQuestions,
  answeredCount,
  onGoHome,
  onReview,
}: ResultsScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">

      {/* ── Badge + Title ── */}
      <div className="text-center mb-8">
        <span className="inline-block bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Quiz Complete 🎉
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">Your Results</h1>
        <p className="text-sm text-gray-400 font-semibold mt-1">
          Here&apos;s how you did across each section
        </p>
      </div>

      {/* ── Answered counter ── */}
      <p className="text-center font-medium text-xl text-gray-600 mb-6">
        {answeredCount} of {totalQuestions} questions answered
      </p>

      {/* ── Section score cards (grade quizzes) ── */}
      {isGrade9Or10 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 cursor-pointer">

          {/* Math */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-1">Math</p>
            <p className="text-4xl font-extrabold text-indigo-600 leading-none">
              {calculateSectionScore("math")}%
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${calculateSectionScore("math")}%` }} />
            </div>
          </div>

          {/* ELA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 mb-1">ELA</p>
            {calculateSectionScore("ela") !== null ? (
              <>
                <p className="text-4xl font-extrabold text-emerald-600 leading-none">
                  {calculateSectionScore("ela")}%
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${calculateSectionScore("ela")}%` }} />
                </div>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-400 mt-1">Skipped</p>
            )}
          </div>

          {/* Science */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mx-auto mb-3">🔬</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-500 mb-1">Science</p>
            {calculateSectionScore("science") !== null ? (
              <>
                <p className="text-4xl font-extrabold text-amber-600 leading-none">
                  {calculateSectionScore("science")}%
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-amber-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${calculateSectionScore("science")}%` }} />
                </div>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-400 mt-1">Skipped</p>
            )}
          </div>

        </div>
      ) : (
        /* ── Combined score for non-grade quizzes ── */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2">Overall Score</p>
          <p className="text-6xl font-extrabold text-indigo-600">
            {Number(calculateScore().combined).toFixed(2)}%
          </p>
          <div className="mt-4 h-2 rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${Number(calculateScore().combined)}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="text-center">
        {Number(calculateScore().combined) === 100 ? (
          <button
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={onGoHome}
          >
            🏠 Back to Home
          </button>
        ) : (
          <button
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={onReview}
          >
            📝 Review Test
          </button>
        )}
      </div>

    </div>
  );
}