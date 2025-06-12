import CompanionCard from '@/components/CompanionCard';
import { getSubjectColor } from '@/components/CompanionsList';
import SearchInput from '@/components/SearchInput';
import SubjectFilter from '@/components/SubjectFilter';
import { getAllCompanions } from '@/lib/actions/companion.action';
import React from 'react'

const CompanionsLibrary = async ({searchParams}: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : '';
  const topic = filters.topic ? filters.topic : '';
const companions = await getAllCompanions({subject, topic})
  return (
    <main>
      <section className='flex justify-between gap-4 max-sm:flex-col'>
        <h1>Companion Liberary</h1>
        <div className='flex gap-4'>
          <SearchInput/>
          <SubjectFilter/>
        </div>
      </section>
      <section className='companions-grid'>
        {
          companions.map((companion) => (
            <CompanionCard key={companion.id} {...companion} color={getSubjectColor(companion.subject)}/>

          ))
        }
      </section>
    </main>
  )
}

export default CompanionsLibrary