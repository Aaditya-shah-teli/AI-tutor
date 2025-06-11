
import CompanionForm from '@/components/CompanionForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'


const NewCampanion = async () => {
  const { userId} = await auth();
  if(!userId) redirect('/sign-in');
  return (
    <main className='min-lg:w-1/3 min-md:2/3 items-center justify-center'>
      <article className='gap-4 w-full flex flex-col'>
      <h1>Companion Builder</h1>
      <CompanionForm/>
    </article>
    </main>
  )
}

export default NewCampanion