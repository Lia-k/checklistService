"use client";

import { useState, useRef, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/store";
import { cn } from "@/lib/utils";

interface TableNameProps {
  className?: string;
  disabled?: boolean;
  onNameChange?: (newName: string, tableId: string) => void;
}

const TableName = ({ className, disabled = false, onNameChange }: TableNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTable = useAppStore((state) => state.getCurrentTable());
  const updateTableName = useAppStore((state) => state.updateTableName);

  // Focus the input when editing mode is activated
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (disabled || !currentTable) return;
    setIsEditing(true);
    setEditText(currentTable.name);
    setEditingTableId(currentTable.id);
  };

  const finishEditing = () => {
    setIsEditing(false);
    const trimmedText = editText.trim();
    const tableId = editingTableId ?? useAppStore.getState().getCurrentTable()?.id;
    if (trimmedText && tableId) {
      const freshCurrent = useAppStore.getState().tables.find((t) => t.id === tableId);
      if (!freshCurrent || trimmedText !== freshCurrent.name) {
        updateTableName(tableId, trimmedText);
        if (onNameChange) onNameChange(trimmedText, tableId);
      }
    }
    setEditingTableId(null);
  };

  const handleBlur = () => {
    finishEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEditing();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (!currentTable) {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-3.5 flex items-center border-b border-border w-fit",
        className
      )}
    >
      <TableProperties className="h-5 w-5 text-gray-600" />
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0 min-w-[100px] rounded-none"
        />
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Edit table name"
        >
          {currentTable.name}
        </button>
      )}
    </div>
  );
};

export default TableName;
