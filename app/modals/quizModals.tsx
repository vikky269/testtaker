// app/components/QuizModals.tsx
// All 6 modal dialogs used during the quiz — rendered from page.tsx

interface QuizModalsProps {
  unansweredCount: number;

  // Visibility flags
  showConfirmModal: boolean;         // Math section — unanswered warning
  showConfirmElaModal: boolean;      // ELA section — unanswered warning
  showConfirmSubmissionModal: boolean; // Science section — unanswered warning
  showGradeModal: boolean;           // Math complete → offer ELA
  showScienceModal: boolean;         // ELA complete → offer Science
  showSatModal: boolean;             // SAT reading complete → offer Math

  // Handlers
  onCancelConfirm: () => void;
  onConfirmMathSubmit: () => void;
  onCancelElaConfirm: () => void;
  onConfirmElaSubmit: () => void;
  onCancelSubmission: () => void;
  onConfirmFinalSubmit: () => void;
  onSkipEla: () => void;
  onTakeEla: () => void;
  onTakeScience: () => void;
  onContinueMath: () => void;
}

export default function QuizModals({
  unansweredCount,
  showConfirmModal,
  showConfirmElaModal,
  showConfirmSubmissionModal,
  showGradeModal,
  showScienceModal,
  showSatModal,
  onCancelConfirm,
  onConfirmMathSubmit,
  onCancelElaConfirm,
  onConfirmElaSubmit,
  onCancelSubmission,
  onConfirmFinalSubmit,
  onSkipEla,
  onTakeEla,
  onTakeScience,
  onContinueMath,
}: QuizModalsProps) {
  return (
    <>
      {/* ── Math: unanswered warning before ELA ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Unanswered Questions</h2>
            <p className="mb-4 text-gray-700">
              You have <strong>{unansweredCount}</strong> unanswered question
              {unansweredCount > 1 ? "s" : ""}. Are you sure you want to submit and move to ELA?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={onCancelConfirm} className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer">
                Cancel
              </button>
              <button onClick={onConfirmMathSubmit} className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ELA: unanswered warning before Science ── */}
      {showConfirmElaModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Unanswered Questions</h2>
            <p className="mb-4 text-gray-700">
              You have <strong>{unansweredCount}</strong> unanswered question
              {unansweredCount > 1 ? "s" : ""}. Are you sure you want to submit and move to Science?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={onCancelElaConfirm} className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer">
                Cancel
              </button>
              <button onClick={onConfirmElaSubmit} className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Science: unanswered warning before final submit ── */}
      {showConfirmSubmissionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Unanswered Questions</h2>
            <p className="mb-4 text-gray-700">
              You have <strong>{unansweredCount}</strong> unanswered question
              {unansweredCount > 1 ? "s" : ""}. Are you sure you want to submit and end the evaluation?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={onCancelSubmission} className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer">
                Cancel
              </button>
              <button onClick={onConfirmFinalSubmit} className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Math complete → offer ELA ── */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Math Section Complete</h2>
            <p className="mb-4">You&apos;ve finished the Math section. Would you like to continue with ELA?</p>
            <div className="flex justify-end gap-4">
              <button onClick={onSkipEla} className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer" disabled>
                Skip ELA
              </button>
              <button onClick={onTakeEla} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
                Take ELA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ELA complete → offer Science ── */}
      {showScienceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">ELA Section Complete</h2>
            <p className="mb-4">You&apos;ve finished ELA. Would you like to continue with Science?</p>
            <div className="flex justify-end gap-4">
              <button onClick={onTakeScience} className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded">
                Take Science
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAT: reading complete → offer Math ── */}
      {showSatModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Continue to Math Section</h2>
            <p className="mb-4">You have completed the Reading &amp; Verbal section. Ready to begin Math?</p>
            <div className="flex justify-end gap-4">
              <button onClick={onContinueMath} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
                Start Math Section
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}