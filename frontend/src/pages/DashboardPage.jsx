import { IndianRupee, Package, Wrench, Car } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import api from "../api";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { getApiError, money } from "../utils";

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <Icon className="text-accent" size={20} />
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function RevenueChart({ title, data, kind = "bar" }) {
  return (
    <section className="rounded-md border bg-white p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => money(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState({ daily: [], monthly: [], yearly: [], services: [], vehicles: [], components: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/revenue/daily/"),
      api.get("/revenue/monthly/"),
      api.get("/revenue/yearly/"),
      api.get("/services/"),
      api.get("/vehicles/"),
      api.get("/components/"),
    ])
      .then(([daily, monthly, yearly, services, vehicles, components]) => {
        setData({
          daily: daily.data,
          monthly: monthly.data,
          yearly: yearly.data,
          services: services.data,
          vehicles: vehicles.data,
          components: components.data,
        });
      })
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = useMemo(
    () => data.services.reduce((sum, service) => sum + Number(service.total_amount || 0), 0),
    [data.services]
  );

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Revenue Dashboard" description="Daily, monthly, and yearly workshop revenue." />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total revenue" value={money(totalRevenue)} icon={IndianRupee} />
        <Metric label="Vehicles" value={data.vehicles.length} icon={Car} />
        <Metric label="Components" value={data.components.length} icon={Package} />
        <Metric label="Service records" value={data.services.length} icon={Wrench} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <RevenueChart title="Daily Revenue" data={data.daily} />
        <RevenueChart title="Monthly Revenue" data={data.monthly} kind="line" />
        <div className="xl:col-span-2">
          <RevenueChart title="Yearly Revenue" data={data.yearly} />
        </div>
      </div>
    </>
  );
}
