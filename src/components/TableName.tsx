"use client";

import { useState, useRef, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/store";
import { cn } from "@/lib/utils";

interface TableNameProps {
  className?: string;
}

const TableName = ({ className }: TableNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
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
    if (!currentTable) return;
    setIsEditing(true);
    setEditText(currentTable.name);
  };

  const finishEditing = () => {
    setIsEditing(false);
    const trimmedText = editText.trim();
    if (trimmedText && currentTable && trimmedText !== currentTable.name) {
      updateTableName(currentTable.id, trimmedText);
    }
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
        "mb-3.5 flex items-center border-b-2 border-black w-fit",
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
        <span
          onClick={handleClick}
          className="font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          {currentTable.name}
        </span>
      )}
    </div>
  );
};

export default TableName;
