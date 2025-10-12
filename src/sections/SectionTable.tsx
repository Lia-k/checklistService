"use client";

import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import SectionColumnInput from "@/sections/SectionColumnInput";
import SectionColumnCombobox from "@/sections/SectionColumnCombobox";
import SectionColumnScreenshot from "@/sections/SectionColumnScreenshot";
import type { ChecklistRow } from "@/types";
import { FileText } from 'lucide-react';
import { Footprints } from 'lucide-react';
import { GitBranch } from 'lucide-react';
import { MessageCircleWarning } from 'lucide-react';
import { MessageCircleCode } from 'lucide-react';
import { ImageDown } from 'lucide-react';

const SectionTable = () => {
  // Initialize state for the table data
  const [tableData] = useState<ChecklistRow[]>(
    Array(20)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        source: "",
        step: "",
        branch: undefined,
        master: undefined,
        prod: undefined,
        qaComment: "",
        screenshot: "",
        devComment: "",
      }))
  );

  return (
    <div className="overflow-x-auto">
      <ResizablePanelGroup direction="horizontal">
        <SectionColumnInput
          columnName="Source"
          defaultSize={10}
          minSize={5}
          tableData={tableData}
          icon={<FileText size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        {/* Step Column */}
        <SectionColumnInput
          columnName="Step"
          defaultSize={25}
          minSize={5}
          tableData={tableData}
          icon={<Footprints size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        {/* Branch Column */}
        <SectionColumnCombobox
          columnName="Branch"
          defaultSize={8}
          minSize={5}
          tableData={tableData}
          icon={<GitBranch size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        {/* Master Column */}
        <SectionColumnCombobox
          columnName="Master"
          defaultSize={8}
          minSize={5}
          tableData={tableData}
          icon={<GitBranch size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        {/* Prod Column */}
        <SectionColumnCombobox
          columnName="Prod"
          defaultSize={8}
          minSize={5}
          tableData={tableData}
          icon={<GitBranch size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        {/* QA Comment Column */}
        <SectionColumnInput
          columnName="QA Comment"
          defaultSize={25}
          minSize={5}
          tableData={tableData}
          icon={<MessageCircleWarning size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        <SectionColumnScreenshot
          columnName="Screenshot"
          defaultSize={20}
          minSize={5}
          tableData={tableData}
          icon={<ImageDown size={16} className="flex-shrink-0" />}
        />

        <ResizableHandle />

        <SectionColumnInput
          columnName="Dev Comment"
          defaultSize={25}
          minSize={5}
          tableData={tableData}
          icon={<MessageCircleCode size={16} className="flex-shrink-0" />}
        />
      </ResizablePanelGroup>
    </div>
  );
};

export default SectionTable;
