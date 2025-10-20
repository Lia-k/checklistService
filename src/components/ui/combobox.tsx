"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  id: number;
  title: string;
  groupId?: number;
  groupTitle?: string;
}

interface ComboboxProps<T extends number | string | undefined> {
  options: Option[];
  value?: T;
  onChange: (value: T | undefined) => void;
  renderOption?: (option: Option) => ReactNode;
  renderValue?: (option: Option | { id: string; title: string }) => ReactNode;
  commandPlaceholder?: string;
  inputClass?: string;
  optionsContentClass?: string;
  placeholder?: string;
  ariaLabel?: string;
}

export function Combobox<T extends number | string | undefined>({
  options,
  value,
  onChange,
  renderOption = ({ title }) => title,
  renderValue = (opt) => opt.title,
  placeholder = "Select an option...",
  commandPlaceholder = "Type to search...",
  inputClass,
  optionsContentClass,
  ariaLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const groups = options.reduce<
    { id: number; title?: string; options: Option[] }[]
  >((acc, option) => {
    const group = acc.find((g) => g.id === (option.groupId ?? 0));
    if (group) {
      group.options.push(option);
    } else {
      acc.push({
        id: option.groupId ?? 0,
        title: option.groupTitle,
        options: [option],
      });
    }
    return acc;
  }, []);

  const trimmedInputValue = inputValue.trim();
  // Find selected predefined option
  const selectedPredefinedOption = options.find(
    (option) => option.id === value
  );

  // Determine what to display in the button
  let displayValueContent: ReactNode | null = null;
  if (typeof value === "number" && selectedPredefinedOption) {
    // If value is a number ID and matches a predefined option
    displayValueContent = renderValue(selectedPredefinedOption);
  } else if (typeof value === "string" && value.trim() !== "") {
    // If value is a non-empty string (custom value)
    // Pass a compatible object to renderValue
    displayValueContent = renderValue({ id: value, title: value });
  }

  const matchingOption = options.find(
    (option) => option.title.toLowerCase() === trimmedInputValue.toLowerCase()
  );

  // Show "Add custom" if input has text and doesn't exactly match a predefined option title
  const showCustomOption = trimmedInputValue !== "" && !matchingOption;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          size="xs"
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label={
            ariaLabel ??
            (typeof value === "number" && selectedPredefinedOption
              ? selectedPredefinedOption.title
              : typeof value === "string" && value.trim() !== ""
              ? value
              : placeholder)
          }
          className={cn(
            "w-full mt-px justify-between bg-transparent hover:bg-transparent font-normal focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-offset-0 hover:cursor-pointer text-xs",
            inputClass
          )}
        >
          {displayValueContent ? (
            displayValueContent
          ) : (
            <span className="text-muted-foreground truncate">
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="h-2 w-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[--radix-popover-trigger-width] p-0",
          optionsContentClass
        )}
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder={commandPlaceholder}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && showCustomOption) {
                e.preventDefault();
                onChange(trimmedInputValue as T);
                setInputValue("");
                setOpen(false);
              }
            }}
          />
          <CommandList>
            {/* Render predefined options */}
            {groups.map((group) => (
              <CommandGroup key={group.id} heading={group.title}>
                {group.options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.title}
                    onSelect={() => {
                      onChange(
                        value === option.id ? undefined : (option.id as T)
                      );
                      setInputValue("");
                      setOpen(false);
                    }}
                  >
                    {renderOption(option)}
                    {value === option.id && (
                      <Check className="ml-auto h-4 w-4 shrink-0" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {/* Render "Add custom option" */}
            {showCustomOption && (
              <CommandGroup heading="Add custom option">
                <CommandItem
                  value={trimmedInputValue}
                  onSelect={() => {
                    onChange(trimmedInputValue as T);
                    setInputValue("");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>{trimmedInputValue}</span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
