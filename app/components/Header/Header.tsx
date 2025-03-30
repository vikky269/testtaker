import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex justify-between items-center shadow-lg px-4 pb-3'>
        <div className=''>
          <Image src="/logo2.png"  width={200} height={100} alt='SmartMathz Logo'/>
        </div>

        {/* <div className='flex gap-4'>
           <Link href={"/"}>Home</Link>
           <Link href={"/"}>About</Link>
        </div>

        <button>
          <Link href={"/"}> Contact Us</Link>
        </button> */}
    </header>
  )
}

export default Header