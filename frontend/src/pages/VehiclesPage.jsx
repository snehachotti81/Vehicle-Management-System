import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api";
import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import { getApiError } from "../utils";

const blank = {
  vehicle_number: "",
  owner_name: "",
  phone_number: "",
  vehicle_model: "",
  service_status: "Pending",
};

const statuses = ["Pending", "In Progress", "Completed", "Delivered"];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadVehicles = async () => {
    setLoading(true);
    const { data } = await api.get("/vehicles/", { params: { search, status } });
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadVehicles().catch((error) => toast.error(getApiError(error)));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}/`, form);
        toast.success("Vehicle updated");
      } else {
        await api.post("/vehicles/", form);
        toast.success("Vehicle registered");
      }
      setForm(blank);
      setEditingId(null);
      await loadVehicles();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const edit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      vehicle_number: vehicle.vehicle_number,
      owner_name: vehicle.owner_name,
      phone_number: vehicle.phone_number,
      vehicle_model: vehicle.vehicle_model,
      service_status: vehicle.service_status,
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}/`);
      toast.success("Vehicle deleted");
      await loadVehicles();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <>
      <PageHeader title="Vehicles" description="Register vehicles, search by number, and track service status." />
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-md border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Update vehicle" : "Register vehicle"}</h3>
            {editingId ? (
              <button type="button" className="rounded-md border p-2" onClick={() => { setForm(blank); setEditingId(null); }}>
                <X size={16} />
              </button>
            ) : null}
          </div>
          <FormField label="Vehicle number">
            <input required className="w-full rounded-md border px-3 py-2 uppercase" value={form.vehicle_number} onChange={(e) => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })} />
          </FormField>
          <FormField label="Owner name">
            <input required className="w-full rounded-md border px-3 py-2" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
          </FormField>
          <FormField label="Phone number">
            <input required className="w-full rounded-md border px-3 py-2" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
          </FormField>
          <FormField label="Vehicle model">
            <input required className="w-full rounded-md border px-3 py-2" value={form.vehicle_model} onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })} />
          </FormField>
          <FormField label="Service status">
            <select className="w-full rounded-md border px-3 py-2" value={form.service_status} onChange={(e) => setForm({ ...form, service_status: e.target.value })}>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </FormField>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-semibold text-white">
            <Plus size={18} />
            {editingId ? "Save changes" : "Register vehicle"}
          </button>
        </form>

        <section className="rounded-md border bg-white p-4">
          <div className="mb-4 grid gap-2 md:grid-cols-[1fr_180px_auto]">
            <input className="rounded-md border px-3 py-2" placeholder="Search vehicle number" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button className="rounded-md border px-4 font-medium" onClick={loadVehicles}>Apply</button>
          </div>
          {loading ? <Spinner /> : vehicles.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-3">Number</th><th className="p-3">Owner</th><th className="p-3">Phone</th><th className="p-3">Model</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-t">
                      <td className="p-3 font-semibold">{vehicle.vehicle_number}</td>
                      <td className="p-3">{vehicle.owner_name}</td>
                      <td className="p-3">{vehicle.phone_number}</td>
                      <td className="p-3">{vehicle.vehicle_model}</td>
                      <td className="p-3"><StatusBadge value={vehicle.service_status} /></td>
                      <td className="flex gap-2 p-3">
                        <button className="rounded-md border p-2" onClick={() => edit(vehicle)} aria-label="Edit vehicle"><Pencil size={16} /></button>
                        <button className="rounded-md border p-2 text-red-600" onClick={() => remove(vehicle.id)} aria-label="Delete vehicle"><Trash2 size={16} /></button>
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
