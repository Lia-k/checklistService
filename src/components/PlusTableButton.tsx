"use client";

import React, { memo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/store";

interface PlusTableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  onAdded?: () => void; // fired after a table is added
}

const PlusTableButton = ({
  className,
  title,
  icon,
  onClick,
  onAdded,
  disabled,
  ...rest
}: PlusTableButtonProps) => {
  const addTable = useAppStore((state) => state.addTable);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Allow consumers to intercept or prevent default behavior
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    addTable();
    onAdded?.();
  };

  const ariaLabel = rest["aria-label"] ?? title ?? "Add new table";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      onClick={handleClick}
      title={title ?? "Add new table"}
      aria-label={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      {icon ?? <Plus className="h-4 w-4" />}
    </Button>
  );
};

export default memo(PlusTableButton);
