
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from 'next/image'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Clock, FileText, Star } from 'lucide-react'
// import { quizData, QuizCardProps } from "../../data/mockdata"
// import { Lato } from 'next/font/google'

// const lato = Lato({
//   subsets: ['latin'], 
//   variable: '--font-lato',
//   weight: ['400', '700'], 
// })

// const stateOptions = ["New York", "New Jersey", "Georgia", "Texas", "Maryland", "Ohio"];
// const gradeOptions = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
// const quizassesmentOptions = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"];

// function generatePasscode(grade: string): string {
//   const normalized = grade.toLowerCase().replace(" ", "");
//   if (normalized === "kindergarten") return "SMTTK";
//   if (normalized === "prekindergarten") return "SMTTPK";
//   const match = grade.match(/(\d+)/);
//   return match ? `SMTT${match[1]}` : "";
// }


// function QuizCard({ id, imageSrc, title, level, category, difficulty, time, questions, onStart,}: QuizCardProps) {

//   const [selectedTest, setSelectedTest] = useState<string | null>(null);
//   const [isStateTest, setIsStateTest] = useState(false);
//   const [isQuizAssessment, setIsQuizAssessment] = useState(false);
//   const [selectedState, setSelectedState] = useState<string | null>(null);
//   const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
//   const [step, setStep] = useState<1 | 2 | 3>(1);
//   const [passcodeInput, setPasscodeInput] = useState("");
//   const [passcodeError, setPasscodeError] = useState("");
  



//   const router = useRouter();

//   const handleTestClick = (testId: string) => {
//     if (testId === "state-test") {
//       setIsStateTest(true);
//       setIsQuizAssessment(false);
//       setSelectedTest(testId);
//       setStep(1); // Reset to first step
//     } else if (testId === "quiz-assessment") {
//       setIsQuizAssessment(true);
//       setIsStateTest(false);
//       setSelectedTest(testId);
//       setStep(1);
//     } else {
//       setIsStateTest(false);
//       setIsQuizAssessment(false);
//       setSelectedTest(testId);
//     }
//   };

//   const handleStartTest = () => {
//     if (isStateTest && selectedState && selectedGrade) {
//       const state = selectedState.toLowerCase().replace(/\s/g, "-");
//       const grade = selectedGrade.toLowerCase().replace(" ", "-");
//       router.push(`/quiz/state-test?state=${state}&grade=${grade}`);
//     } else if (isQuizAssessment && selectedGrade) {
//       const grade = selectedGrade.toLowerCase().replace(" ", "-");
//       router.push(`/quiz/quiz-assessment?grade=${grade}`);
//     } else if (!isStateTest && !isQuizAssessment && selectedTest) {
//       router.push(`/quiz/${selectedTest}`);
//     }

//   };

//   const resetSelection = () => {
//     setSelectedTest(null);
//     setIsStateTest(false);
//     setSelectedState(null);
//     setSelectedGrade(null);
//   };

//   return (
//     <Card className={`${lato.variable} flex flex-col justify-between rounded-2xl overflow-hidden shadow-md w-92  px-3 cursor-pointer min-h-[420px]`}>
//       <div className="relative h-40 w-full mt-[-.5rem]">
//         <Image
//           src={imageSrc}
//           alt="Quiz Cover"
//           fill
//           className="object-cover rounded-[7px] cursor-pointer hover:scale-105 transition-transform duration-300"
//           priority
//         />
//       </div>
//       <CardContent className="px-1 py-6 space-y-2 flex flex-col justify-between flex-grow mt-[-2rem] ">
//         <h3 className="text-lg font-semibold font-lato text-[#222222]">{title}</h3>
//         <div className="flex flex-wrap text-[16px] text-[#6E6E73] gap-x-2 font-lato">
//           <div className="flex items-center gap-1">
//             <Star className="h-4 w-4 text-green-500" />
//             <span>{level}</span>
//           </div>
//           <span className="mx-1">|</span>
//           <span>{category}</span>
//           <span className="mx-1">|</span>
//           <span>{difficulty}</span>
//         </div>
//         <div className="flex items-center text-gray-500 text-sm gap-x-4">
//           <div className="flex items-center gap-1">
//             <Clock className="h-4 w-4" />
//             <span>{time}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <FileText className="h-4 w-4" />
//             <span>{questions} Questions</span>
//           </div>
//         </div>

//         {selectedTest && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl text-center w-[1200px] flex flex-col flex-wrap">
//               {isStateTest || isQuizAssessment ? (
//                 <>
//                   <p className="font-semibold mb-3">Select your grade{isStateTest ? " and state" : ""}:</p>

//                   {isStateTest && step === 1 && (
//                     <>
//                       <div className="space-y-2 mb-4">
//                         {stateOptions.map((state) => (
//                           <button
//                             key={state}
//                             className={`block w-full p-2 border rounded-md cursor-pointer ${selectedState === state ? "bg-blue-600 text-white font-semibold" : ""}`}
//                             onClick={() => setSelectedState(state)}
//                           >
//                             {state}
//                           </button>
//                         ))}
//                       </div>
//                       <button
//                         className="py-2 px-8 bg-blue-600 text-white rounded-lg disabled:opacity-50"
//                         onClick={() => setStep(2)}
//                         disabled={!selectedState}
//                       >
//                         Next
//                       </button>
//                     </>
//                   )}

//                   {(isQuizAssessment || step === 2) && (
//                     <>
//                       {/* <p className="font-semibold mb-3">Select your grade:</p> */}
//                       <div className="flex flex-col md:flex-row gap-2 p-6 text-center">
//                         {(isStateTest ? gradeOptions : quizassesmentOptions).map((grade) => (
//                           <button
//                             key={grade}
//                             className={`block w-full p-2 border rounded-md cursor-pointer ${selectedGrade === grade ? "bg-blue-600 text-white font-semibold" : ""}`}
//                             onClick={() => setSelectedGrade(grade)}
//                           >
//                             {grade}
//                           </button>
//                         ))}
//                       </div>

//                       {isStateTest && (
//                         <div className="mt-6 flex justify-between">
//                           <button
//                             className="py-2 px-6 bg-gray-400 text-white rounded-lg cursor-pointer"
//                             onClick={() => setStep(1)}
//                           >
//                             Prev
//                           </button>
//                           <button
//                             className="py-2 px-6 bg-green-600 text-white rounded-lg disabled:opacity-50"
//                             onClick={handleStartTest}
//                             disabled={!selectedGrade}
//                           >
//                             Start
//                           </button>
//                         </div>
//                       )}

//                       {isQuizAssessment && (
//                         <div className="mt-4 flex justify-around items-center">
//                           <button
//                             className="py-2 px-6 bg-green-600 text-white cursor-pointer rounded-lg disabled:opacity-50"
//                             onClick={handleStartTest}
//                             disabled={!selectedGrade}
//                           >
//                             Start
//                           </button>

//                           <button className="p-2 cursor-pointer bg-red-600 text-white rounded-lg mr-5" onClick={resetSelection}>
//                             Cancel
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </>
//               )
//                 : (
//                   <>
//                     <p>
//                       Ready to take the{" "}
//                       <span className="font-semibold">{quizData.find((test) => test.id === selectedTest)?.title}</span>{" "}
//                       test?
//                     </p>
//                     <div className="mt-4">
//                       <button className="p-2 cursor-pointer bg-red-600 text-white rounded-lg mr-5" onClick={resetSelection}>
//                         Cancel
//                       </button>
//                       <button className="py-2 px-4 cursor-pointer bg-green-600 text-white rounded-lg" onClick={handleStartTest}>
//                         Start
//                       </button>
//                     </div>
//                   </>
//                 )}
//             </div>
//           </div>
//         )}

//         <hr className='shadow inset-3'></hr>

//         <Button
//           variant="outline"
//           className="w-full  border-[#7FB509] text-[#7FB509] mt-2 cursor-pointer font-lato font-bold text-lg hover:bg-[#7FB509] hover:text-white transition-colors duration-300"
//           //onClick={onStart}
//           onClick={() => handleTestClick(id)}
//         >
//           Start Quiz
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }


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

const lato = Lato({
  subsets: ['latin'], 
  variable: '--font-lato',
  weight: ['400', '700'], 
})

const stateOptions = ["New York", "New Jersey", "Georgia", "Texas", "Maryland", "Ohio"];
const gradeOptions = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
const quizassesmentOptions = ["Pre-K","Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"];

function generatePasscode(grade: string): string {
  const normalized = grade.toLowerCase().replace(" ", "");
  if (normalized === "kindergarten") return "SMTTK";
  if (normalized === "pre-k") return "SMTTPK";
  const match = grade.match(/(\d+)/);
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
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
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
                  <p className="font-bold mb-4">Select your grade:</p>
                  <div className="grid max-sm:grid-cols-1 grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {(isStateTest ? gradeOptions : quizassesmentOptions).map((grade) => (
                      <button key={grade} onClick={() => setSelectedGrade(grade)} className={`p-2 cursor-pointer border rounded ${selectedGrade === grade ? "bg-blue-600 text-white" : ""}`}>{grade}</button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    {isStateTest && <Button className="cursor-pointer" onClick={() => setStep(1)}>Back</Button>}
                    {!isStateTest && <Button className="cursor-pointer"  onClick={resetSelection}>Back</Button>}
                    <Button className="cursor-pointer" onClick={() => selectedGrade && setStep(3)} disabled={!selectedGrade}>Next</Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <p className="font-bold mb-2">Enter Passcode for {selectedGrade}:</p>
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder=""
                  />
                  {passcodeError && <p className="text-red-500 text-sm mb-2">{passcodeError}</p>}
                  <div className="flex justify-between">
                    <Button className="cursor-pointer bg-black text-white"  onClick={() => setStep(2)}>Back</Button>
                    <Button className="cursor-pointer" onClick={validatePasscodeAndStart} disabled={!passcodeInput}>Start Test</Button>
                  </div>
                </>
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
  <div className="grid grid-cols-1 justify-center items-center gap-5  md:grid-cols-1 md:gap-8 md:p-12 lg:grid-cols-2 lg:space-x-16 xl:grid-cols-3 2xl:grid-cols-4  xl:gap-12 2xl:gap-16 mt-12">
      {quizData.map((quiz, index) => (
        <QuizCard key={index} {...quiz} />
      ))}
    </div>
  )
}
