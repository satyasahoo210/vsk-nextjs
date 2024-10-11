"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Student, User } from "@prisma/client";
import {
  BLOOD_GROUPS,
  DUMMY_PASSWORD,
  GENDERS,
  StudentSchema,
  StudentSchemaType,
} from "@/lib/definitions";
import { useEffect, useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useFormState } from "react-dom";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";

const StudentForm = ({
  type,
  data,
  close,
  extra,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Student & User;
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchemaType>({ resolver: zodResolver(StudentSchema) });

  const [image, setImage] = useState<
    string | CloudinaryUploadWidgetInfo | undefined
  >(data?.img as any);
  const getRelatedClasses = (gradeId: number) =>
    (
      extra!!.grades as {
        id: number;
        level: number;
        classes: {
          id: number;
          name: string;
          capacity: number;
          _count: { students: number };
        }[];
      }[]
    ).find((g) => g.id === gradeId)!!.classes;

  const [classes, setClasses] = useState<
    {
      id: number;
      name: string;
      capacity: number;
      _count: { students: number };
    }[]
  >(data ? getRelatedClasses(data.gradeId) : []);

  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
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
    data.img = typeof image === "string" ? image : image?.secure_url;
    formAction(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Student" : "Update Student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
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
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
          defaultValue={data?.username}
          inputProps={{
            readOnly: type === "update",
          }}
        />

        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
          defaultValue={data?.email}
        />

        <InputField
          label="Password"
          name="password"
          register={register}
          type="password"
          error={errors?.password}
          defaultValue={type === "create" ? "" : DUMMY_PASSWORD}
          inputProps={{
            readOnly: type === "update",
          }}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          register={register}
          error={errors?.firstName}
          defaultValue={data?.firstName}
        />

        <InputField
          label="Last Name"
          name="lastName"
          register={register}
          error={errors?.lastName}
          defaultValue={data?.lastName}
        />

        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors?.phone}
          defaultValue={data?.phone}
        />

        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors?.address}
          defaultValue={data?.address}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Blood Group</label>
          <select
            {...register("bloodGroup")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.bloodGroup as string | undefined}
          >
            <option value="">-- Select --</option>
            {BLOOD_GROUPS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {errors?.bloodGroup?.message && (
            <p className="text-xs text-red-400">
              {errors.bloodGroup.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Birthday"
          name="birthday"
          register={register}
          type="date"
          error={errors?.birthday}
          defaultValue={moment(data?.birthday).format("YYYY-MM-DD")}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            {...register("gender")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.gender}
          >
            <option value="">-- Select --</option>
            {GENDERS.map((d) => (
              <option key={d} className="capitalize">
                {d}
              </option>
            ))}
          </select>
          {errors?.gender?.message && (
            <p className="text-xs text-red-400">
              {errors.gender.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Parent ID"
          name="parentId"
          register={register}
          error={errors?.parentId}
          defaultValue={data?.parentId}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setImage(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div className="flex flex-row flex-1 justify-around items-center gap-2 ring-[1.5px] ring-gray-300 p-2 rounded-md">
                <div
                  onClick={() => open()}
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                >
                  <Image
                    src="/images/upload.png"
                    alt=""
                    width={28}
                    height={28}
                  />
                  <span>Upload a photo</span>
                </div>
                {image && (
                  <Image
                    src={typeof image === "string" ? image : image.secure_url}
                    alt=""
                    width={75}
                    height={75}
                    style={{
                      width: "75px",
                      height: "75px",
                    }}
                  />
                )}
              </div>
            );
          }}
        </CldUploadWidget>
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Institutional Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            {...register("gradeId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.gradeId}
            onChange={(e) =>
              setClasses(getRelatedClasses(parseInt(e.currentTarget.value)))
            }
          >
            <option value={""}>-- Select --</option>
            {(extra?.grades as { id: string; level: number }[]).map((d) => (
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
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register("classId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.classId}
            disabled={!classes.length}
          >
            <option value={""}>-- Select --</option>
            {classes.map((d) => (
              <option key={`${d.id}-${d.name}`} value={d.id}>
                {d.name} - ({d._count.students} / {d.capacity})
              </option>
            ))}
          </select>
          {errors?.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button
        className="bg-blue-500 text-white p-2 rounded-md capitalize"
        onClick={() => console.log("clicked")}
      >
        {type}
      </button>
    </form>
  );
};

export default StudentForm;
