import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, resultsData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Prisma, Result, Student } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  teacherName: string;
  score: number;
  className: string;
  startTime: Date;
  isExam: boolean;
};

const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: ResultList) => {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.studentName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {moment(item.startTime).calendar()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ResultListPage = async ({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAMS CONDITIONS
  const whereQuery: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) continue;

      switch (key) {
        case "q":
          whereQuery.OR = [
            { exam: { title: { contains: value, mode: "insensitive" } } },
            {
              student: { firstName: { contains: value, mode: "insensitive" } },
            },
            {
              student: { lastName: { contains: value, mode: "insensitive" } },
            },
          ];
          break;
        case "studentId":
          whereQuery.studentId = value;
          break;
        default:
          break;
      }
    }
  }

  const [dataResp, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: whereQuery,
      include: {
        student: { select: { firstName: true, lastName: true } },
        assignment: {
          include: {
            lesson: {
              select: {
                teacher: { select: { firstName: true, lastName: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
        exam: {
          include: {
            lesson: {
              select: {
                teacher: { select: { firstName: true, lastName: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: whereQuery }),
  ]);

  const data = dataResp.map((d) => {
    const item = d.assignment || d.exam;
    if (!item) return null;

    const isExam = "startTime" in item;

    return {
      id: d.id,
      title: item.title,
      studentName: d.student.firstName,
      teacherName: item.lesson.teacher.firstName,
      score: d.score,
      className: item.lesson.class.name,
      startTime: isExam ? item.startTime : item.startDate,
      isExam: isExam,
    };
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden text-lg font-semibold md:block">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination currentPage={p} totalItems={count} />
    </div>
  );
};

export default ResultListPage;
