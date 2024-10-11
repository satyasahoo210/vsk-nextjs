"use client";

import {
  deleteAnnouncement,
  deleteAssignment,
  deleteClass,
  deleteEvent,
  deleteExam,
  deleteLesson,
  deleteParent,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

const deleteActionMap: { [key in TableType]: any } = {
  subject: deleteSubject,
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteParent,
  class: deleteClass,
  lesson: deleteLesson,
  exam: deleteExam,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: undefined,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});

const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

type TableType =
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "announcement";

type RequestType = "create" | "update" | "delete";

type FormData = {
  table: TableType;
  type: RequestType;
  data?: any;
  id?: string | number;
  extra?: Record<string, unknown>;
};

const forms: {
  [key in TableType]: (
    close: () => void,
    type: "create" | "update",
    data?: any,
    extra?: Record<string, unknown>
  ) => JSX.Element;
} = {
  teacher: (close, type, data, extra) => (
    <TeacherForm type={type} data={data} close={close} extra={extra} />
  ),
  student: (close, type, data, extra) => (
    <StudentForm type={type} data={data} close={close} extra={extra} />
  ),
  parent: (close, type, data, extra) => (
    <ParentForm type={type} data={data} close={close} />
  ),

  announcement: (close, type, data, extra) => (
    <AnnouncementForm type={type} data={data} extra={extra} close={close} />
  ),
  assignment: (close, type, data, extra) => (
    <AssignmentForm type={type} data={data} extra={extra} close={close} />
  ),
  attendance: (close, type, data, extra) => (
    <StudentForm type={type} data={data} close={close} />
  ),
  class: (close, type, data, extra) => (
    <ClassForm type={type} data={data} extra={extra} close={close} />
  ),
  event: (close, type, data, extra) => (
    <EventForm type={type} data={data} extra={extra} close={close} />
  ),
  exam: (close, type, data, extra) => (
    <ExamForm type={type} data={data} extra={extra} close={close} />
  ),
  lesson: (close, type, data, extra) => (
    <LessonForm type={type} data={data} extra={extra} close={close} />
  ),
  result: (close, type, data, extra) => (
    <ResultForm type={type} data={data} extra={extra} close={close} />
  ),
  subject: (close, type, data, extra) => (
    <SubjectForm type={type} data={data} extra={extra} close={close} />
  ),
};

const FormModal = ({ data, type, id, table, extra }: FormData) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-mYellow"
      : type === "update"
      ? "bg-mSky"
      : "bg-mPurple";

  const [open, setOpen] = useState(false);

  const DeleteForm = ({
    table,
    id,
    close,
  }: {
    table: TableType;
    id: string | number;
    close: () => void;
  }) => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      message: null,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(state.message);
        close();
        router.refresh();
      }
    }, [state, router, close]);

    return (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" hidden name="id" value={id} readOnly />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    );
  };

  const Form = ({ close }: { close: () => void }) => {
    return type === "delete"
      ? id && <DeleteForm table={table} id={id} close={close} />
      : forms[table](close, type, data, extra);
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/images/${type}.png`} alt={type} width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form close={() => setOpen(false)} />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/images/close.png"
                alt="Close"
                width={14}
                height={14}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
