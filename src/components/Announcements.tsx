import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";
import moment from "moment";

const Announcements = async () => {
  const {
    user: { role, image },
    userId,
  } = (await auth())!!;

  const whereQuery: Prisma.AnnouncementWhereInput = {};
  switch (role) {
    case Role.ADMIN:
      break;
    case Role.TEACHER:
      whereQuery.OR = [
        { classId: null },
        { class: { lessons: { some: { teacherId: userId } } } },
      ];
      break;
    case Role.STUDENT:
      whereQuery.OR = [
        { classId: null },
        { class: { students: { some: { id: userId } } } },
      ];
      break;
    case Role.PARENT:
      whereQuery.OR = [
        { classId: null },
        { class: { students: { some: { parentId: userId } } } },
      ];
      break;
  }

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: whereQuery,
  });

  const colors = ["bg-mSkyLight", "bg-mPurpleLight", "bg-mYellowLight"];

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.length === 0 ? (
          <div className="p-5 rounded-md border-2 border-gray-100">
            No Announcements
          </div>
        ) : (
          data.map((d, idx) => (
            <div
              key={`Announcement-${d.id}`}
              className={`rounded-md p-4 ${colors[idx]}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{d.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {moment(d.date).format("YYYY-MM-DD")}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{d.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
