import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import moment from "moment";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const fromDate = moment().startOf("isoWeek").toDate();

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: fromDate,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
      Sat: { present: 0, absent: 0 },
      Sun: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const name = moment.weekdaysShort(moment(item.date).isoWeekday());

    if (item.present) {
      attendanceMap[name].present += 1;
    } else {
      attendanceMap[name].absent += 1;
    }
  });

  const data = weekDays.map((d) => ({ name: d, ...attendanceMap[d] }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/images/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
