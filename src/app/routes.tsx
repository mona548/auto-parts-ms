import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import AddPart from "./components/AddPart";
import Invoices from "./components/Invoices";
import Customers from "./components/Customers";
import CreateInvoice from "./components/CreateInvoice";
import CustomerProfile from "./components/CustomerProfile";
import InvoiceSettlement from "./components/InvoiceSettlement";
import Settings from "./components/Settings";
import Reports from "./components/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "add-part", Component: AddPart },
      { path: "invoices", Component: Invoices },
      { path: "customers", Component: Customers },
      { path: "customers/:id", Component: CustomerProfile },
      { path: "create-invoice", Component: CreateInvoice },
      { path: "settlement", Component: InvoiceSettlement },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);