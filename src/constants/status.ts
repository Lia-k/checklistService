export type StatusOption = {
  id: number;
  title: string;
};

export const STATUS_OPTIONS: StatusOption[] = [
  { id: 1, title: "pass" },
  { id: 2, title: "fail" },
  { id: 3, title: "blocked" },
  { id: 4, title: "clarify" },
  { id: 5, title: "skip" },
];

export function getStatusColor(value: number | undefined, options: StatusOption[] = STATUS_OPTIONS) {
  if (!value) return "";

  const status = options.find((opt) => opt.id === value)?.title;
  switch (status) {
    case "pass":
      return "bg-green-100 hover:bg-green-200";
    case "fail":
      return "bg-red-100 hover:bg-red-200";
    case "blocked":
      return "bg-gray-200 hover:bg-gray-300";
    case "clarify":
      return "bg-yellow-100 hover:bg-yellow-200";
    case "skip":
      return "bg-slate-100 hover:bg-slate-200";
    default:
      return "bg-blue-50 hover:bg-blue-100";
  }
}

