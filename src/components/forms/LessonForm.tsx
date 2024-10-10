"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Day, Lesson } from "@prisma/client";
import moment from "moment";
import { LessonSchema, LessonSchemaType } from "@/lib/definitions";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createLesson, updateLesson } from "@/lib/actions";
import { useFormState } from "react-dom";

const LessonForm = ({
  type,
  data,
  extra = {},
  close,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Lesson;
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchemaType>({ resolver: zodResolver(LessonSchema) });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      message: null,
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(state.message);
      close();
      router.refresh();
    }
  }, [state]);

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Lesson" : "Update Lesson"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="id"
            name="id"
            register={register}
            error={errors?.id}
            defaultValue={data?.id}
            hidden
          />
        )}

        <InputField
          label="Name"
          name="name"
          register={register}
          error={errors?.name}
          defaultValue={data?.name}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            {...register("subjectId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.subjectId as string | undefined}
          >
            <option value={0}>-- Select --</option>
            {(extra.subjects as { id: number; name: string }[]).map((d) => (
              <option key={`${d.id}-${d.name}`} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors?.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            {...register("day")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.day as string | undefined}
          >
            <option value={0}>-- Select --</option>
            {Object.values(Day).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors?.day?.message && (
            <p className="text-xs text-red-400">
              {errors.day.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Start Time"
          name="startTime"
          register={register}
          type="time"
          error={errors?.startTime}
          defaultValue={moment(data?.startTime).format("HH:mm")}
        />

        <InputField
          label="End Time"
          name="endTime"
          register={register}
          type="time"
          error={errors?.endTime}
          defaultValue={moment(data?.endTime).format("HH:mm")}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register("classId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.classId as string | undefined}
          >
            <option value={0}>-- Select --</option>
            {(extra.classes as { id: number; name: string }[]).map((d) => (
              <option key={`${d.id}-${d.name}`} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors?.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            {...register("teacherId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.teacherId as string | undefined}
          >
            <option value="">-- Select --</option>
            {(
              extra.teachers as {
                id: number;
                firstName: string;
                lastName: string | null;
              }[]
            ).map((d) => (
              <option key={`${d.id}-${d.firstName}-${d.lastName}`} value={d.id}>
                {[d.firstName, d.lastName].join(" ")}
              </option>
            ))}
          </select>
          {errors?.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="bg-blue-500 text-white p-2 rounded-md capitalize">
        {type}
      </button>
    </form>
  );
};

export default LessonForm;
