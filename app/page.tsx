import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.action'
import React from 'react'

// Custom luxury RGB colors
const luxuryColors = [
  'rgb(249, 219, 126)', // Gold
  'rgb(175, 175, 211)', // Lavender Gray
  'rgb(211, 253, 225)', // Mint Cream
];

const getRandomLuxuryColor = () => {
  const randomIndex = Math.floor(Math.random() * luxuryColors.length);
  return luxuryColors[randomIndex];
};

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionCompanions = await getRecentSessions({ limit: 10 });

  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        {
          companions.map((companion) => (
            <CompanionCard
              {...companion}
              key={companion.id}
              color={getRandomLuxuryColor()}
            />
          ))
        }
      </section>
      <section className="home-section">
        <CompanionsList title="Recently completed sessions" companions={recentSessionCompanions} classNames="w-1/3 max-lg:w-full" />
        <Cta />
      </section>
    </main>
  )
}

export default Page