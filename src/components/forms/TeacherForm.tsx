"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
  BLOOD_GROUPS,
  DUMMY_PASSWORD,
  GENDERS,
  TeacherSchema,
  TeacherSchemaType,
} from "@/lib/definitions";
import moment from "moment";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const TeacherForm = ({
  type,
  data,
  close,
  extra,
}: {
  close: () => void;
  type: "create" | "update";
  data?: any;
  extra?: Record<string, unknown>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchemaType>({ resolver: zodResolver(TeacherSchema) });

  const [image, setImage] = useState<
    string | CloudinaryUploadWidgetInfo | undefined
  >(data?.img);

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
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
        {type === "create" ? "Create a new Teacher" : "Update Teacher"}
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
          defaultValue={data?.password ?? DUMMY_PASSWORD}
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
            defaultValue={data?.bloodType}
          >
            <option value="">-- Select --</option>
            {BLOOD_GROUPS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
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
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            {...register("subjects")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.subjectIds}
            multiple
          >
            <option value="">-- Select --</option>
            {(extra?.subjects as { id: number; name: string }[]).map((d) => (
              <option key={`${d.id}-${d.name}`} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors?.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
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

export default TeacherForm;
