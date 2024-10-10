import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import moment from "moment";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataResp = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = dataResp.map((l) => ({
    title: l.name,
    start: moment(moment(l.startTime).format("HH:mm"), "HH:mm")
      .weekday(moment(l.startTime).weekday())
      .toDate(),
    end: moment(moment(l.endTime).format("HH:mm"), "HH:mm")
      .weekday(moment(l.endTime).weekday())
      .toDate(),
  }));

  return <BigCalendar data={data} />;
};

export default BigCalendarContainer;
