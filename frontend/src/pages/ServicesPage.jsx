import { FileText, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import api from "../api";
import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import { formatDate, getApiError, money } from "../utils";

const blank = {
  vehicle: "",
  issue_description: "",
  selected_component: "",
  service_type: "Repair",
  labor_charge: "",
  quantity: 1,
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [components, setComponents] = useState([]);
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true);

  const selectedComponent = useMemo(
    () => components.find((component) => String(component.id) === String(form.selected_component)),
    [components, form.selected_component]
  );

  const estimatedTotal = useMemo(() => {
    if (!selectedComponent) return 0;
    const componentPrice = form.service_type === "Repair" ? selectedComponent.repair_price : selectedComponent.purchase_price;
    return Number(componentPrice || 0) * Number(form.quantity || 0) + Number(form.labor_charge || 0);
  }, [selectedComponent, form.service_type, form.quantity, form.labor_charge]);

  const loadData = async () => {
    setLoading(true);
    const [servicesRes, vehiclesRes, componentsRes] = await Promise.all([
      api.get("/services/"),
      api.get("/vehicles/"),
      api.get("/components/"),
    ]);
    setServices(servicesRes.data);
    setVehicles(vehiclesRes.data);
    setComponents(componentsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData().catch((error) => toast.error(getApiError(error)));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/services/", form);
      toast.success("Service record added");
      setForm(blank);
      await loadData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <>
      <PageHeader title="Service & Repair" description="Create issues, calculate bills, and maintain service history." />
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-md border bg-white p-4">
          <h3 className="font-semibold">Add vehicle issue</h3>
          <FormField label="Vehicle">
            <select required className="w-full rounded-md border px-3 py-2" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
              <option value="">Choose vehicle</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicle_number} - {vehicle.owner_name}</option>)}
            </select>
          </FormField>
          <FormField label="Issue description">
            <textarea required rows="3" className="w-full rounded-md border px-3 py-2" value={form.issue_description} onChange={(e) => setForm({ ...form, issue_description: e.target.value })} />
          </FormField>
          <FormField label="Component">
            <select required className="w-full rounded-md border px-3 py-2" value={form.selected_component} onChange={(e) => setForm({ ...form, selected_component: e.target.value })}>
              <option value="">Choose component</option>
              {components.map((component) => <option key={component.id} value={component.id}>{component.component_name} ({component.stock_quantity} in stock)</option>)}
            </select>
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Service type">
              <select className="w-full rounded-md border px-3 py-2" value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}>
                <option>Repair</option>
                <option>Replace</option>
              </select>
            </FormField>
            <FormField label="Quantity">
              <input required min="1" type="number" className="w-full rounded-md border px-3 py-2" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Labor charge">
            <input required min="0" type="number" step="0.01" className="w-full rounded-md border px-3 py-2" value={form.labor_charge} onChange={(e) => setForm({ ...form, labor_charge: e.target.value })} />
          </FormField>
          <div className="rounded-md bg-slate-50 p-3 text-sm">
            <div className="flex justify-between"><span>Component price</span><strong>{money(form.service_type === "Repair" ? selectedComponent?.repair_price : selectedComponent?.purchase_price)}</strong></div>
            <div className="mt-2 flex justify-between text-base"><span>Estimated total</span><strong>{money(estimatedTotal)}</strong></div>
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-semibold text-white">
            <Plus size={18} />
            Add service
          </button>
        </form>

        <section className="rounded-md border bg-white p-4">
          <h3 className="mb-4 font-semibold">Service history</h3>
          {loading ? <Spinner /> : services.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-3">Vehicle</th><th className="p-3">Issue</th><th className="p-3">Component</th><th className="p-3">Type</th><th className="p-3">Total</th><th className="p-3">Date</th><th className="p-3">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-t align-top">
                      <td className="p-3 font-semibold">{service.vehicle_detail.vehicle_number}</td>
                      <td className="max-w-xs p-3">{service.issue_description}</td>
                      <td className="p-3">{service.component_detail.component_name} x {service.quantity}</td>
                      <td className="p-3"><StatusBadge value={service.service_type} /></td>
                      <td className="p-3 font-semibold">{money(service.total_amount)}</td>
                      <td className="p-3">{formatDate(service.created_at)}</td>
                      <td className="p-3">
                        <Link className="inline-flex rounded-md border p-2" to={`/invoice/${service.id}`} aria-label="Open invoice"><FileText size={16} /></Link>
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
