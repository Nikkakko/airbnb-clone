import ErrorCard from "@/components/auth/ErrorCard";
import * as React from "react";

interface SignInPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SignInPage: React.FC<SignInPageProps> = ({ searchParams }) => {
  if (searchParams.error === "OAuthAccountNotLinked") {
    return <ErrorCard />;
  }

  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold text-center">Sign In</h1>
          <p className="text-lg text-center">Sign in to your account.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
