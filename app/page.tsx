import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        <CompanionCard id='123' name='Neura the brain exploral' topic='Nural network of brain' subject='science' duration={45} color='#ffe232'/>
        <CompanionCard id='124' name='baba the khana exploral' topic='bromo promo of brain' subject='science' duration={45} color='#ffe232'/>
        <CompanionCard id='125' name='hauba the kaya exploral' topic='kya sal of brain' subject='science' duration={45} color='#ffe232'/>
      </section>
      <section className="home-section">
        <CompanionsList title="Recently completed sessions" companions={recentSessions} classNames="w-1/3 max-lg:w-full"/>
        <Cta/>
      </section>
    </main>
  )
}

export default Page