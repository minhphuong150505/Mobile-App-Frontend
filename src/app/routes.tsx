import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Discovery from "./pages/Discovery";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import EquipmentDetail from "./pages/EquipmentDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Discovery },
      { path: "transactions", Component: Transactions },
      { path: "profile", Component: Profile },
      { path: "notifications", Component: Notifications },
      { path: "equipment/:id", Component: EquipmentDetail },
    ],
  },
]);