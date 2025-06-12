import React from 'react';
import CompanionForm from '@/components/CompanionForm';
import { newCompanionPermissions } from '@/lib/actions/companion.action';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const canCreateCompanion = await newCompanionPermissions();

  return (
    <main className='w-full lg:w-1/3 md:w-2/3 flex items-center justify-center'>
      {canCreateCompanion ? (
        <article className='gap-4 w-full flex flex-col'>
          <h1>Companion Builder</h1>
          <CompanionForm />
        </article>
      ) : (
        <article className='companion-limit text-center space-y-4'>
          <Image
            src='/images/limit.svg'
            alt='Companion limit reached'
            width={260}
            height={230}
          />
          <div className='cta-badge'>Upgrade Your Plan</div>
          <h1>You've reached your limit</h1>
          <p>Upgrade to create more companions and unlock premium features.</p>
          <Link href='/Subscription' className='btn-primary w-full justify-center'>
            Upgrade My Plan
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewCompanion;