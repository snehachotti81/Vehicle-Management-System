export default function EmptyState({ message = "No records found." }) {
  return <div className="rounded-md border border-dashed bg-white p-8 text-center text-sm text-slate-500">{message}</div>;
}
