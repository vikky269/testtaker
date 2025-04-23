import React from 'react'
import NavHeader from './components/NavHeader/NavHeader'
import QuizCardGrid from './components/Quizcard/QuizCard'

const newUI = () => {
  return (
    <div>
        <NavHeader />
         <div className='mt-12 flex max-sm:justify-center max-sm:items-center lg:px-16 md:px-12 p-4'>
            <QuizCardGrid />
         </div>
    </div>
  )
}

export default newUI