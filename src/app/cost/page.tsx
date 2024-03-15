import { useSearchParams } from "next/navigation";

type CostPageProps = {};

const CostPage = (props: CostPageProps) => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  return <div>page</div>;
};

export default CostPage;
