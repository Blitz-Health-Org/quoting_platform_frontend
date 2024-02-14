import Image from "next/image";
import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Page() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-400/50 backdrop-blur-md">
      <div className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 h-fit bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center w-full p-6">
          {/* Image component */}
          <div className="mb-2">
            <Image
              src="/NewBlumeLogo.jpg" // Assuming your public folder is served from the root
              alt="Bloom Flower"
              width={150} // Set the width as per your design
              height={100} // Set the height as per your design
            />
          </div>

          <div className="mb-2 text-xl">Sign In</div>
          <form className="w-full">
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
                type="text"
                id="password"
                name="password"
                placeholder="******"
                className="text-sm px-3 py-2 outline outline-1 outline-gray-400 mb-1 mt-1 rounded-md w-full"
              ></input>
            </div>

            <input
              type="submit"
              value="Submit"
              className="bg-gray-200 px-3 py-1 rounded-md cursor-pointer"
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
}
