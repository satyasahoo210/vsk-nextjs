import prisma from "@/lib/prisma";

const StudentAttendanceCard = async ({ id }: { id: string }) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((d) => d.present).length;

  const percentage = (presentDays / totalDays) * 100;

  return <h1 className="text-xl font-semibold">{percentage}%</h1>;
};

export default StudentAttendanceCard;
