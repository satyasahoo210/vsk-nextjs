import { auth } from "@/auth";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Event, Prisma, Role } from "@prisma/client";
import moment from "moment";
import Image from "next/image";

type EventList = Event & { class: Class };

const getColumns = (role: Role) => [
  {
    header: "Title",
    accessor: "title",
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
  {
    header: "Start Time",
    accessor: "startTime",
    className: "hidden md:table-cell",
  },
  {
    header: "End Time",
    accessor: "endTime",
    className: "hidden md:table-cell",
  },
  ...(([Role.ADMIN] as Role[]).includes(role)
    ? [{ header: "Actions", accessor: "actions" }]
    : []),
];

const _renderRow = (
  item: EventList,
  role: Role,
  extra: Record<string, unknown>
) => {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mPurpleLight"
    >
      <td className="flex items-center gap-4 py-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.class?.name ?? "-"}</td>
      <td className="hidden md:table-cell">
        {moment(item.startDate).format("L")}
      </td>
      <td className="hidden md:table-cell">
        {moment(item.startDate).format("LT")}
      </td>
      <td className="hidden md:table-cell">
        {moment(item.endDate).format("LT")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === Role.ADMIN && (
            <>
              <FormModal
                table="event"
                type="update"
                data={item}
                extra={extra}
              />
              <FormModal table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const EventListPage = async ({
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
  const whereQuery: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) continue;

      switch (key) {
        case "q":
          whereQuery.OR = [
            { title: { contains: value, mode: "insensitive" } },
            {
              class: { name: { equals: value, mode: "insensitive" } },
            },
          ];
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

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: whereQuery,
      include: {
        class: { select: { name: true } },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: whereQuery }),
  ]);

  let classes: {
    name: string;
    id: number;
  }[] = [];

  if (([Role.ADMIN] as Role[]).includes(role)) {
    classes = await prisma.class.findMany({
      select: { id: true, name: true },
    });
  }

  const renderRow = (item: EventList) => _renderRow(item, role, { classes });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden text-lg font-semibold md:block">All Events</h1>
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
              <FormModal table="event" type="create" extra={{ classes }} />
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

export default EventListPage;
