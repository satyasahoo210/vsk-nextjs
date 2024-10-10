import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { role } from "@/lib/utils";
import { Class, Lesson, Prisma, Role, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type LessonList = Lesson & { teacher: Teacher; subject: Subject; class: Class };

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Subject Name",
    accessor: "subjectName",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "className",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  ...(([Role.ADMIN] as Role[]).includes(role)
    ? [{ header: "Actions", accessor: "actions" }]
    : []),
];

const _renderRow = (item: LessonList, extra: Record<string, unknown>) => {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight"
    >
      <td className="flex items-center gap-4 py-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">{item.teacher.firstName}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === Role.ADMIN && (
            <>
              <FormModal
                table="lesson"
                type="update"
                data={item}
                extra={extra}
              />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const LessonListPage = async ({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAMS CONDITIONS
  const whereQuery: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) continue;

      switch (key) {
        case "q":
          whereQuery.OR = [
            { subject: { name: { contains: value, mode: "insensitive" } } },
            {
              teacher: { firstName: { contains: value, mode: "insensitive" } },
            },
            { teacher: { lastName: { contains: value, mode: "insensitive" } } },
          ];
          break;
        case "teacherId":
          whereQuery.teacherId = value;
          break;
        case "classId":
          whereQuery.classId = parseInt(value);
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: whereQuery,
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } },
        class: { select: { name: true } },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: whereQuery }),
  ]);

  let classes: { id: number; name: string }[] = [];
  let teachers: { id: string; firstName: string; lastName: string | null }[] =
    [];
  let subjects: { id: number; name: string }[] = [];

  if (([Role.ADMIN] as Role[]).includes(role)) {
    [classes, teachers, subjects] = await prisma.$transaction([
      prisma.class.findMany({
        select: { id: true, name: true },
      }),
      prisma.teacher.findMany({
        select: { id: true, firstName: true, lastName: true },
      }),
      prisma.subject.findMany({
        select: { id: true, name: true },
      }),
    ]);
  }

  const renderRow = (item: LessonList) =>
    _renderRow(item, { teachers, classes, subjects });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden text-lg font-semibold md:block">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mYellow">
              <Image src="/images/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mYellow">
              <Image src="/images/sort.png" alt="" width={14} height={14} />
            </button>
            {role === Role.ADMIN && (
              <FormModal
                table="lesson"
                type="create"
                extra={{ teachers, classes, subjects }}
              />
            )}
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

export default LessonListPage;
