import { auth } from "@/auth";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import {
  Assignment,
  Class,
  Prisma,
  Role,
  Subject,
  Teacher,
} from "@prisma/client";
import moment from "moment";
import Image from "next/image";

type AssignmentList = Assignment & {
  lesson: { subject: Subject; teacher: Teacher; class: Class };
};

const getColumns = (role: Role) => [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Subject",
    accessor: "subjectName",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Due Date",
    accessor: "due_date",
    className: "hidden md:table-cell",
  },
  ...(([Role.ADMIN, Role.TEACHER] as Role[]).includes(role)
    ? [{ header: "Actions", accessor: "actions" }]
    : []),
];

const _renderRow = (
  item: AssignmentList,
  role: Role,
  extra: Record<string, unknown>
) => {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight"
    >
      <td className="flex items-center gap-4 py-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.lesson.subject.name}</td>
      <td className="hidden md:table-cell">{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.firstName}</td>
      <td className="hidden md:table-cell">
        {moment(item.endDate).calendar({
          lastDay: "[Yesterday]",
          sameDay: "[Today]",
          nextDay: "[Tomorrow]",
          lastWeek: "[last] dddd",
          nextWeek: "dddd",
          sameElse: "LL",
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {([Role.ADMIN, Role.TEACHER] as Role[]).includes(role) && (
            <>
              <FormModal
                table="assignment"
                type="update"
                data={item}
                extra={extra}
              />
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const AssignmentListPage = async ({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const {
    user: { role },
    userId,
  } = (await auth())!!;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAMS CONDITIONS
  const whereQuery: Prisma.AssignmentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) continue;

      switch (key) {
        case "q":
          whereQuery.lesson = {
            subject: {
              name: { contains: value, mode: "insensitive" },
            },
          };
          break;
        case "classId":
          whereQuery.lesson = {
            classId: parseInt(value),
          };
          break;
        case "teacherId":
          whereQuery.lesson = {
            teacherId: value,
          };
          break;
        default:
          break;
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case Role.ADMIN:
      break;
    case Role.TEACHER:
      whereQuery.lesson = {
        teacherId: userId,
      };
      break;
    case Role.STUDENT:
      whereQuery.lesson = {
        class: {
          students: {
            some: {
              id: userId,
            },
          },
        },
      };
      break;
    case Role.PARENT:
      whereQuery.lesson = {
        class: {
          students: {
            some: {
              parentId: userId,
            },
          },
        },
      };
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: whereQuery,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { firstName: true, lastName: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({ where: whereQuery }),
  ]);

  let lessons: {
    name: string;
    id: number;
  }[] = [];

  if (([Role.ADMIN, Role.TEACHER] as Role[]).includes(role)) {
    lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  const renderRow = (item: AssignmentList) =>
    _renderRow(item, role, { lessons });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden text-lg font-semibold md:block">
          All Assignments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mYellow">
              <Image src="/images/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mYellow">
              <Image src="/images/sort.png" alt="" width={14} height={14} />
            </button>
            {([Role.ADMIN, Role.TEACHER] as Role[]).includes(role) && (
              <FormModal table="assignment" type="create" extra={{ lessons }} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={getColumns(role)} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination currentPage={p} totalItems={count} />
    </div>
  );
};

export default AssignmentListPage;
