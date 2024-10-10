"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Parent, User } from "@prisma/client";
import {
  DUMMY_PASSWORD,
  ParentSchema,
  ParentSchemaType,
} from "@/lib/definitions";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { createParent, updateParent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ParentForm = ({
  type,
  data,
  close,
}: {
  close: () => void;
  type: "create" | "update";
  data?: Parent & User;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchemaType>({ resolver: zodResolver(ParentSchema) });

  const [image, setImage] = useState<
    string | CloudinaryUploadWidgetInfo | undefined
  >(data?.img as any);

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
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
    data.img = typeof image === "string" ? image : image?.secure_url;
    formAction(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Parent" : "Update Parent"}
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

      <button className="bg-blue-500 text-white p-2 rounded-md capitalize">
        {type}
      </button>
    </form>
  );
};

export default ParentForm;
