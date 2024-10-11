import { auth } from "@/auth";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { Role, Student } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const StudentPage = async ({ params: { id } }: { params: { id: string } }) => {
  const {
    user: { role },
  } = (await auth())!!;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        select: {
          name: true,
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
      grade: { select: { level: true } },
    },
  });

  if (!student) {
    return notFound();
  }

  let grades: {
    id: number;
    level: number;
    classes: {
      id: number;
      name: string;
      capacity: number;
      _count: { students: number };
    }[];
  }[] = [];

  if (role === Role.ADMIN) {
    grades = await prisma.grade.findMany({
      select: {
        id: true,
        level: true,
        classes: {
          select: {
            id: true,
            name: true,
            capacity: true,
            _count: {
              select: { students: true },
            },
          },
        },
      },
    });
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
                src={student.img ?? "/images/noAvatar.png"}
                alt={[student.firstName, student.lastName].join(" ")}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">
                {[student.firstName, student.lastName].join(" ")}
              </h1>
              {role === Role.ADMIN && (
                <FormModal
                  table="student"
                  type="update"
                  data={
                    {
                      id: student.id,
                      username: student.username,
                      firstName: student.firstName,
                      lastName: student.lastName,
                      email: student.email,
                      phone: student.phone,
                      address: student.address,
                      img: student.img,
                      bloodGroup: student.bloodGroup,
                      gender: student.gender,
                      birthday: student.birthday,
                      gradeId: student.gradeId,
                      classId: student.classId,
                      parentId: student.parentId,
                    } as Student
                  }
                  extra={{ grades }}
                />
              )}
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
                  <span>{student.bloodGroup}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image src="/images/date.png" alt="" width={14} height={14} />
                  <span>{moment(student.birthday).format("DD MMMM YYYY")}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image src="/images/mail.png" alt="" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex item-center gap-2">
                  <Image
                    src="/images/phone.png"
                    alt=""
                    width={14}
                    height={14}
                  />
                  <span>{student.phone || "-"}</span>
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
                <Suspense fallback="...">
                  <StudentAttendanceCard id={student.id} />
                </Suspense>
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
                <h1 className="text-xl font-semibold">{student.grade.level}</h1>
                <span className="text-sm text-gray-400">Grade</span>
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
                  {student.class._count.lessons}
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
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class Name</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="classId" id={student.classId} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              href={`/list/lessons?classId=${2}`}
              className="p-3 rounded-md bg-mSkyLight"
            >
              Student&apos;s Lessons
            </Link>
            <Link
              href={`/list/teachers?classId=${2}`}
              className="p-3 rounded-md bg-mPurpleLight"
            >
              Student&apos;s Teachers
            </Link>
            <Link
              href={`/list/exams?classId=${2}`}
              className="p-3 rounded-md bg-pink-50"
            >
              Student&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?classId=${2}`}
              className="p-3 rounded-md bg-mSkyLight"
            >
              Student&apos;s Assignments
            </Link>
            <Link
              href={`/list/results?studentId=${"student2"}`}
              className="p-3 rounded-md bg-mYellowLight"
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
