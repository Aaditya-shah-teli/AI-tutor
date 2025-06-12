import { getSubjectColor } from '@/components/CompanionsList';
import { getCompanion } from '@/lib/actions/companion.action';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import CompanionComponent from '@/components/CompanionComponent';

interface CompanionSessionPageProps {
  params: { id: string };
}

const CompanionSession = async ({ params: { id } }: CompanionSessionPageProps) => {
  const companion = await getCompanion(id);
  const user = await currentUser();

  if (!user) redirect('/sign-in');
  if (!companion) redirect('/companions');

  const { name, subject, title, topic, duration } = companion;

  return (
    <main>
      <article className='flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] rounded-lg flex items-center justify-center max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <p className='font-bold text-2xl'>{name}</p>
              <div className="subject-badge max-sm:hidden">{subject}</div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        <div className='items-start text-2xl max-md:hidden'>{duration} Minutes</div>
      </article>

      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        useImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSession;