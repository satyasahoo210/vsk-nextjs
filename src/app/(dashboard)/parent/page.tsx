import { auth } from "@/auth";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import React from "react";

const ParentPage = async () => {
  const { userId } = (await auth())!!;

  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
  });

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 ">
        {students.map((s) => (
          <div className="h-full bg-white p-4 rounded-md" key={s.id}>
            <h1 className="text-xl font-semibold">
              Schedule ({s.firstName} {s.lastName})
            </h1>
            <BigCalendarContainer type="classId" id={s.classId} />
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
