// UI upgraded: polished cards, modal redesign, full mobile responsiveness

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Star, Lock, ChevronRight, X } from "lucide-react";
import { quizData, QuizCardProps } from "../../data/mockdata";
import { Lato } from "next/font/google";
import { FaChild, FaSchool, FaGraduationCap, FaBook } from "react-icons/fa";

const lato = Lato({ subsets: ["latin"], variable: "--font-lato", weight: ["400", "700"] });

const stateOptions       = ["New York", "New Jersey", "Georgia", "Texas", "Maryland", "Ohio"];
const gradeOptions       = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
const quizassesmentOptions = [
  "Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade",
  "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade",
  "11th Grade", "12th Grade", "SSAT", "ALGEBRA 1", "GEOMETRY", "ALGEBRA 2", "SAT",
];

function generatePasscode(grade: string): string {
  let normalized = grade.toLowerCase().trim().replace(/\s+/g, "-");
  if (normalized === "year-7")     return "SMTT7";
  if (normalized === "algebra-1")  return "SMTTA1";
  if (normalized === "algebra-2")  return "SMTTA2";
  if (normalized === "kindergarten") return "SMTTK";
  if (normalized === "pre-k")      return "SMTTPK";
  if (normalized === "sat")        return "SMTTS";
  if (normalized === "ssat")       return "SMTTSS";
  if (normalized === "geometry")   return "SMTTG";
  const match = normalized.match(/(\d+)/);
  return match ? `SMTT${match[1]}` : "";
}

function getGradeIcon(grade: string) {
  const g = grade.toLowerCase();
  if (g.includes("pre") || g.includes("1st") || g.includes("2nd"))
    return <FaChild className="text-base" />;
  if (g.includes("6th") || g.includes("7th") || g.includes("8th") || g.includes("year 7"))
    return <FaSchool className="text-base" />;
  if (g.includes("9th") || g.includes("10th") || g.includes("11th") || g.includes("12th"))
    return <FaGraduationCap className="text-base" />;
  return <FaBook className="text-base" />;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-700",
};

// ── Quiz Card ────────────────────────────────────────────────
function QuizCard({ id, imageSrc, title, level, category,  time, questions }: QuizCardProps) {
  const [selectedTest, setSelectedTest]     = useState<string | null>(null);
  const [isStateTest, setIsStateTest]       = useState(false);
  const [isQuizAssessment, setIsQuizAssessment] = useState(false);
  const [selectedState, setSelectedState]   = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade]   = useState<string | null>(null);
  const [step, setStep]                     = useState<1 | 2 | 3>(1);
  const [passcodeInput, setPasscodeInput]   = useState("");
  const [passcodeError, setPasscodeError]   = useState("");
  const router = useRouter();

  const handleTestClick = (testId: string) => {
    if (testId === "state-test") {
      setIsStateTest(true); setIsQuizAssessment(false); setStep(1);
    } else if (testId === "quiz-assessment") {
      setIsQuizAssessment(true); setIsStateTest(false); setStep(2);
    } else {
      setIsStateTest(false); setIsQuizAssessment(false);
    }
    setSelectedTest(testId);
  };

  const validatePasscodeAndStart = () => {
    if (!selectedGrade) return;
    const expected = generatePasscode(selectedGrade);
    if (passcodeInput.trim().toUpperCase() === expected) {
      const gradeSlug = selectedGrade.toLowerCase().replace(/\s+/g, "-");
      const stateSlug = selectedState?.toLowerCase().replace(/\s+/g, "-");
      router.push(
        isStateTest
          ? `/quiz/state-test?state=${stateSlug}&grade=${gradeSlug}`
          : `/quiz/quiz-assessment?grade=${gradeSlug}`
      );
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  const resetSelection = () => {
    setSelectedTest(null); setIsStateTest(false); setIsQuizAssessment(false);
    setSelectedState(null); setSelectedGrade(null);
    setPasscodeInput(""); setPasscodeError(""); setStep(1);
  };

  const handleStartTest = () => {
    if (isStateTest && selectedState && selectedGrade) {
      router.push(`/quiz/state-test?state=${selectedState.toLowerCase().replace(/\s/g, "-")}&grade=${selectedGrade.toLowerCase().replace(" ", "-")}`);
    } else if (isQuizAssessment && selectedGrade) {
      router.push(`/quiz/quiz-assessment?grade=${selectedGrade.toLowerCase().replace(" ", "-")}`);
    } else if (!isStateTest && !isQuizAssessment && selectedTest) {
      router.push(`/quiz/${selectedTest}`);
    }
  };

 // const diffCls = DIFFICULTY_COLOR[difficulty] ?? "bg-gray-100 text-gray-600";

  return (
    <>
      {/* ── Card ── */}
      <div className="cursor-pointer group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm
                      hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">

        {/* Cover image */}
        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          {/* Difficulty badge */}
          {/* <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${diffCls}`}>
            {difficulty}
          </span> */}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">{title}</h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#7FB509]" />{level}
            </span>
            <span className="text-gray-300">|</span>
            <span>{category}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />{time}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />{questions} Questions
            </span>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* CTA */}
          <button
            onClick={() => handleTestClick(id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold
                       border-2 border-[#7FB509] text-[#7FB509] rounded-xl
                       hover:bg-[#7FB509] hover:text-white transition-all duration-200 cursor-pointer"
          >
            Start Quiz <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`bg-white rounded-3xl shadow-2xl w-full transition-all duration-300 max-h-[90vh] overflow-y-auto
                          ${step === 2 ? "max-w-4xl" : "max-w-md"}`}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    onClick={() => step === 2 ? (isStateTest ? setStep(1) : resetSelection()) : setStep(2)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors text-gray-500 mr-1"
                  >
                    ←
                  </button>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7FB509]">
                    Step {step} of {isStateTest || isQuizAssessment ? 3 : 1}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900">
                    {step === 1 ? "Select State" : step === 2 ? "Select Grade" : "Enter Passcode"}
                  </h2>
                </div>
              </div>
              <button onClick={resetSelection} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5">

              {/* ── Step 1: State ── */}
              {step === 1 && isStateTest && (
                <div>
                  <p className="text-sm text-gray-500 mb-4">Choose the state for your practice test.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                    {stateOptions.map((state) => (
                      <button
                        key={state}
                        onClick={() => setSelectedState(state)}
                        className={`py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-150
                          ${selectedState === state
                            ? "bg-[#7FB509] text-white border-[#7FB509] shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#7FB509] hover:text-[#7FB509]"
                          }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => selectedState && setStep(2)}
                    disabled={!selectedState}
                    className="w-full py-3 text-sm font-bold rounded-xl cursor-pointer transition-all duration-150
                               bg-[#7FB509] hover:bg-[#6b970a] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* ── Step 2: Grade ── */}
              {step === 2 && (
                <div>
                  <p className="text-sm text-gray-500 mb-4">Choose your grade level to continue.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-6">
                    {(isStateTest ? gradeOptions : quizassesmentOptions).map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-sm font-semibold
                                    cursor-pointer transition-all duration-150 hover:scale-[1.02]
                          ${selectedGrade === grade
                            ? "bg-[#7FB509] text-white border-[#7FB509] shadow-md"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#7FB509] hover:bg-green-50"
                          }`}
                      >
                        {getGradeIcon(grade)}
                        <span className="truncate">{grade}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => selectedGrade && setStep(3)}
                    disabled={!selectedGrade}
                    className="w-full py-3 text-sm font-bold rounded-xl cursor-pointer transition-all duration-150
                               bg-[#7FB509] hover:bg-[#6b970a] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* ── Step 3: Passcode ── */}
              {step === 3 && (
                <div className="flex flex-col items-center text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                    <Lock className="w-7 h-7 text-[#7FB509]" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Passcode required for</p>
                  <p className="text-xl font-bold text-gray-900 mb-6">{selectedGrade}</p>

                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => { setPasscodeInput(e.target.value); setPasscodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && validatePasscodeAndStart()}
                    placeholder="Enter passcode"
                    className="w-full text-center text-lg font-bold tracking-widest py-3 px-4 rounded-xl
                               border-2 border-gray-200 focus:border-[#7FB509] focus:outline-none
                               focus:ring-2 focus:ring-[#7FB509]/20 transition-all"
                  />
                  {passcodeError && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{passcodeError}</p>
                  )}

                  <button
                    onClick={validatePasscodeAndStart}
                    disabled={!passcodeInput}
                    className="w-full mt-5 py-3 text-sm font-bold rounded-xl cursor-pointer transition-all
                               bg-[#7FB509] hover:bg-[#6b970a] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Start Test
                  </button>
                </div>
              )}

              {/* ── Direct start (non-assessment tests) ── */}
              {!isStateTest && !isQuizAssessment && (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm mb-6">
                    Ready to take the{" "}
                    <span className="font-bold text-gray-900">
                      {quizData.find((t) => t.id === selectedTest)?.title}
                    </span>{" "}
                    test?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={resetSelection}
                      className="flex-1 py-3 text-sm font-bold border border-gray-200 text-gray-600
                                 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartTest}
                      className="flex-1 py-3 text-sm font-bold bg-[#7FB509] hover:bg-[#6b970a]
                                 text-white rounded-xl cursor-pointer transition-colors"
                    >
                      Start Test
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Grid ─────────────────────────────────────────────────────
export default function QuizCardGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {quizData.map((quiz, index) => (
          <QuizCard key={index} {...quiz} />
        ))}
      </div>
    </div>
  );
}