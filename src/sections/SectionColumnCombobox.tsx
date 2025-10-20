"use client";

import React, { memo } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import TableHeading from "../components/TableHeading";
import StatusCombobox from "@/components/StatusCombobox";
import type { StatusOption } from "@/constants/status";
import { cellKey } from "@/lib/keys";
import { ROW_HEIGHT } from "@/constants/layout";
import { useAppStore } from "@/stores/store";
import { cn } from "@/lib/utils";

interface SectionColumnProps {
  columnName: string;
  defaultSize: number;
  minSize?: number;
  tableData: Array<{ id: number }>;
  icon?: React.ReactNode;
  options?: StatusOption[];
  onChange?: (rowId: number, value: number | string | undefined) => void;
  idPrefix?: string; // for deterministic IDs independent from column label
}

const SectionColumnCombobox = ({
  columnName,
  defaultSize,
  minSize = 3,
  tableData,
  icon,
  options,
  onChange,
  idPrefix,
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
              className={cn(ROW_HEIGHT, "relative flex items-center justify-center")}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              <StatusCombobox
                id={cellKey(columnName, row.id, idPrefix)}
                options={options}
                onChange={(value) => onChange?.(row.id, value)}
              />
            </div>
          ))}
        </div>
      </div>
    </ResizablePanel>
  );
};

export default memo(SectionColumnCombobox);
