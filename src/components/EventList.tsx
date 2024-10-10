import prisma from "@/lib/prisma";
import moment from "moment";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const data = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (!data.length) {
    return (
      <div className="p-5 rounded-md border-2 border-gray-100">
        No Events on{" "}
        <span className="font-medium text-gray-500">
          {moment(date).format("LL")}
        </span>
      </div>
    );
  }

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sky even:border-t-purple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {moment(event.startDate).format("hh:mm A")} -{" "}
          {moment(event.endDate).format("hh:mm A")}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;
