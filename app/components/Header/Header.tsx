import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex justify-between items-center shadow-lg px-4 pb-3'>
        <div className=''>
         <Link href={"/"} className='flex items-center'>
            <Image src="/logo2.png"  width={200} height={100} alt='SmartMathz Logo'/>
         </Link>
        </div>

    </header>
  )
}

export default Header