"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";
import { useIsClient } from "@/hooks/useIsClient";

interface SectionHeadingProps {
  className?: string;
  disabled?: boolean;
  onNameChange?: (newName: string) => void;
}

const SectionHeading = ({ className, disabled = false, onNameChange }: SectionHeadingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const checklistName = useAppStore((state) => state.checklistName);
  const setChecklistName = useAppStore((state) => state.setChecklistName);
  const isClient = useIsClient();

  // Focus the input when editing mode is activated
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditText(checklistName);
  };

  const finishEditing = () => {
    setIsEditing(false);
    const trimmedText = editText.trim();
    if (trimmedText) {
      setChecklistName(trimmedText);
      onNameChange?.(trimmedText);
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

  if (!isClient) return null;

  return (
    <div className={cn("w-full", className)}>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Checklist name"
          aria-label="Checklist name"
          className="text-3xl font-bold max-w-md"
        />
      ) : (
        <h2 className="text-2xl font-bold">
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={cn(
              "p-2 rounded transition-colors text-left",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted"
            )}
            aria-label="Edit checklist name"
          >
            {checklistName}
          </button>
        </h2>
      )}
    </div>
  );
};

export default SectionHeading;
