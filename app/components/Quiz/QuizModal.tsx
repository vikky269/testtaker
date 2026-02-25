"use client";

interface QuizModalsProps {
  showConfirmModal: boolean;
  unansweredCount: number;
  onCancelConfirm: () => void;
  onConfirmSubmit: () => void;

  showSatModal: boolean;
  onContinueMath: () => void;

  showGradeModal: boolean;
  onSkipEla: () => void;
  onTakeEla: () => void;

  showScienceModal: boolean;
  onSkipScience: () => void;
  onTakeScience: () => void;
}

export default function QuizModals({
  showConfirmModal,
  unansweredCount,
  onCancelConfirm,
  onConfirmSubmit,

  showSatModal,
  onContinueMath,

  showGradeModal,
  onSkipEla,
  onTakeEla,

  showScienceModal,
  onSkipScience,
  onTakeScience,
}: QuizModalsProps) {
  return (
    <>
      {/* CONFIRM SUBMIT MODAL */}
      {showConfirmModal && (
        <ModalWrapper>
          <h2 className="text-lg font-semibold mb-4">
            Unanswered Questions
          </h2>
          <p className="mb-4 text-gray-700">
            You have <strong>{unansweredCount}</strong> unanswered
            question{unansweredCount > 1 ? "s" : ""}. Are you sure you
            want to submit?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancelConfirm}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Yes, Submit
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* SAT MODAL */}
      {showSatModal && (
        <ModalWrapper>
          <h2 className="text-xl font-bold mb-4">
            Continue to Math Section
          </h2>
          <p className="mb-4">
            You have completed the Reading & Verbal section. Ready to
            begin Math?
          </p>
          <div className="flex justify-end">
            <button
              onClick={onContinueMath}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Start Math Section
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* GRADE MODAL */}
      {showGradeModal && (
        <ModalWrapper>
          <h2 className="text-xl font-bold mb-4">
            Math Section Complete
          </h2>
          <p className="mb-4">
            You’ve finished the Math section. Would you like to continue
            with ELA?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onSkipEla}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Skip ELA
            </button>
            <button
              onClick={onTakeEla}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Take ELA
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* SCIENCE MODAL */}
      {showScienceModal && (
        <ModalWrapper>
          <h2 className="text-xl font-bold mb-4">
            ELA Section Complete
          </h2>
          <p className="mb-4">
            Would you like to continue to Science?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onSkipScience}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Skip Science
            </button>
            <button
              onClick={onTakeScience}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Take Science
            </button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}

/* REUSABLE WRAPPER */
function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        {children}
      </div>
    </div>
  );
}
