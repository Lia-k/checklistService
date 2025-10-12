"use client";

import { cn } from "@/lib/utils";
import TableName from "@/components/TableName";
import PlusTableButton from "@/components/PlusTableButton";
import { useAppStore } from "@/stores/store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";

interface SectionTablesCountProps {
  className?: string;
}

const SectionTablesCount = ({ className }: SectionTablesCountProps) => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const tables = useAppStore((state) => state.tables);
  const currentTableId = useAppStore((state) => state.currentTableId);
  const setCurrentTable = useAppStore((state) => state.setCurrentTable);
  const removeTable = useAppStore((state) => state.removeTable);

  // Simple hydration check
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Don't render until hydrated to avoid mismatch
  if (!hasHydrated) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Current table name editor */}
      <TableName />

      {/* Table tabs */}
      <div className="flex gap-2 items-center">
        {tables.map((table) => (
          <ContextMenu key={table.id}>
            <ContextMenuTrigger asChild>
              <Button
                variant={currentTableId === table.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTable(table.id)}
                className="text-xs"
              >
                {table.name}
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              {tables.length > 1 && (
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => removeTable(table.id)}
                >
                  <Trash2 />
                  Remove table
                </ContextMenuItem>
              )}
              {tables.length === 1 && (
                <ContextMenuItem disabled>
                  Cannot remove the last table
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
        ))}
        <PlusTableButton />
      </div>
    </div>
  );
};

export default SectionTablesCount;
