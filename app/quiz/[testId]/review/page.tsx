// "use client";

// import { useQuiz } from "@/app/context/QuizContext";
// import { useParams } from "next/navigation";
// import quizData from "@/app/data/quizdata";
// import standardsData from "@/app/data/statetestdata";
// import { useRouter } from "next/navigation";

// export default function ReviewPage() {
//   const { answers } = useQuiz();
//   const { testId } = useParams();
//   const router = useRouter()

//   // Ensure testId exists in quizData
//  const selectedQuiz =
//   testId && (quizData[testId as string] || standardsData[testId as string]);

//   if (!selectedQuiz || !Array.isArray(selectedQuiz) || selectedQuiz.length === 0) {
//     return <p>Loading quiz data...</p>;
//   }

//   const handleFinishReview = () => {
//     router.push("/")
//   }

//   // Calculate the user's score
//   const correctAnswersCount = selectedQuiz.filter(q => answers?.[q.question] === q.answer).length;
//   const totalQuestions = selectedQuiz.length;
//   const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2); // Show 2 decimal places

//   return (
//     <div className="container mx-auto p-5">
//       <h1 className="text-center text-2xl font-bold">Review Test</h1>
//       <p className="text-center text-gray-500">Test ID: {testId}</p>

//       {/* Score Section */}
//       <div className="text-center my-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
//         <h2 className="text-xl font-semibold text-blue-700">
//           Your Score: {score}%
//         </h2>
//         <p className="text-gray-600">
//           {correctAnswersCount} out of {totalQuestions} questions correct
//         </p>
//       </div>

//       {/* Questions Review */}
//       {selectedQuiz.map((questionData, index) => {
//         const selectedAnswer = answers?.[questionData.question]; // Get user's selected answer

//         return (
//           <div key={index} className="my-6 p-4 border rounded-lg shadow">
//             <p className="font-semibold mb-5">Question {index + 1}:</p>

//             {/* Check if question is an image */}
//             {questionData.question.startsWith("https://res.cloudinary.com") ? (
//               <img
//                 src={questionData.question}
//                 alt={`Question ${index + 1}`}
//                 className="w-full max-w-2xl mb-6 flex flex-1"
//               />
//             ) : (
//               <p className="font-bold mb-5">{questionData.question}</p>
//             )}

//             <ul className="grid grid-cols-2 gap-2 mt-2">
//               {questionData.options.map((option, i) => {
//                 const isCorrect = option === questionData.answer;
//                 const isSelected = option === selectedAnswer;
//                 return (
//                   <li
//                     key={i}
//                     className={`p-2 text-center border rounded-lg ${
//                       isCorrect ? "bg-green-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-gray-200"
//                     }`}
//                   >
//                     {option} {isSelected ? "(Your Answer)" : ""}
//                     {isCorrect ? " ✅" : ""}
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         );
//       })}

//       <div className="flex justify-center items-center">
//         <button className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg" onClick={handleFinishReview}>
//           Finish Review
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";

import { useQuiz } from "@/app/context/QuizContext";
import { useParams, useSearchParams } from "next/navigation";
import quizData from "@/app/data/quizdata";
import standardsData from "@/app/data/statetestdata";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const { answers } = useQuiz();
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const stateParam = searchParams.get("state")?.toLowerCase();
  const gradeParam = searchParams.get("grade")?.toLowerCase().replace(/\s+/g, "");

  const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let quiz;

    if (testId === "state-test" && stateParam && gradeParam) {
      const key = `${stateParam}-${gradeParam}`;
      quiz = standardsData[key];
    } else {
      quiz = quizData[testId as string];
    }

    setSelectedQuiz(quiz || []);
    setLoading(false);
  }, [testId, stateParam, gradeParam]);

  const handleFinishReview = () => router.push("/");

  const correctAnswersCount = selectedQuiz.filter(
    (q) => answers?.[q.question] === q.answer
  ).length;

  const totalQuestions = selectedQuiz.length;
  const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);

  if (loading) return <p className="text-center text-gray-600">Loading quiz data...</p>;
  if (!selectedQuiz || selectedQuiz.length === 0)
    return (
      <p className="text-center text-red-500 mt-10">
        No review data found for this test.
      </p>
    );

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-center text-2xl font-bold">
        Review {testId === "state-test" && stateParam && gradeParam
          ? `State Test - ${stateParam.toUpperCase()} - ${gradeParam.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}`
          : `Test`}
      </h1>
      <p className="text-center text-gray-500">
        {testId === "state-test"
          ? `State: ${stateParam?.toUpperCase()} | Grade: ${gradeParam?.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}`
          : `Test ID: ${testId}`}
      </p>


      {/* Score */}
      <div className="text-center my-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Your Score: {score}%</h2>
        <p className="text-gray-600">
          {correctAnswersCount} out of {totalQuestions} questions correct
        </p>
      </div>

      {/* Question Review */}
      {selectedQuiz.map((questionData, index) => {
        const selectedAnswer = answers?.[questionData.question];

        return (
          <div key={index} className="my-6 p-4 border rounded-lg shadow">
            <p className="font-semibold mb-5">Question {index + 1}:</p>

            {questionData.question.startsWith("https://res.cloudinary.com") ? (
              <img
                src={questionData.question}
                alt={`Question ${index + 1}`}
                className="w-full max-w-2xl mb-6"
              />
            ) : (
              <p className="font-bold mb-5">{questionData.question}</p>
            )}

            <ul className="grid grid-cols-2 gap-2 mt-2">
              {questionData.options.map((option: string, i: number) => {
                const isCorrect = option === questionData.answer;
                const isSelected = option === selectedAnswer;
                return (
                  <li
                    key={i}
                    className={`p-2 text-center border rounded-lg ${
                      isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {option} {isSelected ? "(Your Answer)" : ""}
                    {isCorrect ? " ✅" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="flex justify-center items-center">
        <button
          className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
          onClick={handleFinishReview}
        >
          Finish Review
        </button>
      </div>
    </div>
  );
}

