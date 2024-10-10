import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import moment from "moment";
import Image from "next/image";

const UserCard = async ({ type }: { type: Role }) => {
  const modelMap: Record<Role, any> = {
    [Role.ADMIN]: prisma.admin,
    [Role.TEACHER]: prisma.teacher,
    [Role.STUDENT]: prisma.student,
    [Role.PARENT]: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="rounded-2xl odd:bg-mPurple even:bg-mYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {moment().format("YYYY/MM")}
        </span>
        <Image src="/images/more.png" alt="More" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
