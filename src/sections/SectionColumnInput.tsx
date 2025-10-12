"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import TableHeading from "../components/TableHeading";
import InputCell from "@/components/InputCells";

interface SectionColumnProps {
  columnName: string;
  defaultSize: number;
  minSize?: number;
  tableData: Array<{ id: number }>;
  icon?: React.ReactNode;
}

const SectionColumnInput = ({
  columnName,
  defaultSize,
  minSize = 5,
  tableData,
  icon,
}: SectionColumnProps) => {
  return (
    <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
      <div className="h-full">
        <TableHeading tableName={columnName} icon={icon} />
        <div className="divide-y">
          {tableData.map((row) => (
            <div key={row.id} className="h-9">
              <InputCell id={`${columnName}-${row.id}`} />
            </div>
          ))}
        </div>
      </div>
    </ResizablePanel>
  );
};

export default SectionColumnInput;
