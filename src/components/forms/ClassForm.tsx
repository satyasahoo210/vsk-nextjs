"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Class } from "@prisma/client";
import { ClassSchema, ClassSchemaType } from "@/lib/definitions";
import { useFormState } from "react-dom";
import { createClass, updateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ClassForm = ({
  type,
  data,
  extra = {},
  close,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Class;
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchemaType>({ resolver: zodResolver(ClassSchema) });

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
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
        {type === "create" ? "Create a new Class" : "Update Class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
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

        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          register={register}
          error={errors?.capacity}
          defaultValue={data?.capacity}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            {...register("gradeId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.gradeId as string | undefined}
          >
            <option value={0}>-- Select --</option>
            {(extra.grades as { id: number; level: number }[]).map((d) => (
              <option key={`${d.id}-${d.level}`} value={d.id}>
                {d.level}
              </option>
            ))}
          </select>
          {errors?.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            {...register("supervisorId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.supervisorId as string | undefined}
          >
            <option value="">-- Select --</option>
            {(
              extra.teachers as {
                firstName: string;
                lastName: string | null;
                id: string;
              }[]
            ).map((d) => (
              <option key={`${d.id}-${d.firstName}-${d.lastName}`} value={d.id}>
                {[d.firstName, d.lastName].join(" ")}
              </option>
            ))}
          </select>
          {errors?.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {!state.success && <span className="text-red-500">{state.message}</span>}
      <button className="bg-blue-500 text-white p-2 rounded-md capitalize">
        {type}
      </button>
    </form>
  );
};

export default ClassForm;
