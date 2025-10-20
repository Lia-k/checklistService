import React, { memo } from "react";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right";

interface TableHeadingProps {
  tableName?: string;
  title?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  align?: Align;
  as?: React.ElementType;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

const alignToJustify: Record<Align, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const TableHeading = ({
  tableName,
  title,
  icon = <Landmark size={16} className="flex-shrink-0" />,
  right,
  align = "center",
  as = "div",
  className,
  titleClassName,
  iconClassName,
  children,
}: TableHeadingProps) => {
  const Comp = (as as React.ElementType) || "div";
  const displayTitle = title ?? tableName ?? "";

  return (
    <Comp
      className={cn(
        "flex items-center gap-1 p-1 h-10 bg-background font-medium border-b",
        alignToJustify[align],
        className
      )}
    >
      {icon && (
        <span className={cn("flex-shrink-0", iconClassName)}>{icon}</span>
      )}
      {children ? (
        children
      ) : (
        <span className={cn("text-sm pr-2", titleClassName)}>{displayTitle}</span>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </Comp>
  );
};

export default memo(TableHeading);
