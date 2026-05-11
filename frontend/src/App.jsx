import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ComponentsPage from "./pages/ComponentsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InvoicePage from "./pages/InvoicePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />
      </Route>
    </Routes>
  );
}
