import React from 'react'
import NavHeader from './components/NavHeader/NavHeader'
import QuizCardGrid from './components/Quizcard/QuizCard'

const newUI = () => {
  return (
    <div className="min-h-screen">
        <NavHeader />
         {/* <div className='mt-12 flex justify-evenly max-sm:justify-center max-sm:items-center p-4 bg-amber-900 border-2'>
            <QuizCardGrid />
         </div> */}

          <div className='mt-12'>
            <QuizCardGrid />
         </div>
    </div>
  )
}

export default newUI