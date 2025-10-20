"use client";

import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/store";

interface ReportBugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowId: number | null;
  bugIndex?: number | null;
}

export const ReportBugDialog: React.FC<ReportBugDialogProps> = ({
  open,
  onOpenChange,
  rowId,
  bugIndex = null,
}) => {
  const getBugReports = useAppStore((s) => s.getBugReports);
  const addBug = useAppStore((s) => s.addBugReport);
  const updateBug = useAppStore((s) => s.updateBugReport);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [actual, setActual] = useState("");
  const [expected, setExpected] = useState("");

  useEffect(() => {
    if (!open || rowId == null) return;
    if (bugIndex !== null) {
      const bug = getBugReports(rowId)[bugIndex];
      if (bug) {
        setId(bug.id ?? "");
        setTitle(bug.title ?? "");
        setSteps(bug.steps ?? "");
        setActual(bug.actual ?? "");
        setExpected(bug.expected ?? "");
        return;
      }
    }
    // default new bug
    setId("");
    setTitle("");
    setSteps("");
    setActual("");
    setExpected("");
  }, [open, rowId, bugIndex, getBugReports]);

  const handleSubmit = () => {
    if (rowId == null) return;
    const payload = { id: id || undefined, title: title || undefined, steps: steps || undefined, actual: actual || undefined, expected: expected || undefined };
    if (bugIndex !== null) {
      updateBug(rowId, bugIndex, payload);
    } else {
      addBug(rowId, payload);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report bug</DialogTitle>
          <DialogDescription>
            Capture bug attributes for this row.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="bug-id">ID</label>
            <Input
              id="bug-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="External bug ID (e.g., JIRA-123)"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="bug-title">Title</label>
            <Input
              id="bug-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="bug-steps">Steps to reproduce</label>
            <textarea
              id="bug-steps"
              className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground min-h-32 w-full rounded-md border bg-transparent p-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="List the steps to reproduce"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="bug-actual">Actual result</label>
            <textarea
              id="bug-actual"
              className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground min-h-24 w-full rounded-md border bg-transparent p-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="What actually happened"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="bug-expected">Expected result</label>
            <textarea
              id="bug-expected"
              className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground min-h-24 w-full rounded-md border bg-transparent p-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              placeholder="What you expected to happen"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Report bug
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportBugDialog;
