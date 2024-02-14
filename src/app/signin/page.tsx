"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import BlumeLogo from "../../../public/NewBlumeLogo.jpg";
import Image from "next/image";

// Initialize Supabase
const supabaseUrl = "https://somermsyqwpkphreunsb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbWVybXN5cXdwa3BocmV1bnNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjU5NDY2MywiZXhwIjoyMDE4MTcwNjYzfQ.q--XGW9qLBOolEr2HsA6ZU8JRMtUrLivfGm8U41Uh90";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignUp() {
  
  return (
      <div className="w-screen h-screen mx-auto px-4 sm:px-6 bg-white">
        <div className="pt-24 pb-12 md:pt-30 md:pb-20">
          {/* Page header with platformLogo */}
          <div className="max-w-3xl flex flex-col mx-auto text-center items-center justify-center pb-8 flex flex-col">
          <Image
            src={BlumeLogo}
            alt="Description of the image"
            width={120}
            height={40}
            className="mr-2 rounded-md mb-2"
          />
            <h1 className="text-4xl font-bold leading-tight tracking-tighter">Welcome to Blume.</h1>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label
                    className="block text-gray-800 text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="bg-white border border-gray-300 focus:border-gray-500 rounded py-3 px-4 placeholder-gray-500 w-full text-gray-800"
                    placeholder="Enter your name"
                    name="name"
                    required
                  />{" "}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label
                    className="block text-gray-800 text-sm font-medium mb-1"
                    htmlFor="email"
                  >
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="bg-white border border-gray-300 focus:border-gray-500 rounded py-3 px-4 placeholder-gray-500 w-full text-gray-800"
                    placeholder="Enter your email address"
                    name="email"
                    required
                  />{" "}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label
                    className="block text-gray-800 text-sm font-medium mb-1"
                    htmlFor="password"
                  >
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="bg-white border border-gray-300 focus:border-gray-500 rounded py-3 px-4 placeholder-gray-500 w-full text-gray-800"
                    placeholder="Enter your password"
                    name="password"
                    required
                  />{" "}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-3">
                <div className="w-full px-3">
                  <button className="px-8 py-3 shadow-lg font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-blue-600 hover:bg-blue-700 w-full">
                    Sign up
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center mt-3">
                By creating an account, you agree to the{" "}
                <a className="underline" href="#0">
                  terms & conditions
                </a>
                , and our{" "}
                <a className="underline" href="#0">
                  privacy policy
                </a>
                .
              </div>
            </form>
            <div className="flex items-center my-6">
              <div
                className="border-t border-gray-300 grow mr-3"
                aria-hidden="true"
              ></div>
              <div className="text-gray-600 italic">Or</div>
              <div
                className="border-t border-gray-300 grow ml-3"
                aria-hidden="true"
              ></div>
            </div>
            <div className="text-gray-600 text-center mt-6">
              Already using Blume?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:underline transition duration-150 ease-in-out"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
