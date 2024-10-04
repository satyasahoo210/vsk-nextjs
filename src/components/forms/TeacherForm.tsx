"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),

  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().optional(),
  bloodType: z
    .enum([
      "A +ve",
      "A -ve",
      "B +ve",
      "B -ve",
      "AB +ve",
      "AB -ve",
      "O +ve",
      "O -ve",
    ])
    .optional(),
  birthday: z.date().optional(),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  img: z.instanceof(File).optional(),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
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
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
          defaultValue={data?.username}
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
          defaultValue={data?.password}
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
            {...register("bloodType")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.bloodType}
          >
            <option value="">-- Select --</option>
            {[
              "A +ve",
              "A -ve",
              "B +ve",
              "B -ve",
              "AB +ve",
              "AB -ve",
              "O +ve",
              "O -ve",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {errors?.bloodType?.message && (
            <p className="text-xs text-red-400">
              {errors.bloodType.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Birthday"
          name="birthday"
          register={register}
          type="date"
          error={errors?.birthday}
          defaultValue={data?.birthday}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Blood Group</label>
          <select
            {...register("gender")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.gender}
          >
            <option value="">-- Select --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors?.gender?.message && (
            <p className="text-xs text-red-400">
              {errors.gender.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" {...register("img")} className="hidden" id="img" />
          {errors?.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md capitalize">
        {type}
      </button>
    </form>
  );
};

export default TeacherForm;
