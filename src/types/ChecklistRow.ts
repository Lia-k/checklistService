export interface ChecklistRow {
  id: number;
  source: string;
  step: string;
  branch: number | undefined;
  master: number | undefined;
  prod: number | undefined;
  qaComment: string;
  screenshot: string;
  devComment: string;
}
