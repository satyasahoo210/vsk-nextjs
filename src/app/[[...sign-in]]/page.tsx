"use client";

import SignInForm from "@/components/forms/SignInForm";

const SignInPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-mSkyLight">
      <div>
        <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
