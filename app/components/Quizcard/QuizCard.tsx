//MODIFIED COMPONENT - passcode validation added for Quiz Assessment and State Test

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, FileText, Star } from 'lucide-react'
import { quizData, QuizCardProps } from "../../data/mockdata"
import { Lato } from 'next/font/google'
import { FaChild, FaSchool, FaGraduationCap, FaBook } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const lato = Lato({
  subsets: ['latin'], 
  variable: '--font-lato',
  weight: ['400', '700'], 
})

const stateOptions = ["New York", "New Jersey", "Georgia", "Texas", "Maryland", "Ohio"];
const gradeOptions = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
const quizassesmentOptions = ["Pre-K","Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "SSAT", "ALGEBRA 1", "GEOMETRY", "ALGEBRA 2", "SAT",];



function generatePasscode(grade: string): string {
  let normalized = grade.toLowerCase().trim();

  // Normalize spaces
  normalized = normalized.replace(/\s+/g, "-");

  // Special normalization for Year 7
  if (normalized === "year-7") {
    normalized = "7th-year";
    return "SMTT7";
  }

  // Normalize algebra formats
  if (normalized === "algebra-1") return "SMTTA1";
  if (normalized === "algebra-2") return "SMTTA2";

  // Other special cases
  if (normalized === "kindergarten") return "SMTTK";
  if (normalized === "pre-k") return "SMTTPK";
  if (normalized === "sat") return "SMTTS";
  if (normalized === "ssat") return "SMTTSS";
  if (normalized === "geometry") return "SMTTG";

  // Match numeric grades (1st, 2nd, 7th, etc)
  const match = normalized.match(/(\d+)/);
  return match ? `SMTT${match[1]}` : "";
}


function QuizCard({ id, imageSrc, title, level, category, difficulty, time, questions }: QuizCardProps) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isStateTest, setIsStateTest] = useState(false);
  const [isQuizAssessment, setIsQuizAssessment] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const router = useRouter();

  const handleTestClick = (testId: string) => {
    if (testId === "state-test") {
      setIsStateTest(true);
      setIsQuizAssessment(false);
      setStep(1);
    } else if (testId === "quiz-assessment") {
      setIsQuizAssessment(true);
      setIsStateTest(false);
      setStep(2);
    } else {
      setIsStateTest(false);
      setIsQuizAssessment(false);
    }
    setSelectedTest(testId);
  };

  const validatePasscodeAndStart = () => {
    if (!selectedGrade) return;
    const expected = generatePasscode(selectedGrade);
    if (passcodeInput.trim().toUpperCase() === expected) {
      const gradeSlug = selectedGrade.toLowerCase().replace(/\s+/g, "-");
      const stateSlug = selectedState?.toLowerCase().replace(/\s+/g, "-");
      const path = isStateTest
        ? `/quiz/state-test?state=${stateSlug}&grade=${gradeSlug}`
        : `/quiz/quiz-assessment?grade=${gradeSlug}`;
      router.push(path);
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  const resetSelection = () => {
    setSelectedTest(null);
    setIsStateTest(false);
    setIsQuizAssessment(false);
    setSelectedState(null);
    setSelectedGrade(null);
    setPasscodeInput("");
    setPasscodeError("");
    setStep(1);
  };


  const handleStartTest = () => {
    if (isStateTest && selectedState && selectedGrade) {
      const state = selectedState.toLowerCase().replace(/\s/g, "-");
      const grade = selectedGrade.toLowerCase().replace(" ", "-");
      router.push(`/quiz/state-test?state=${state}&grade=${grade}`);
    } else if (isQuizAssessment && selectedGrade) {
      const grade = selectedGrade.toLowerCase().replace(" ", "-");
      router.push(`/quiz/quiz-assessment?grade=${grade}`);
    } else if (!isStateTest && !isQuizAssessment && selectedTest) {
      router.push(`/quiz/${selectedTest}`);
    }

  };


  return (
    <Card className="rounded-2xl overflow-hidden shadow-md w-92 px-3 cursor-pointer min-h-[420px]">
      <div className="relative h-40 w-full mt-[-.5rem]">
        <Image src={imageSrc} alt="Quiz Cover" fill className="object-cover rounded-[7px] hover:scale-105 transition-transform duration-300" priority />
      </div>
      <CardContent className="px-1 py-6 space-y-2 flex flex-col justify-between flex-grow mt-[-2rem]">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex flex-wrap text-sm text-gray-600 gap-x-2">
          <div className="flex items-center gap-1"><Star className="h-4 w-4 text-green-500" /><span>{level}</span></div>
          <span className="mx-1">|</span>
          <span>{category}</span>
          <span className="mx-1">|</span>
          <span>{difficulty}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm gap-x-4">
          <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{time}</span></div>
          <div className="flex items-center gap-1"><FileText className="h-4 w-4" /><span>{questions} Questions</span></div>
        </div>

        {selectedTest && (
          <div className="fixed  bottom-0 right-0 inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 z-50">
            <div  className={`bg-white p-8 rounded-2xl shadow-2xl w-full transition-all duration-300 ${step === 2 ? "md:max-w-6xl" : "max-w-md"}`}>
              {step === 1 && isStateTest && (
                <>
                  <p className="font-bold mb-4">Select your state:</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {stateOptions.map((state) => (
                      <button key={state} onClick={() => setSelectedState(state)} className={`p-2 border rounded ${selectedState === state ? "bg-blue-600 text-white" : ""}`}>{state}</button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button className="cursor-pointer" onClick={() => selectedState && setStep(2)} disabled={!selectedState}>Next</Button>
                    <Button className="cursor-pointer" onClick={resetSelection}>Back</Button>
                  </div>
                </>
              )}

             
             {step === 2 && (
                <>
              
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Select Your Grade
                    </h2>
                    <p className="text-gray-500">
                      Choose your level to continue
                    </p>
                  </div>

                  <div className="grid max-sm:grid-cols-1 grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {(isStateTest ? gradeOptions : quizassesmentOptions).map((grade) => {

                      const getIcon = () => {
                        if (grade.toLowerCase().includes("pre") || grade.includes("1st") || grade.includes("2nd"))
                          return <FaChild />;
                        if (grade.includes("6th") || grade.includes("7th") || grade.includes("8th") || grade.includes("Year 7"))
                          return <FaSchool />;
                        if (grade.includes("9th") || grade.includes("10th") || grade.includes("11th") || grade.includes("12th"))
                          return <FaGraduationCap />;
                        return <FaBook />;
                      };

                      return (
                        <button
                          key={grade}
                          onClick={() => setSelectedGrade(grade)}
                          className={`
              p-4 rounded-xl border transition-all duration-200 
              flex items-center justify-center gap-2
              hover:scale-105 cursor-pointer
              ${selectedGrade === grade
                              ? "bg-[#7FB509] text-white border-[#7FB509] shadow-md"
                              : "bg-gray-50 border-gray-200 hover:bg-green-50"
                            }
            `}
                        >
                          <span className="text-lg">{getIcon()}</span>
                          <span className="font-medium">{grade}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between">
                    {isStateTest && (
                      <Button
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                    )}

                    {!isStateTest && (
                      <Button
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={resetSelection}
                      >
                        Back
                      </Button>
                    )}

                    <Button
                      className={`
          cursor-pointer transition-all
          ${selectedGrade
                          ? "bg-[#7FB509] hover:bg-[#689703] text-white"
                          : "bg-green-200 text-white cursor-not-allowed"
                        }
        `}
                      onClick={() => selectedGrade && setStep(3)}
                      disabled={!selectedGrade}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}


              {step === 3 && (
                <div className="flex flex-col items-center text-center">
                  <FaLock className="text-3xl text-[#7FB509] mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Enter Test Passcode
                  </h2>

                  <p className="text-gray-800 mb-6 text-3xl">
                    Grade: <span className="font-bold text-3xl text-[#7FB509]">{selectedGrade}</span>
                  </p>

                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter your passcode"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7FB509] focus:border-[#7FB509]transition"
                  />

                  {passcodeError && (
                    <p className="text-red-500 text-sm mt-2">
                      {passcodeError}
                    </p>
                  )}

                  <div className="flex w-full justify-between mt-8">

                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 cursor-pointer"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>

                    <Button
                      className={`px-6 cursor-pointer transition-all${passcodeInput ? "bg-[#7FB509] hover:bg-[#689703] text-white": "bg-green-200 text-white cursor-not-allowed"}`}
                      onClick={validatePasscodeAndStart}
                      disabled={!passcodeInput}
                    >
                      Start Test
                    </Button>

                  </div>
                </div>
              )}


              {(!isStateTest && !isQuizAssessment) && (
                <div className="text-center p-10">
                  <p>
                    Ready to take the{" "}
                    <span className="font-semibold">{quizData.find((test) => test.id === selectedTest)?.title}</span>{" "}
                    test?
                  </p>
                  <div className="mt-8 flex justify-between">
                    <button className="p-2 cursor-pointer bg-red-600 text-white rounded-lg mr-5" onClick={resetSelection}>
                      Cancel
                    </button>
                    <button className="py-2 px-4 cursor-pointer bg-green-600 text-white rounded-lg" onClick={handleStartTest}>
                      Start
                    </button>
                  </div>
                </div>

              )}

             
            </div>
          </div>
         )}

      <hr className='shadow inset-2'></hr>

        <Button
          variant="outline"
          className="w-full  border-[#7FB509] text-[#7FB509] mt-2 cursor-pointer font-lato font-bold text-lg hover:bg-[#7FB509] hover:text-white transition-colors duration-300"
          onClick={() => handleTestClick(id)}
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}


export default function QuizCardGrid() {
  return (
  <div className="max-sm:px-12 grid grid-cols-1 justify-center items-center gap-5 md:justify-center md:items-center md:grid-cols-1 md:gap-8 md:p-12 lg:grid-cols-2 lg:space-x-16 xl:grid-cols-3 2xl:grid-cols-4  xl:gap-12 2xl:gap-16 mt-12">
      {quizData.map((quiz, index) => (
        <QuizCard key={index} {...quiz} />
      ))}
    </div>
  )
}
