"use client";

import React, { memo } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import TableHeading from "../components/TableHeading";
import { ROW_HEIGHT } from "@/constants/layout";
import { useAppStore } from "@/stores/store";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface SectionColumnIndexProps {
  defaultSize: number;
  minSize?: number;
  tableData: Array<{ id: number }>;
}

const SectionColumnIndex = ({
  defaultSize,
  minSize = 3,
  tableData,
}: SectionColumnIndexProps) => {
  const setHoveredRowId = useAppStore((s) => s.setHoveredRowId);
  const hoveredRowId = useAppStore((s) => s.hoveredRowId);
  const addRowAfter = useAppStore((s) => s.addRowAfter);
  const removeRow = useAppStore((s) => s.removeRow);

  return (
    <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
      <div className="h-full">
        <TableHeading title="" align="center" />
        <div className="divide-y border-b">
          {tableData.map((row, idx) => (
            <div
              key={row.id}
              className={`${ROW_HEIGHT} relative flex items-center justify-center text-xs text-muted-foreground select-none`}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              {idx + 1}
              <div
                className={`absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-opacity ${
                  hoveredRowId === row.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => addRowAfter(row.id)}
                  aria-label={`Add row after ${row.id}`}
                  title="Add row"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove row ${row.id}`}
                  title="Remove row"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResizablePanel>
  );
};

export default memo(SectionColumnIndex);
