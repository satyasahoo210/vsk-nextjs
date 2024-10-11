"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Subject } from "@prisma/client";
import { SubjectSchema, SubjectSchemaType } from "@/lib/definitions";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

const SubjectForm = ({
  type,
  data,
  extra = {},
  close,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Subject & { teacherIds?: string[] };
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchemaType>({ resolver: zodResolver(SubjectSchema) });

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
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
        {type === "create" ? "Create a new Subject" : "Update Subject"}
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
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            {...register("teacherIds")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.teacherIds}
            multiple
          >
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
          {errors?.teacherIds?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherIds.message.toString()}
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

export default SubjectForm;
