"use client";

import { subjects } from '@/constants';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SubjectFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSubject = searchParams.get('subject') || 'all';

  const [subject, setSubject] = useState(currentSubject);

  useEffect(() => {
    let newUrl = '';

    if (subject === 'all') {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['subject'],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'subject',
        value: subject,
      });
    }

    router.push(newUrl || pathname, { scroll: false });
  }, [subject, router, searchParams, pathname]);

  return (
    <div className="w-60">
      <Select onValueChange={setSubject} value={subject}>
        <SelectTrigger className="border flex justify-center items-center border-gray-300 w-20 h-8 rounded px-4 py-2 bg-white text-black shadow capitalize"><p>Subjects></p>
          <SelectValue placeholder="Select subject" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black border rounded shadow z-50">
          <SelectItem value="all" className="capitalize px-3 py-2 hover:bg-gray-100 cursor-pointer">
            All Subjects
          </SelectItem>
          {subjects.map((subject) => (
            <SelectItem
              key={subject}
              value={subject}
              className="capitalize px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubjectFilter;