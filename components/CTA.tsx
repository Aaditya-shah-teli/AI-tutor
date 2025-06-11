import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
  return (
    <section className='cta-section '>
      <div className='cts-badge'> Start Learning your way.</div>
      <h2 className='text-3xl font-bold'>
        Build and Prsonalize Learning Companion
      </h2>
      <p>
        pick a name, subject, voice & personal - and start learning through voice conversation that feel natural and fun
      </p>
      <Image src='images/cta.svg' alt='cta.svg' height={232} width={362}/>
      <button className='btn-primary'>
        <Image src={'icons/plus.svg'} alt='plus' width={12} height={12}/>
        <Link href={'/companions/new'}>
        <p>Build a new companion</p>
        </Link>
      </button>
    </section>
  )
}

export default Cta