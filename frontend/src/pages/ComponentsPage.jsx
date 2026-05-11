import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api";
import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { getApiError, money } from "../utils";

const blank = {
  component_name: "",
  component_type: "",
  purchase_price: "",
  repair_price: "",
  stock_quantity: "",
};

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await api.get("/components/", { params: { search } });
    setComponents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadComponents().catch((error) => toast.error(getApiError(error)));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/components/${editingId}/`, form);
        toast.success("Component updated");
      } else {
        await api.post("/components/", form);
        toast.success("Component added");
      }
      setForm(blank);
      setEditingId(null);
      await loadComponents();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const edit = (component) => {
    setEditingId(component.id);
    setForm({
      component_name: component.component_name,
      component_type: component.component_type,
      purchase_price: component.purchase_price,
      repair_price: component.repair_price,
      stock_quantity: component.stock_quantity,
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this component?")) return;
    try {
      await api.delete(`/components/${id}/`);
      toast.success("Component deleted");
      await loadComponents();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <>
      <PageHeader title="Components" description="Manage stock, repair pricing, and replacement pricing." />
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-md border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Update component" : "Add component"}</h3>
            {editingId ? (
              <button type="button" className="rounded-md border p-2" onClick={() => { setForm(blank); setEditingId(null); }}>
                <X size={16} />
              </button>
            ) : null}
          </div>
          <FormField label="Component name">
            <input required className="w-full rounded-md border px-3 py-2" value={form.component_name} onChange={(e) => setForm({ ...form, component_name: e.target.value })} />
          </FormField>
          <FormField label="Component type">
            <input required className="w-full rounded-md border px-3 py-2" value={form.component_type} onChange={(e) => setForm({ ...form, component_type: e.target.value })} />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Purchase price">
              <input required min="0" type="number" step="0.01" className="w-full rounded-md border px-3 py-2" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
            </FormField>
            <FormField label="Repair price">
              <input required min="0" type="number" step="0.01" className="w-full rounded-md border px-3 py-2" value={form.repair_price} onChange={(e) => setForm({ ...form, repair_price: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Stock quantity">
            <input required min="0" type="number" className="w-full rounded-md border px-3 py-2" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          </FormField>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-semibold text-white">
            <Plus size={18} />
            {editingId ? "Save changes" : "Add component"}
          </button>
        </form>

        <section className="rounded-md border bg-white p-4">
          <div className="mb-4 flex gap-2">
            <input className="w-full rounded-md border px-3 py-2" placeholder="Search by component name" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="rounded-md border px-4 font-medium" onClick={loadComponents}>Search</button>
          </div>
          {loading ? <Spinner /> : components.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Purchase</th><th className="p-3">Repair</th><th className="p-3">Stock</th><th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component) => (
                    <tr key={component.id} className="border-t">
                      <td className="p-3 font-medium">{component.component_name}</td>
                      <td className="p-3">{component.component_type}</td>
                      <td className="p-3">{money(component.purchase_price)}</td>
                      <td className="p-3">{money(component.repair_price)}</td>
                      <td className="p-3">{component.stock_quantity}</td>
                      <td className="flex gap-2 p-3">
                        <button className="rounded-md border p-2" onClick={() => edit(component)} aria-label="Edit component"><Pencil size={16} /></button>
                        <button className="rounded-md border p-2 text-red-600" onClick={() => remove(component.id)} aria-label="Delete component"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
