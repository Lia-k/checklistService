"use client";

import React, { memo } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import TableHeading from "../components/TableHeading";
import InputCell from "@/components/InputCell";
import { cellKey } from "@/lib/keys";
import { ROW_HEIGHT } from "@/constants/layout";
import { useAppStore } from "@/stores/store";

interface SectionColumnProps {
  columnName: string;
  defaultSize: number;
  minSize?: number;
  tableData: Array<{ id: number }>;
  icon?: React.ReactNode;
  onCommit?: (rowId: number, value: string, reason: "enter" | "blur") => void;
}

const SectionColumnInput = ({
  columnName,
  defaultSize,
  minSize = 5,
  tableData,
  icon,
  onCommit,
}: SectionColumnProps) => {

  const setHoveredRowId = useAppStore((s) => s.setHoveredRowId);
  return (
    <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
      <div className="h-full">
        <TableHeading tableName={columnName} icon={icon} />
        <div className="divide-y border-b">
          {tableData.map((row) => (
            <div
              key={row.id}
              className={`${ROW_HEIGHT} relative`}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              <InputCell
                id={cellKey(columnName, row.id)}
                onCommit={(id, value, reason) => onCommit?.(row.id, value, reason)}
              />
            </div>
          ))}
        </div>
      </div>
    </ResizablePanel>
  );
};

export default memo(SectionColumnInput);
