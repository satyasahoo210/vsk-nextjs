"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Result } from "@prisma/client";
import { ResultSchemaType, ResultSchema } from "@/lib/definitions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { createResult, updateResult } from "@/lib/actions";

const ResultForm = ({
  type,
  data,
  extra = {},
  close,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Result;
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchemaType>({ resolver: zodResolver(ResultSchema) });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
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
        {type === "create" ? "Create a new Result" : "Update Result"}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Exam</label>
          <select
            {...register("examId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.examId as number | undefined}
          >
            <option value={0}>-- Select --</option>
            {(extra.exams as { id: number; title: string }[]).map((d) => (
              <option key={`${d.id}-${d.title}`} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          {errors?.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            {...register("assignmentId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.assignmentId as number | undefined}
          >
            <option value={0}>-- Select --</option>
            {(extra.assignments as { id: number; title: string }[]).map((d) => (
              <option key={`${d.id}-${d.title}`} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          {errors?.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            {...register("studentId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.studentId as string | undefined}
          >
            <option value="">-- Select --</option>
            {(
              extra.students as {
                id: string;
                firstName: string;
                lastName: string | null;
              }[]
            ).map((d) => (
              <option key={`${d.id}-${d.firstName}-${d.lastName}`} value={d.id}>
                {[d.firstName, d.lastName].join(" ")}
              </option>
            ))}
          </select>
          {errors?.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Score"
          name="score"
          register={register}
          type="number"
          error={errors?.score}
          defaultValue={data?.score}
        />
      </div>

      <button className="bg-blue-500 text-white p-2 rounded-md capitalize">
        {type}
      </button>
    </form>
  );
};

export default ResultForm;
