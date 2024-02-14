type ActionBarItemProps = {
  Icon?: any; //don't know
  label: string;
  onClick: () => void;
};

export const ActionBarItem = ({ Icon, label, onClick }: ActionBarItemProps) => {
  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer select-none p-2 transition-background duration-100 ease-in hover:bg-tertiary rounded-sm text-secondary"
        onClick={onClick}
      >
        {Icon}
        <div>{label}</div>
      </div>
    </>
  );
};
