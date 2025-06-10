import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Navitems from './Navitems'

const Navbar = () => {
  return (
    <div className='navbar flex justify-between items-center px-4 py-2'>
      <Link href='/'>
        <div className='flex items-center gap-2.5 cursor-pointer'>
          <Image src="/images/logo.svg" alt="logo.svg" width={46} height={44} />
        </div>
      </Link>
      <div className="flex gap-8 items-center">
        <Navitems/>
        <p>Sign In</p>
      </div>
    </div>
  )
}

export default Navbar