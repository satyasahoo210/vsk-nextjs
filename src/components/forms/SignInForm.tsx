"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

const schema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string(),
});

type Inputs = z.infer<typeof schema>;

const SignInForm = () => {
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
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Image src="/logo.png" alt="VSK Logo" width={24} height={24} />
        VSK
      </h1>
      <h2 className="text-gray-400">Sign in to your Account</h2>

      <div className="flex flex-col justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Username</label>
          <input
            type="text"
            {...register("username")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors?.username?.message && (
            <p className="text-xs text-red-400">
              {errors.username.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Password</label>
          <input
            type="password"
            {...register("password")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors?.password?.message && (
            <p className="text-xs text-red-400">
              {errors.password.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="bg-blue-500 text-white text-sm p-2 rounded-md ">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
