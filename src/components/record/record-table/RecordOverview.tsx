import { Dispatch, SetStateAction } from "react";

type RecordOverviewProps = {
  tableName: {
    singular: string;
    plural: string;
  };
  setTab: Dispatch<SetStateAction<string>>;
};

const RecordOverview = ({ tableName }: RecordOverviewProps) => {
  return <div>RecordOverview coming soon!</div>;
};

export default RecordOverview;
