import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

import api from "../api";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import { formatDate, getApiError, money } from "../utils";

export default function InvoicePage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/services/${id}/`)
      .then(({ data }) => setService(data))
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!service) return <div className="rounded-md border bg-white p-6">Invoice not found.</div>;

  const componentPrice = service.service_type === "Repair"
    ? service.component_detail.repair_price
    : service.component_detail.purchase_price;

  return (
    <>
      <PageHeader
        title="Payment Summary"
        description="Simulated invoice for workshop billing."
        actions={
          <>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-semibold"><ArrowLeft size={16} />Back</Link>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white"><Printer size={16} />Print</button>
          </>
        }
      />
      <section className="mx-auto max-w-4xl rounded-md border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Invoice #{service.id}</h3>
            <p className="text-sm text-slate-500">{formatDate(service.created_at)}</p>
          </div>
          <StatusBadge value={service.service_type} />
        </div>

        <div className="grid gap-5 py-5 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold">Vehicle details</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt>Vehicle number</dt><dd className="font-medium">{service.vehicle_detail.vehicle_number}</dd></div>
              <div className="flex justify-between"><dt>Owner</dt><dd>{service.vehicle_detail.owner_name}</dd></div>
              <div className="flex justify-between"><dt>Phone</dt><dd>{service.vehicle_detail.phone_number}</dd></div>
              <div className="flex justify-between"><dt>Model</dt><dd>{service.vehicle_detail.vehicle_model}</dd></div>
            </dl>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Issue details</h4>
            <p className="rounded-md bg-slate-50 p-3 text-sm">{service.issue_description}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-3">Item</th><th className="p-3">Price</th><th className="p-3">Qty</th><th className="p-3 text-right">Amount</th></tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">{service.component_detail.component_name}</td>
                <td className="p-3">{money(componentPrice)}</td>
                <td className="p-3">{service.quantity}</td>
                <td className="p-3 text-right">{money(Number(componentPrice) * Number(service.quantity))}</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Labor charge</td>
                <td className="p-3">{money(service.labor_charge)}</td>
                <td className="p-3">1</td>
                <td className="p-3 text-right">{money(service.labor_charge)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t text-base">
                <th className="p-3" colSpan="3">Final amount</th>
                <th className="p-3 text-right">{money(service.total_amount)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
}
