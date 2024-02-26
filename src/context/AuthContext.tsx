"use client";

import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";

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
  // const [validationLoading, setValidationLoading] = useState(false);

  if (loading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (!accessToken && window.location.pathname !== "/sign-up") {
    console.log("No token");
    router.push("/sign-in");
  }

  //   if (accessToken) {
  //     // Validate the token
  //     setValidationLoading(true);
  //     // If the token is invalid, remove it from local storage and redirect to sign-in
  //     supabase.auth.getUser(accessToken).then((user) => {
  //       if (!user) {
  //         console.log("Invalid token");
  //         setAccessToken(undefined);
  //         router.push("/sign-in");
  //       }
  //       setValidationLoading(false);
  //     });
  //   }

  //   if (validationLoading) {
  //     console.log("Validating...");
  //     return <div>Validating...</div>;
  //   }

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
