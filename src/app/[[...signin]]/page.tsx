"use client";

import SignInForm from "@/components/forms/SignInForm";
import { signOut, useSession } from "next-auth/react";
import ErrorPage from "next/error";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SignInPage = () => {
  const router = useRouter();
  const { signin } = useParams();
  const { data } = useSession();
  const search = useSearchParams();

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (signin === undefined && data?.user) {
      router.push(
        search.get("callbackUrl") ?? "/" + data.user.role.toLowerCase()
      );
    }
  }, [data?.user, router, search, signin]);

  if (signin === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-mSkyLight">
        <div>
          <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
            <SignInForm redirect={handleRedirect} />
          </div>
        </div>
      </div>
    );
  } else if (signin[0] === "logout") {
    signOut();
  } else {
    return <ErrorPage statusCode={404} />;
  }
};

export default SignInPage;
