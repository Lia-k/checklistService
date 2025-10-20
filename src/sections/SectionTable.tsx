"use client";

import { useMemo, Fragment } from "react";
import { ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import SectionColumnInput from "@/sections/SectionColumnInput";
import SectionColumnCombobox from "@/sections/SectionColumnCombobox";
import SectionColumnBugReport from "@/sections/SectionColumnBugReport";
import SectionColumnIndex from "@/sections/SectionColumnIndex";
import { FileText, Footprints, GitBranch, MessageCircleWarning } from "lucide-react";
import { useAppStore } from "@/stores/store";
import { useIsClient } from "@/hooks/useIsClient";
import { ROW_HEIGHT } from "@/constants/layout";
import { cn } from "@/lib/utils";

const SectionTable = () => {
  const isClient = useIsClient();
  // Select the current table's rows; call the selector function
  const rows = useAppStore((s) => s.getRows());
  const tableData = useMemo(() => rows.map((id) => ({ id })), [rows]);
  const addRowAfter = useAppStore((s) => s.addRowAfter);

  // Column configuration for clarity and maintainability
  const columns = useMemo(() => ([
    {
      type: "index" as const,
      name: "#",
      defaultSize: 5,
      minSize: 3,
    },
    {
      type: "input" as const,
      name: "Source",
      defaultSize: 10,
      minSize: 5,
      icon: <FileText size={16} className="flex-shrink-0" />,
    },
    {
      type: "input" as const,
      name: "Step",
      defaultSize: 25,
      minSize: 5,
      icon: <Footprints size={16} className="flex-shrink-0" />,
    },
    {
      type: "combo" as const,
      name: "Stage",
      defaultSize: 6,
      minSize: 3,
      icon: <GitBranch size={16} className="flex-shrink-0" />,
      idPrefix: "stage",
    },
    {
      type: "combo" as const,
      name: "Prod",
      defaultSize: 6,
      minSize: 3,
      icon: <GitBranch size={16} className="flex-shrink-0" />,
      idPrefix: "prod",
    },
    {
      type: "bugsColumn" as const,
      name: "Bug report",
      defaultSize: 25,
      minSize: 5,
      icon: <MessageCircleWarning size={16} className="flex-shrink-0" />,
    },
  ]), []);

  if (!isClient) {
    const skeletonRows = 5;
    return (
      <div className="overflow-x-auto">
        <div className="flex w-full">
          {columns.map((col, idx) => (
            <div
              key={`sk-header-${idx}`}
              className="h-10 border-b flex items-center px-2"
              style={{ width: `${col.defaultSize}%` }}
            >
              <div className={cn("h-3 w-1/2 rounded bg-muted animate-pulse")} />
            </div>
          ))}
        </div>
        {Array.from({ length: skeletonRows }).map((_, r) => (
          <div key={`sk-row-${r}`} className="flex w-full">
            {columns.map((col, cidx) => (
              <div
                key={`sk-cell-${r}-${cidx}`}
                className={cn("border-b px-2 flex items-center", ROW_HEIGHT)}
                style={{ width: `${col.defaultSize}%` }}
              >
                <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <ResizablePanelGroup direction="horizontal">
        {columns.map((col, idx) => (
          <Fragment key={`col-group-${col.name}`}>
            {col.type === "index" && (
              <SectionColumnIndex
                defaultSize={col.defaultSize}
                minSize={col.minSize}
                tableData={tableData}
              />
            )}
            {col.type === "input" && (
              <SectionColumnInput
                columnName={col.name}
                defaultSize={col.defaultSize}
                minSize={col.minSize}
                tableData={tableData}
                icon={col.icon}
                onCommit={(rowId, value, reason) => {
                  if (col.name === "Step" && reason === "enter" && value.trim() !== "") {
                    const currentRows = useAppStore.getState().getRows();
                    const lastId = currentRows[currentRows.length - 1];
                    if (rowId === lastId) {
                      addRowAfter(rowId);
                    }
                  }
                }}
              />
            )}
            {col.type === "combo" && (
              <SectionColumnCombobox
                columnName={col.name}
                defaultSize={col.defaultSize}
                minSize={col.minSize}
                tableData={tableData}
                icon={col.icon}
                idPrefix={col.idPrefix}
              />
            )}
            {col.type === "bugsColumn" && (
              <SectionColumnBugReport
                columnName={col.name}
                defaultSize={col.defaultSize}
                minSize={col.minSize}
                tableData={tableData}
                icon={col.icon}
              />
            )}
            {idx < columns.length - 1 && <ResizableHandle />}
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
};

export default SectionTable;
