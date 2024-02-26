"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/src/context/UserContext";
import { supabase } from "@/src/supabase";
import { AuthContext } from "@/src/context/AuthContext";

export default function Page() {
  const {
    userId: [userId, setUserId, loading],
  } = useContext(UserContext);
  const {
    accessToken: [accessToken, setAccessToken],
  } = useContext(AuthContext);

  const router = useRouter();

  function handleSubmit(e: React.SyntheticEvent) {
    event?.preventDefault();

    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value; // typechecks!
    const password = target.password.value; // typechecks!

    // Use supabase.auth.signIn to sign in the user
    supabase.auth
      .signInWithPassword({ email, password })
      .then(({ data, error }) => {
        if (error) {
          alert(error.message);
          return;
        }
        if (data) {
          setUserId(data.user.id);
          setAccessToken(data.session.access_token);
          router.push("/");
        }
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-400/50 backdrop-blur-md">
      <div className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 h-fit bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center w-full p-6">
          {/* Image component */}
          <div className="mb-2">
            <Image
              className="height-auto"
              src="/NewBlumeLogo.jpg" // Assuming your public folder is served from the root
              alt="Bloom Flower"
              width={150} // Set the width as per your design
              height={100}
            />
          </div>

          <div className="mb-2 text-xl">Sign In</div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-1 w-full">
              <p className="w-full">Email</p>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="john@acmecorp.com"
                className="text-sm px-3 py-2 outline outline-1 outline-gray-400 mb-1 mt-1 rounded-md w-full"
              ></input>
            </div>
            <div className="w-full mb-2">
              <p className="w-full">Password</p>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="******"
                className="text-sm px-3 py-2 outline outline-1 outline-gray-400 mb-1 mt-1 rounded-md w-full"
              ></input>
            </div>

            <div className="flex gap-2 items-center">
              <button
                type="submit"
                value="Sign In"
                className="bg-gray-200 px-3 py-1 rounded-md cursor-pointer"
              >
                Sign In
              </button>
              {/* Add a link to the sign-up page */}
              <a
                href="/sign-up"
                className="bg-gray-200 px-3 py-1 rounded-md cursor-pointer"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
