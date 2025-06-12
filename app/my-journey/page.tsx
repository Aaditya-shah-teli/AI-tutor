import CompanionsList from "@/components/CompanionsList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const Profile = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const companion = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl}
            alt={user.firstName || "Profile Image"}
            width={110}
            height={110}
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="border rounded-lg p-3 gap-2 h-fit border-black flex flex-col">
            <div className="flex gap-2 items-center">
              <Image src="/icons/check.svg" width={22} height={22} alt="Check Icon" />
              <p className="text-2xl font-bold">{sessionHistory.length}</p>
            </div>
            <div>Lessons Completed</div>
          </div>

          <div className="border rounded-lg p-3 gap-2 h-fit border-black flex flex-col">
            <div className="flex gap-2 items-center">
              <Image src="/icons/cap.svg" width={22} height={22} alt="Cap Icon" />
              <p className="text-2xl font-bold">{companion.length}</p>
            </div>
            <div>Companions Created</div>
          </div>
        </div>
      </section>

      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
          <AccordionContent>
            <CompanionsList title="Recent Sessions" companions={sessionHistory} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            My Companions ({companion.length})
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList title="My Companions" companions={companion} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;