"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";

interface InputCellsProps {
  id: string;
  initialValue?: string;
  className?: string;
  onValueChange?: (id: string, value: string) => void;
}

const InputCell = ({
  id,
  initialValue = "",
  className,
  onValueChange,
}: InputCellsProps) => {
  const storeValue = useAppStore((state) => state.getInputValue(id));
  const setStoreInputValue = useAppStore((state) => state.setInputValue);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [previousValue, setPreviousValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hasMounted) return;

    const currentStoreValue = useAppStore.getState().getInputValue(id);

    if (currentStoreValue === "" && initialValue !== "") {
      setStoreInputValue(id, initialValue);
      setPreviousValue(initialValue);
    } else {
      setPreviousValue(currentStoreValue);
    }
  }, [id, initialValue, setStoreInputValue, hasMounted]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const currentDisplayValue = hasMounted ? storeValue : initialValue;
      textareaRef.current.focus();
      textareaRef.current.value = currentDisplayValue;
      const length = currentDisplayValue.length;
      textareaRef.current.setSelectionRange(length, length);
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, storeValue, initialValue, hasMounted]);

  const handleClick = () => {
    setPreviousValue(hasMounted ? storeValue : initialValue);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onValueChange) {
      onValueChange(id, storeValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentValue = e.currentTarget.value;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (storeValue !== currentValue) {
        setStoreInputValue(id, currentValue);
      }
      setIsEditing(false);
      if (onValueChange) {
        onValueChange(id, currentValue);
      }
    } else if (e.key === "Escape") {
      setStoreInputValue(id, previousValue);
      setIsEditing(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setStoreInputValue(id, newValue);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const displayValue = hasMounted ? storeValue : initialValue;

  return (
    <div className={cn("w-full h-full relative", className)}>
      {isEditing ? (
        <div className="absolute z-50 min-w-full h-full">
          <div className="relative h-full rounded-md shadow-lg border border-gray-200">
            <textarea
              ref={textareaRef}
              value={displayValue}
              onChange={handleTextareaChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full p-2 text-sm rounded-md bg-white resize-none"
              rows={1}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-full p-2 cursor-text hover:bg-gray-50 transition-colors overflow-hidden text-ellipsis text-sm truncate h-9"
        >
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default InputCell;
