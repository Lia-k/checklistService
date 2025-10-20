"use client";

import React, { memo, useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import TableHeading from "../components/TableHeading";
import { Button } from "@/components/ui/button";
import { ROW_HEIGHT } from "@/constants/layout";
import { useAppStore } from "@/stores/store";
import { cellKey } from "@/lib/keys";
import ReportBugDialog from "@/components/ReportBugDialog";

interface SectionColumnBugReportProps {
  columnName: string;
  defaultSize: number;
  minSize?: number;
  tableData: Array<{ id: number }>;
  icon?: React.ReactNode;
}

const SectionColumnBugReport = ({
  columnName,
  defaultSize,
  minSize = 5,
  tableData,
  icon,
}: SectionColumnBugReportProps) => {
  const setHoveredRowId = useAppStore((s) => s.setHoveredRowId);
  const getBugReports = useAppStore((s) => s.getBugReports);
  const [open, setOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [activeBugIndex, setActiveBugIndex] = useState<number | null>(null);

  return (
    <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
      <div className="h-full">
        <TableHeading tableName={columnName} icon={icon} />
        <div className="divide-y border-b">
          {tableData.map((row) => (
            <div
              key={row.id}
              className={`${ROW_HEIGHT} relative flex items-center`}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  id={cellKey(columnName, row.id, "bug")}
                  onClick={() => {
                    setActiveRowId(row.id);
                    setActiveBugIndex(null);
                    setOpen(true);
                  }}
                  aria-label="Report bug"
                  title="Report bug"
                >
                  Report bug
                </Button>
                {getBugReports(row.id).map((b, i) => (
                  <Button
                    key={`${row.id}-${i}`}
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setActiveRowId(row.id);
                      setActiveBugIndex(i);
                      setOpen(true);
                    }}
                    aria-label={`Open bug ${b.id || `#${i + 1}`}`}
                    title="Open bug"
                  >
                    {b.id || `#${i + 1}`}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <ReportBugDialog
          open={open}
          onOpenChange={setOpen}
          rowId={activeRowId}
          bugIndex={activeBugIndex}
        />
      </div>
    </ResizablePanel>
  );
};

export default memo(SectionColumnBugReport);
