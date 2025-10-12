"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageDialog } from "@/components/ImageDialog";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/store";

// Add id and optional initialValue to props
interface ScreenshotInputProps {
  id: string;
  initialValue?: string[];
}

export function ScreenshotInput({
  id,
  initialValue = [],
}: ScreenshotInputProps) {
  // Local state only for UI interaction (active border)
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store integration
  const storeImagesFromSelector = useAppStore((state) =>
    state.getScreenshotValue(id)
  );
  const storeImages = useMemo(
    () => storeImagesFromSelector ?? [],
    [storeImagesFromSelector]
  );
  const setStoreImages = useAppStore((state) => state.setScreenshotValue);

  // Hydration handling
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to initialize store with initialValue after mount
  useEffect(() => {
    if (!hasMounted) return;

    const currentStoreValueFromState = useAppStore
      .getState()
      .getScreenshotValue(id);
    const currentStoreValue = currentStoreValueFromState ?? [];
    // If store is empty (or default empty array from getter) AND initialValue has items
    if (currentStoreValue.length === 0 && initialValue.length > 0) {
      setStoreImages(id, initialValue);
    }
  }, [id, initialValue, setStoreImages, hasMounted]);

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const newImagesFromPaste: string[] = [];
      let filesProcessed = 0;
      const imageItems = Array.from(items).filter(
        (item) => item.type.indexOf("image") === 0
      );

      if (imageItems.length === 0) return;

      for (const item of imageItems) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              newImagesFromPaste.push(result);
              filesProcessed++;
              if (filesProcessed === imageItems.length) {
                // Update store by combining existing store images with new ones from paste
                setStoreImages(id, [...storeImages, ...newImagesFromPaste]);
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    },
    [id, storeImages, setStoreImages]
  );

  const removeImage = useCallback(
    (indexToRemove: number) => {
      const updatedImages = storeImages.filter(
        (_, index) => index !== indexToRemove
      );
      setStoreImages(id, updatedImages);
    },
    [id, storeImages, setStoreImages] // Depend on store values and setters
  );

  const handleClick = useCallback(() => {
    setIsActive(true);
    containerRef.current?.focus();
  }, []);

  const handleBlur = useCallback(() => {
    setIsActive(false);
  }, []);

  // Determine images to display based on mount status
  const displayImages = hasMounted ? storeImages : initialValue;

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-9 w-full px-2 outline-none hover:cursor-pointer",
        isActive && "border rounded-md border-ring ring-ring/50 ring-[1px]"
      )}
      onClick={handleClick}
      onBlur={handleBlur}
      onPaste={handlePaste}
      tabIndex={0} // Important for onPaste to work when div is not input-like
    >
      <div className="flex items-center gap-1 h-full overflow-x-auto overflow-y-hidden">
        {displayImages.length > 0 ? (
          <>
            {displayImages.map((image, index) => (
              <div key={index} className="relative group h-6 w-6 flex-shrink-0">
                <ImageDialog imageUrl={image}>
                  <div className="w-full h-full rounded overflow-hidden">
                    <Image
                      src={image}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={24}
                      height={24}
                    />
                  </div>
                </ImageDialog>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering div's onClick
                    removeImage(index);
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span className="text-xs">
              {isActive
                ? "Paste screenshot (Ctrl+V)"
                : "Click to paste screenshot"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScreenshotInput;
