"use client";
import { useSearchParams } from "next/navigation";

type ClientPageProps = {};

const ClientPage = (props: ClientPageProps) => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id");

  return <div>ClientPage</div>;
};

export default ClientPage;
