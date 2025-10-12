"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ImageDialogProps {
  imageUrl: string;
  children: React.ReactNode;
}

export function ImageDialog({ imageUrl, children }: ImageDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogTitle className="sr-only">
          Full size screenshot preview
        </DialogTitle>
        <DialogDescription className="sr-only">
          Click outside or use the escape key to close the image preview
        </DialogDescription>

        <div className="relative w-full aspect-auto max-h-[80vh]">
          <Image
            src={imageUrl}
            alt="Full size screenshot"
            className="object-contain w-full h-full"
            width={1200}
            height={800}
            quality={100}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageDialog;
