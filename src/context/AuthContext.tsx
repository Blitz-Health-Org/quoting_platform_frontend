"use client";

import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { useSharingCheck } from "../utils/useSharingCheck";

export type AuthContextProps = {
  accessToken: [
    string | undefined,
    (value: string | undefined) => void,
    boolean,
  ];
};

export const AuthContext = createContext<AuthContextProps>({
  accessToken: [undefined, () => {}, true],
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [accessToken, setAccessToken, loading] = useLocalStorage<
    string | undefined
  >("accessToken", undefined);

  const [validShare, sharingLoading] = useSharingCheck();

  const [validationLoading, setValidationLoading] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  if (loading || sharingLoading || validationLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (validShare) {
    return <>{children}</>;
  }

  if (
    !accessToken &&
    window.location.pathname !== "/sign-up" &&
    !sharingLoading
  ) {
    console.log("No token");
    router.push("/sign-in");
  }

  if (
    !loading &&
    accessToken &&
    !validationLoading &&
    !validationComplete &&
    !sharingLoading
  ) {
    // Validate the token
    setValidationLoading(true);
    // If the token is invalid, remove it from local storage and redirect to sign-in
    supabase.auth.getUser(accessToken).then((response) => {
      if (!response.data.user) {
        console.log("Invalid token");
        alert("Your session has expired. Please sign in again.");
        setAccessToken(undefined);
        router.push("/sign-in");
      }
      setValidationLoading(false);
      setValidationComplete(true);
    });
  }

  return (
    <>
      <AuthContext.Provider
        value={{ accessToken: [accessToken, setAccessToken, loading] }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
