import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { subjectsColors, voices } from '@/constants';




// export function cn( ...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
export const getSubjectColor = (subject : string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
}
interface CompanionsListProps {
    title: string;
    companions: Companion[];
    classNames?: string;
}
const CompanionsList = ({title, companions, classNames} : CompanionsListProps) => {
  return (
    <article className={cn('companion-list', classNames)}>
        <h2 className='font-bold text-3xl'>Recent Sessions</h2>
        <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-2/3 text-lg">Lesson</TableHead>
      <TableHead className='text-lg '>Subject</TableHead>
      <TableHead className='text-lg text-right'>Duration</TableHead>

    </TableRow>
  </TableHeader>
  <TableBody>
  {
    companions?.map(({id, subject, name, topic, duration}) => (
      <TableRow key={id}>
        <TableCell>
          <Link href={`/companions/${id}`}>
            <div className='flex items-center gap-4'>
              <div className='w-[72px] h-[72px] flex justify-center items-center rounded-lg max-md:hidden' style={{ backgroundColor: getSubjectColor(subject) }}>
                <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
              </div>
              <div className="flex flex-col gap-1">
                <p className='font-bold text-2xl'>{name}</p>
                <p className="text-lg text-muted-foreground">{topic}</p>
              </div>
            </div>
          </Link>
        </TableCell>
        <TableCell>
          <div className='subject-badge w-fit max-md:hidden'>
            {subject}
          </div>
          <div className="flex items-center justify-center rounded-lg p-2 md:hidden w-fit" style={{ backgroundColor: getSubjectColor(subject) }}>
            <Image src={`/icons/${subject}.svg`} alt={subject} height={18} width={18} />
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className='flex justify-end items-center gap-2 w-full'>
            <p className='text-2xl'>{duration}
              {' '} <span className='max-md:hidden'>mins</span>
            </p>
            <Image src='/icons/clock.svg' alt='clock img ' width={14} height={14} className='md:hidden'/>
          </div>
 
        </TableCell>
      </TableRow>
    ))
  }
</TableBody>
</Table>
    </article>
  )
}

export default CompanionsList