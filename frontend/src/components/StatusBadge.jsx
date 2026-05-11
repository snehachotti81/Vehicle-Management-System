const styles = {
  Pending: "bg-amber-100 text-amber-800",
  "In Progress": "bg-sky-100 text-sky-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Delivered: "bg-slate-200 text-slate-700",
  Repair: "bg-indigo-100 text-indigo-800",
  Replace: "bg-rose-100 text-rose-800",
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-slate-100 text-slate-700"}`}>
      {value}
    </span>
  );
}
