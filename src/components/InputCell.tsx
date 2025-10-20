"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";
import { useIsClient } from "@/hooks/useIsClient";

interface InputCellsProps {
  id: string;
  initialValue?: string;
  className?: string;
  onValueChange?: (id: string, value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onCommit?: (id: string, value: string, reason: "enter" | "blur") => void;
}

const InputCell = ({
  id,
  initialValue = "",
  className,
  onValueChange,
  disabled = false,
  placeholder,
  onCommit,
}: InputCellsProps) => {
  const storeValue = useAppStore((state) => state.getInputValue(id));
  const setStoreInputValue = useAppStore((state) => state.setInputValue);

  const isClient = useIsClient();

  const [isEditing, setIsEditing] = useState(false);
  const [previousValue, setPreviousValue] = useState(initialValue);
  const [editValue, setEditValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [overlayRect, setOverlayRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!isClient) return;

    const currentStoreValue = useAppStore.getState().getInputValue(id);

    if (currentStoreValue === "" && initialValue !== "") {
      setStoreInputValue(id, initialValue);
      setPreviousValue(initialValue);
    } else {
      setPreviousValue(currentStoreValue);
    }
  }, [id, initialValue, setStoreInputValue, isClient]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const currentDisplayValue = editValue;
      textareaRef.current.focus();
      textareaRef.current.value = currentDisplayValue;
      const length = currentDisplayValue.length;
      textareaRef.current.setSelectionRange(length, length);
      // Compute required height: at least anchor height, up to 60vh
      const scrollH = textareaRef.current.scrollHeight;
      const base = overlayRect?.height ?? anchorRef.current?.getBoundingClientRect().height ?? 0;
      const maxH = Math.floor(window.innerHeight * 0.6);
      const needed = Math.max(base, Math.min(scrollH, maxH));
      setContainerHeight(needed);
    }
  }, [isEditing, editValue, overlayRect]);

  // Track the anchor position for the portal overlay
  useEffect(() => {
    if (!isEditing) return;
    const updateRect = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setOverlayRect({ left: r.left, top: r.top, width: r.width, height: r.height });
      setContainerHeight((h) => (h == null ? r.height : Math.max(h, r.height)));
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isEditing]);

  const handleClick = () => {
    if (disabled) return;
    const current = isClient ? storeValue : initialValue;
    setPreviousValue(current);
    setEditValue(current);
    // Precompute overlay rect so the portal renders immediately in place
    if (anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setOverlayRect({ left: r.left, top: r.top, width: r.width, height: r.height });
      setContainerHeight(r.height);
    }
    setIsEditing(true);
  };

  // While editing, keep overlay position and height in sync with layout changes
  useEffect(() => {
    if (!isEditing) return;
    let raf = 0;
    const tick = () => {
      const el = anchorRef.current;
      const ta = textareaRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        // Only update if meaningful change
        if (!overlayRect || r.left !== overlayRect.left || r.top !== overlayRect.top || r.width !== overlayRect.width || r.height !== overlayRect.height) {
          setOverlayRect({ left: r.left, top: r.top, width: r.width, height: r.height });
        }
        if (ta) {
          const scrollH = ta.scrollHeight;
          const maxH = Math.floor(window.innerHeight * 0.6);
          const needed = Math.max(r.height, Math.min(scrollH, maxH));
          if (containerHeight !== needed) setContainerHeight(needed);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onValueChange) {
      onValueChange(id, editValue);
    }
    if (editValue !== previousValue) setStoreInputValue(id, editValue);
    if (typeof onCommit === "function") onCommit(id, editValue, "blur");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentValue = e.currentTarget.value;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (currentValue !== previousValue) setStoreInputValue(id, currentValue);
      setIsEditing(false);
      if (onValueChange) {
        onValueChange(id, currentValue);
      }
      if (typeof onCommit === "function") onCommit(id, currentValue, "enter");
    } else if (e.key === "Escape") {
      setEditValue(previousValue);
      setIsEditing(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
  };

  const displayValue = isEditing
    ? editValue
    : isClient
    ? storeValue
    : initialValue;

  return (
    <div ref={anchorRef} className={cn("w-full h-full relative", className)}>
      {isEditing && overlayRect
        ? createPortal(
            <div
              style={{
                position: "fixed",
                left: overlayRect.left,
                top: overlayRect.top,
                width: overlayRect.width,
                zIndex: 9999,
              }}
            >
              <div
                className="relative rounded-md shadow-lg border border-gray-200 bg-white box-border"
                style={{ height: containerHeight ?? overlayRect.height }}
              >
                <textarea
                  ref={textareaRef}
                  value={displayValue}
                  onChange={handleTextareaChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full p-2 text-sm rounded-md bg-white resize-none overflow-auto box-border"
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={1}
                  name={id}
                  autoFocus
                />
              </div>
            </div>,
            document.body
          )
        : (
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled}
              title={displayValue}
              className={cn(
                "w-full p-2 text-left hover:bg-gray-50 transition-colors overflow-hidden text-ellipsis text-sm truncate h-9",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"
              )}
            >
              {displayValue || placeholder}
            </button>
          )}
    </div>
  );
};

export default memo(InputCell);
