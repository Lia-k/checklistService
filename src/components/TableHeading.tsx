import { Landmark } from "lucide-react";

interface TableHeadingProps {
  tableName?: string;
  icon?: React.ReactNode;
}

const TableHeading = ({
  tableName,
  icon = <Landmark size={16} className="flex-shrink-0" />,
}: TableHeadingProps) => {
  return (
    <div className="flex items-center justify-center gap-1 p-1 h-10 bg-background font-medium border-b">
      {icon}
      <span className="text-sm pr-2">{tableName}</span>
    </div>
  );
};

export default TableHeading;
