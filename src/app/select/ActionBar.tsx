import { ActionBarItem } from "@/src/components/record/record-table/ActionBarItem";

type ActionBarProps = {
  actionBarEntries: any[];
};

export const ActionBar = ({ actionBarEntries }: ActionBarProps) => {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex items-center h-12 px-2 border border-gray-400 rounded-md bg-gray-200 shadow-lg">
      {actionBarEntries.map((item) => {
        return (
          <ActionBarItem
            label={item.label}
            onClick={item.onClick}
            key={item.label}
          />
        );
      })}
    </div>
  );
};
