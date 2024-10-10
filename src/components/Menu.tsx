import { auth } from "@/auth";
import { Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/home.png",
        label: "Home",
        href: "/",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
      {
        icon: "/images/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: [Role.ADMIN, Role.TEACHER],
      },
      {
        icon: "/images/student.png",
        label: "Students",
        href: "/list/students",
        visible: [Role.ADMIN, Role.TEACHER],
      },
      {
        icon: "/images/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: [Role.ADMIN, Role.TEACHER],
      },
      {
        icon: "/images/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: [Role.ADMIN],
      },
      {
        icon: "/images/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: [Role.ADMIN, Role.TEACHER],
      },
      {
        icon: "/images/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: [Role.ADMIN, Role.TEACHER],
      },
      {
        icon: "/images/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
      {
        icon: "/images/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
      {
        icon: "/images/result.png",
        label: "Results",
        href: "/list/results",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
      // {
      //   icon: "/images/attendance.png",
      //   label: "Attendance",
      //   href: "/list/attendance",
      //   visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      // },
      {
        icon: "/images/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
      // {
      //   icon: "/images/message.png",
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      // },
      {
        icon: "/images/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      // {
      //   icon: "/images/profile.png",
      //   label: "Profile",
      //   href: "/profile",
      //   visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      // },
      // {
      //   icon: "/images/setting.png",
      //   label: "Settings",
      //   href: "/settings",
      //   visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      // },
      {
        icon: "/images/logout.png",
        label: "Logout",
        href: "/logout",
        visible: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      },
    ],
  },
];

const Menu = async () => {
  const {
    user: { role },
  } = (await auth())!!;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map(({ title, items }) => (
        <div key={title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {title}
          </span>
          {items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mSkyLight"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
