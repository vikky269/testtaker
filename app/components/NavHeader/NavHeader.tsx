"use client"
import React from 'react'
import { Lato } from 'next/font/google'
import Image from 'next/image'
const lato = Lato({
  subsets: ['latin'], 
  variable: '--font-lato',
  weight: ['400', '700'], 
})

const NavHeader = () => {
  return (
    <div className={`${lato.variable} flex flex-col max-sm:items-start max-sm:justify-center mt-8 lg:px-16 md:px-12 max-sm:px-8 p-4`}>
          <h1 className="md:text-4xl text-2xl font-bold text-[#1C1C1E] font-lato max-sm:mb-1">SmartMathz Test Taker</h1>
          

          {/* search bar and filter */}

      <div className='flex flex-col md:flex-row items-baseline justify-between'>
        <span className="text-[#444A52] text-[16px] font-lato max-sm:mb-2">Select a test to begin your preparation.</span>
        <div className='flex flex-col md:flex-row justify-center items-center gap-2'>
          <div className="border border-[#E1E0E0] rounded-lg p-2  w-80 md:w-100 flex justify-start items-center">
            <Image src="/placeholder.png" width={15} height={15} alt='search_icon' className="inline-block ml-2 cursor-pointer" />
            <input type="text" placeholder="Search" className='placeholder:text-[#787473] placeholder:font-lato max-w-lg placeholder:font-bold outline-none ml-3 placeholder:text-[14px]' />
          </div>
          <div className='bg-[#EFEFF4] py-2 px-4 rounded-lg text-sm text-[#222222] font-lato cursor-pointer md:flex  hidden'>
            Filter
            <Image src="/mynaui_filter.png" alt="Filter Icon" width={20} height={20} className="inline-block ml-2" />
          </div>
        </div>

      </div>
    </div>

    
  )
}

export default NavHeader