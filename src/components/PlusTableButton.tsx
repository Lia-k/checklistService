"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/store";

interface PlusTableButtonProps {
  className?: string;
}

const PlusTableButton = ({ className }: PlusTableButtonProps) => {
  const addTable = useAppStore((state) => state.addTable);

  const handleAddTable = () => {
    addTable();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={handleAddTable}
      title="Add new table"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
};

export default PlusTableButton;
