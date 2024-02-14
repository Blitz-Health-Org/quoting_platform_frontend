import { CommissionTablePage } from "@/src/components/commissions/CommissionTablePage";
import "../globals.css";
import { Navbar } from "@/src/components/Navbar";
export default function Home() {
  return (
    <div className="w-full h-full flex flex-row bg-white">
      <Navbar selected="Commissions" />

      <div className="w-full md:w-6/7">
        <main className="h-screen flex w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-6 pb-6 overflow-hidden text-gray-700">
          {/* <RecordTableEffect/> */}
          <CommissionTablePage />
        </main>
      </div>
    </div>
  );
}
