"use client";

//import { supabase } from "@/src/supabase";
import Image from "next/image";
import { supabase } from "@/src/supabase";
import { useContext } from "react";
import { UserContext } from "@/src/context/UserContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const {
    userId: [userId, setUserId, loading],
  } = useContext(UserContext);

  const router = useRouter();

  async function signUpNewUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "/",
      },
    });
    if (error) {
      alert(error.message);
      return;
    }
    // alert("Check your email for the confirmation link");
    console.log(data);
    setUserId(data?.user?.id);
    router.push("/");
  }

  function handleSubmit(e: React.SyntheticEvent) {
    event?.preventDefault();

    e.preventDefault();
    const { email, password, confirmPassword } = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
      confirmPassword: { value: string };
    };
    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match");
      return;
    }
    signUpNewUser({
      email: email.value,
      password: password.value,
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

          <div className="mb-2 text-xl">Sign Up</div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-1 w-full">
              <p className="w-full">Email</p>
              <input
                className="w-full border-2 border-gray-300 rounded-md p-2"
                type="email"
                name="email"
                required
              />
            </div>
            <div className="mb-1 w-full">
              <p className="w-full">Password</p>
              <input
                className="w-full border-2 border-gray-300 rounded-md p-2"
                type="password"
                name="password"
                required
              />
            </div>
            <div className="mb-1 w-full">
              <p className="w-full">Confirm Password</p>
              <input
                className="w-full border-2 border-gray-300 rounded-md p-2"
                type="password"
                name="confirmPassword"
                required
              />
            </div>
            <div className="mb-1 w-full">
              <button
                className="w-full bg-blue-500 text-white p-2 rounded-md"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
