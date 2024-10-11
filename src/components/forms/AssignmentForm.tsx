"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Assignment } from "@prisma/client";
import moment from "moment";
import { AssignmentSchema, AssignmentSchemaType } from "@/lib/definitions";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AssignmentForm = ({
  type,
  data,
  extra = {},
  close,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Assignment;
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchemaType>({
    resolver: zodResolver(AssignmentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
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
  }, [state, router, close]);

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Assignment" : "Update Assignment"}
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
          label="Title"
          name="title"
          register={register}
          error={errors?.title}
          defaultValue={data?.title}
        />

        <InputField
          label="Start Date"
          name="startDate"
          register={register}
          type="date"
          error={errors?.startDate}
          defaultValue={moment(data?.startDate).format("YYYY-MM-DD")}
        />

        <InputField
          label="End Date"
          name="endDate"
          register={register}
          type="date"
          error={errors?.endDate}
          defaultValue={moment(data?.endDate).format("YYYY-MM-DD")}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            {...register("lessonId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.lessonId as string | undefined}
          >
            <option value={0}>-- Select --</option>
            {(extra.lessons as { id: number; name: string }[]).map((d) => (
              <option key={`${d.id}-${d.name}`} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors?.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
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

export default AssignmentForm;
