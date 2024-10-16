import { auth } from "@/auth";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Role, Teacher } from "@prisma/client";
import Image from "next/image";

type ClassList = Class & { supervisor: Teacher };

const getColumns = (role: Role) => [
  {
    header: "Class Name",
    accessor: "className",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden md:table-cell",
  },
  ...(([Role.ADMIN] as Role[]).includes(role)
    ? [{ header: "Actions", accessor: "actions" }]
    : []),
];

const _renderRow = (
  item: ClassList,
  role: Role,
  extra: Record<string, unknown>
) => {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight"
    >
      <td className="flex items-center gap-4 py-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.name[0]}</td>
      <td className="hidden md:table-cell">{item.supervisor.firstName}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === Role.ADMIN && (
            <>
              <FormModal
                table="class"
                type="update"
                data={item}
                extra={extra}
              />
              <FormModal table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ClassListPage = async ({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const {
    user: { role },
  } = (await auth())!!;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAMS CONDITIONS
  const whereQuery: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) continue;

      switch (key) {
        case "q":
          whereQuery.name = {
            contains: value,
            mode: "insensitive",
          };
          break;
        case "supervisorId":
          whereQuery.supervisorId = value;
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: whereQuery,
      include: {
        supervisor: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: whereQuery }),
  ]);

  let grades: { id: number; level: number }[] = [];
  let teachers: {
    firstName: string;
    lastName: string | null;
    id: string;
  }[] = [];

  if (([Role.ADMIN] as Role[]).includes(role)) {
    [grades, teachers] = await prisma.$transaction([
      prisma.grade.findMany({
        select: { id: true, level: true },
      }),
      prisma.teacher.findMany({
        select: { id: true, firstName: true, lastName: true },
      }),
    ]);
  }

  const renderRow = (item: ClassList) =>
    _renderRow(item, role, { grades, teachers });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden text-lg font-semibold md:block">All Classes</h1>
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
                table="class"
                type="create"
                extra={{ grades, teachers }}
              />
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

export default ClassListPage;
