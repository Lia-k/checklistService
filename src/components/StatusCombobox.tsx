"use client";

import { useState, useEffect } from "react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";

const statusOptions = [
  { id: 1, title: "pass" },
  { id: 2, title: "fail" },
  { id: 3, title: "blocked" },
  { id: 4, title: "clarify" },
  { id: 5, title: "skip" },
];

const getStatusColor = (
  value: number | undefined,
  options: typeof statusOptions
) => {
  if (!value) return "";

  const status = options.find((opt) => opt.id === value)?.title;
  switch (status) {
    case "pass":
      return "bg-green-100 hover:bg-green-200";
    case "fail":
      return "bg-red-100 hover:bg-red-200";
    case "blocked":
      return "bg-gray-200 hover:bg-gray-300";
    case "clarify":
      return "bg-yellow-100 hover:bg-yellow-200";
    case "skip":
      return "bg-slate-100 hover:bg-slate-200";
    default:
      return "bg-blue-50 hover:bg-blue-100";
  }
};

interface StatusComboboxProps {
  id: string;
  className?: string;
  initialValue?: number | string | undefined;
}

const StatusCombobox = ({
  id,
  className,
  initialValue,
}: StatusComboboxProps) => {
  const storeValue = useAppStore((state) => state.getStatusValue(id));
  const setStoreStatusValue = useAppStore((state) => state.setStatusValue);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const currentStoreValue = useAppStore.getState().getStatusValue(id);

    if (currentStoreValue === undefined && initialValue !== undefined) {
      setStoreStatusValue(id, initialValue);
    }
  }, [id, initialValue, setStoreStatusValue, hasMounted]);

  const displayValue = hasMounted ? storeValue : initialValue;

  const handleValueChange = (selectedValue: string | number | undefined) => {
    if (selectedValue === undefined || selectedValue === null) {
      setStoreStatusValue(id, undefined);
      return;
    }

    const numericMatch = statusOptions.find((opt) => opt.id === selectedValue);
    if (numericMatch) {
      setStoreStatusValue(id, numericMatch.id);
      return;
    }

    if (typeof selectedValue === "string" && selectedValue.trim() !== "") {
      const trimmedValue = selectedValue.trim();
      setStoreStatusValue(id, trimmedValue);
      return;
    }

    // Fallback if not matched, not string, or empty string
    setStoreStatusValue(id, undefined);
  };

  return (
    <Combobox
      options={statusOptions}
      value={displayValue}
      onChange={handleValueChange}
      placeholder="Status..."
      commandPlaceholder="Search or type custom..."
      inputClass={cn(
        "h-9 w-full transition-colors",
        getStatusColor(displayValue as number | undefined, statusOptions),
        className
      )}
    />
  );
};

export default StatusCombobox;
