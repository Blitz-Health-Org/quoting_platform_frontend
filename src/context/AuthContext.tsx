"use client";

import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { supabase } from "../supabase";
import { Loading } from "../components/ui/Loading";
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
    return <Loading />;
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
    supabase.auth.getUser(accessToken).then(async (response) => {
      if (!response.data.user) {
        const { data, error } = await supabase.auth.refreshSession();
        if (error || !data.user || !data.session) {
          console.log("Invalid token");
          alert("Your session has expired. Please sign in again.");
          setAccessToken(undefined);
          router.push("/sign-in");
        } else {
          setAccessToken(data.session.access_token);
        }
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
