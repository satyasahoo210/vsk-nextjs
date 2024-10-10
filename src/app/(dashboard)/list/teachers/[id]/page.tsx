import { auth } from "@/auth";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { Role, Teacher } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const TeacherPage = async ({ params: { id } }: { params: { id: string } }) => {
  const {
    user: { role },
  } = (await auth())!!;

  const [teacher, subjects] = await prisma.$transaction([
    prisma.teacher.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subjects: true,
            lessons: true,
            classes: true,
          },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.subject.findMany({ select: { id: true, name: true } }),
  ]);

  if (!teacher) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-mSky py-6 px-4 rounded-md flex-1 gap-4 flex">
            <div className="w-1/3">
              <Image
                src={teacher.img ?? "/images/noAvatar.png"}
                alt={[teacher.firstName, teacher.lastName].join(" ")}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {[teacher.firstName, teacher.lastName].join(" ")}
                </h1>
                {role === Role.ADMIN && (
                  <FormModal
                    table="teacher"
                    type="update"
                    data={
                      {
                        id: teacher.id,
                        username: teacher.username,
                        firstName: teacher.firstName,
                        lastName: teacher.lastName,
                        email: teacher.email,
                        phone: teacher.phone,
                        address: teacher.address,
                        img: teacher.img,
                        bloodGroup: teacher.bloodGroup,
                        gender: teacher.gender,
                        birthday: teacher.birthday,
                        subjectIds: teacher.subjects.map((s) => s.id),
                      } as Teacher & {
                        subjectIds: number[];
                      }
                    }
                    extra={{ subjects }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image
                    src="/images/blood.png"
                    alt=""
                    width={14}
                    height={14}
                  />
                  <span>{teacher.bloodGroup}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image src="/images/date.png" alt="" width={14} height={14} />
                  <span>{moment(teacher.birthday).format("DD MMMM YYYY")}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image src="/images/mail.png" alt="" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image
                    src="/images/phone.png"
                    alt=""
                    width={14}
                    height={14}
                  />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md w-full flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/images/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md w-full flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/images/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md w-full flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/images/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md w-full flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/images/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type={"teacherId"} id={teacher.id!!} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              href={`/list/classes?supervisorId=${"teacher12"}`}
              className="p-3 rounded-md bg-mSkyLight"
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              href={`/list/students?teacherId=${"teacher12"}`}
              className="p-3 rounded-md bg-mPurpleLight"
            >
              Teacher&apos;s Students
            </Link>
            <Link
              href={`/list/lessons?teacherId=${"teacher12"}`}
              className="p-3 rounded-md bg-mYellowLight"
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              href={`/list/exams?teacherId=${"teacher12"}`}
              className="p-3 rounded-md bg-pink-50"
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?teacherId=${"teacher12"}`}
              className="p-3 rounded-md bg-mSkyLight"
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
