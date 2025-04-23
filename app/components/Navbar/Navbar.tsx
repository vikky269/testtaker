"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const Navbar = () => {
  return (
    <nav className={` ${outfit.variable} flex items-center justify-between lg:px-16 md:px-12 p-4 bg-white shadow-md`}>
        {/* Logo and Title */}
        
          <Link href={"/"} className='cursor-pointer'>
              <Image src="/SmartMathz.png" alt="Logo" width={150} height={100} className="inline-block mr-2" />
          </Link>

        {/* Navigation Links */}

          <div className="hidden md:flex items-center">
              <ul className="flex space-x-4 text-[#181818] font-semibold font-main">
                  {["Home", "Learning", "Services", "SM Academy", "Account", "Contact Us"].map((item, idx) => (
                      <li key={idx} className="relative group">
                          <Link href="/" className="cursor-pointer">
                              {item}
                              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7FB509] transition-all duration-300 group-hover:w-full"></span>
                          </Link>
                      </li>
                  ))}
              </ul>
          </div>

        
    </nav>
  )
}

export default Navbar