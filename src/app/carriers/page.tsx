"use client";

import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { FaLink } from "react-icons/fa6";
import { createClient } from "@supabase/supabase-js";
import { Header } from "../../components/Header";

const supabase = createClient(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

interface PageProps {
  // Define the carrier type if it has more fields than just 'name'
  name: string;
}

export default function Page() {
  const [initialCarriers, setInitialCarriers] = useState<PageProps[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [newCarrierInputVisible, setNewCarrierInputVisible] =
    useState<boolean>(false);
  const [newCarrierInputValue, setNewCarrierInputValue] = useState<string>("");
  const [connectedCarriers, setConnectedCarriers] = useState<string[]>([]); // Maintain a list of connected carriers

  useEffect(() => {
    const fetchConnectedCarriers = async () => {
      try {
        const { data, error } = await supabase
          .from("carriers_users") // Replace "carriers" with your Supabase table name
          .select("carrier");

        if (error) {
          console.error("Error fetching connected carriers:", error);
        } else {
          setConnectedCarriers(data.map((item: any) => item.carrier) || []);
        }
      } catch (error) {
        console.error("Error fetching connected carriers:", error);
      }
    };

    fetchConnectedCarriers();
  }, []);

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const { data, error } = await supabase.from("carriers").select("name");

        if (error) {
          console.error("Error fetching carriers:", error);
        } else {
          setInitialCarriers(data || []);
        }
      } catch (error) {
        console.error("Error fetching carriers:", error);
      }
    };

    fetchCarriers();
  }, []);

  const handleCarrierClick = async (carrier: string) => {
    setSelectedCarrier(carrier);

    try {
      const { data, error } = await supabase
        .from("carriers_users")
        .select("username, password")
        .eq("carrier", carrier)
        .limit(1);

      if (error) {
        console.error("Error fetching saved values:", error);
      } else if (data && data.length > 0) {
        const savedValues = data[0];
        setConnectEmail(savedValues.username);
        setConnectPassword(savedValues.password);
      } else {
        // Reset values if carrier does not have saved values
        setConnectEmail("");
        setConnectPassword("");
      }
    } catch (error) {
      console.error("Error fetching saved values:", error);
    }
  };

  const handleBackButtonClick = () => {
    setSelectedCarrier("");
    // Clear username and password when leaving the page
    setConnectEmail("");
    setConnectPassword("");
  };

  const handleNewCarrierClick = () => {
    setNewCarrierInputVisible(true);
  };

  const handleNewCarrierInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewCarrierInputValue(e.target.value);
  };

  const [connectEmail, setConnectEmail] = useState<string>("");
  const [connectPassword, setConnectPassword] = useState<string>("");

  const handleConnectEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectEmail(e.target.value);
  };

  const handleConnectPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConnectPassword(e.target.value);
  };

  const handleConnect = async () => {
    try {
      // Assuming you have a table named "connections" in Supabase
      await supabase.from("carriers_users").upsert([
        {
          carrier: selectedCarrier, // Assuming you've selected a carrier
          username: connectEmail,
          password: connectPassword,
        },
      ]);

      // Do any additional actions after connecting, if needed

      // Reset the connect form
      setConnectEmail("");
      setConnectPassword("");
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const handleAddNewCarrier = async () => {
    try {
      // Validate that the carrier name is not empty
      if (newCarrierInputValue.trim() === "") {
        // Display an error message or take appropriate action
        console.error("Carrier name cannot be empty");
        return;
      }
      // Add the new carrier to Supabase
      await supabase.from("carriers").upsert([
        {
          name: newCarrierInputValue,
        },
      ]);

      // Fetch the updated list of carriers
      const { data, error } = await supabase.from("carriers").select("name");

      if (error) {
        console.error("Error fetching carriers:", error);
      } else {
        setInitialCarriers(data || []);
      }

      // Reset the new carrier input
      setNewCarrierInputVisible(false);
      setNewCarrierInputValue("");
    } catch (error) {
      console.error("Error adding new carrier:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-row bg-white">
      <Header selected="Integrations" />

      <div className="w-6/7">
        <main className="h-screen flex w-full">
          {/* <RecordTableEffect/> */}
          <div className="w-full h-screen flex justify-center items-center bg-gray-200/50 backdrop-blur-md">
            <div className="relative w-1/2 sm:w-2/3 md:w-1/2 lg:w-1/3 h-fit bg-white shadow-lg rounded-lg">
              <div className="absolute top-2 left-3">
                {selectedCarrier && (
                  <button
                    className="text-xl font-light cursor-pointer"
                    onClick={handleBackButtonClick}
                  >
                    x
                  </button>
                )}
              </div>
              <div className="flex flex-col items-center w-full p-6">
                <div className="mb-5 flex justify-center w-full">
                  <Image
                    src="/NewBlumeLogo.jpg"
                    alt="Bloom Flower"
                    width={150}
                    height={100}
                  />
                </div>

                {selectedCarrier ? (
                  <div className="w-full h-fit overflow-y-scroll bg-gray-100/25 outline outline-1 outline-gray-300 flex flex-col rounded-md p-2">
                    <form className="w-full">
                      <h1 className="text-xl font-semibold mb-2">
                        Connect with {selectedCarrier}
                      </h1>
                      <p className="mb-2 text-sm font-light">
                        Please enter your account information for{" "}
                        {selectedCarrier}. Our AI-powered tool will log in, pull
                        your commission statements, and add the appropriate
                        policies to your account.
                      </p>
                      <hr className="mt-1 mb-2"></hr>
                      <p className="text-sm">Email</p>
                      <input
                        placeholder="john@acmecorp.com"
                        className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm mb-1"
                        value={connectEmail}
                        onChange={handleConnectEmailChange}
                      />
                      <p className="text-sm mt-1">Password</p>
                      <input
                        type="password"
                        placeholder="********"
                        className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm mt-1"
                        value={connectPassword}
                        onChange={handleConnectPasswordChange}
                      />
                      <p className="mb-2 text-xs mt-2 font-light">
                        Your data is encrypted with 256-bit, bank-level
                        encryption.
                      </p>
                      <button
                        className="mt-3 bg-blue-500 text-white px-2 py-1 rounded-md flex items-center"
                        onClick={handleConnect}
                      >
                        <FaLink className="mr-2" /> Connect
                      </button>
                    </form>
                  </div>
                ) : (
                  // Display the list of carriers
                  <div className="w-full h-full">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Carrier Search"
                      className="mb-2 w-full px-3 py-1 border rounded-md border-0 outline outline-1 outline-gray-300 bg-gray-100/25"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='6'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "8px center",
                        paddingLeft: "32px",
                      }}
                    />
                    <div className="w-full h-full">
                      {newCarrierInputVisible ? (
                        <div className="flex justify-center items-center">
                          <input
                            placeholder="Enter carrier name"
                            className="w-full outline outline-1 outline-gray-300 rounded-md px-2 py-2 text-sm mb-2"
                            value={newCarrierInputValue}
                            onChange={handleNewCarrierInputChange}
                          />
                          <button
                            className="bg-gray-700 text-sm text-white px-2 py-2 rounded-md ml-2 mb-2"
                            onClick={handleAddNewCarrier}
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <div
                          className="text-center text-gray-600 cursor-pointer bg-gray-100/25 hover:bg-gray-100 mb-2 w-full px-3 py-1 border rounded-md border-0 outline outline-1 outline-gray-300"
                          onClick={handleNewCarrierClick}
                        >
                          + Add Carrier
                        </div>
                      )}
                    </div>

                    <div className="w-full max-h-72 overflow-auto bg-gray-100/25 outline outline-1 outline-gray-200 flex flex-col rounded-md p-2">
                      {initialCarriers
                        .filter((carrier: any) =>
                          carrier.name
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                        )
                        .map((carrier, index) => (
                          <div
                            key={index}
                            className={`mb-2 pt-2 pl-2 pb-2 shadow-sm cursor-pointer outline outline-1 outline-gray-200 rounded-sm ${connectedCarriers.includes(carrier.name) ? "bg-blue-100 text-gray-700" : "bg-white hover:bg-gray-100 hover:outline-gray-200 text-gray-600"}`}
                            onClick={() => handleCarrierClick(carrier.name)}
                          >
                            {/* Render your carrier content here */}
                            {carrier.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
