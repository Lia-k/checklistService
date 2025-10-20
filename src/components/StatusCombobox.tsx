"use client";

import React, { useEffect, memo } from "react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";
import { STATUS_OPTIONS, getStatusColor, type StatusOption } from "@/constants/status";
import { useIsClient } from "@/hooks/useIsClient";

interface StatusComboboxProps {
  id: string;
  className?: string;
  initialValue?: number | string | undefined;
  options?: StatusOption[];
  onChange?: (value: number | string | undefined) => void;
}

const StatusComboboxComponent = ({
  id,
  className,
  initialValue,
  options = STATUS_OPTIONS,
  onChange,
}: StatusComboboxProps) => {
  const storeValue = useAppStore((state) => state.getStatusValue(id));
  const setStoreStatusValue = useAppStore((state) => state.setStatusValue);

  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const currentStoreValue = useAppStore.getState().getStatusValue(id);

    if (currentStoreValue === undefined && initialValue !== undefined) {
      setStoreStatusValue(id, initialValue);
    }
  }, [id, initialValue, setStoreStatusValue, isClient]);

  const displayValue = isClient ? storeValue : initialValue;

  const handleValueChange = (selectedValue: string | number | undefined) => {
    if (selectedValue === undefined || selectedValue === null) {
      setStoreStatusValue(id, undefined);
      if (onChange) onChange(undefined);
      return;
    }

    const numericMatch = options.find((opt) => opt.id === selectedValue);
    if (numericMatch) {
      setStoreStatusValue(id, numericMatch.id);
      if (onChange) onChange(numericMatch.id);
      return;
    }

    if (typeof selectedValue === "string" && selectedValue.trim() !== "") {
      const trimmedValue = selectedValue.trim();
      setStoreStatusValue(id, trimmedValue);
      if (onChange) onChange(trimmedValue);
      return;
    }

    // Fallback if not matched, not string, or empty string
    setStoreStatusValue(id, undefined);
    if (onChange) onChange(undefined);
  };

  return (
    <Combobox
      options={options}
      value={displayValue}
      onChange={handleValueChange}
      ariaLabel={
        typeof displayValue === "number"
          ? options.find((o) => o.id === displayValue)?.title || "Status"
          : typeof displayValue === "string" && displayValue.trim() !== ""
          ? displayValue
          : "Status"
      }
      placeholder="Status..."
      commandPlaceholder="Search or type custom..."
      inputClass={cn(
        "w-4/5 max-w-fulltransition-colors transparent !pl-2.5",
        getStatusColor(displayValue as number | undefined, options),
        className
      )}
    />
  );
};

const StatusCombobox = memo(StatusComboboxComponent);
export default StatusCombobox;
