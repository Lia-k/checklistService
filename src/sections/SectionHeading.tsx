"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";

interface SectionHeadingProps {
  className?: string;
}

const SectionHeading = ({ className }: SectionHeadingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const checklistName = useAppStore((state) => state.checklistName);
  const setChecklistName = useAppStore((state) => state.setChecklistName);

  // Focus the input when editing mode is activated
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
    setEditText(checklistName);
  };

  const finishEditing = () => {
    setIsEditing(false);
    const trimmedText = editText.trim();
    if (trimmedText) {
      setChecklistName(trimmedText);
    }
    // If empty, keep the current value (no change)
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
      // Reset to original value without saving
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-3xl font-bold max-w-md"
        />
      ) : (
        <h2
          onClick={handleClick}
          className="text-2xl font-bold cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
        >
          {checklistName}
        </h2>
      )}
    </div>
  );
};

export default SectionHeading;
