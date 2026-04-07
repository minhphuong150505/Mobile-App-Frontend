import { Package, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Transactions() {
  const [activeTab, setActiveTab] = useState<"orders" | "rentals">("orders");

  const orders = [
    {
      id: "ORD-2024-001",
      title: "Canon EF 24-70mm f/2.8L",
      image: "https://images.unsplash.com/photo-1772771841348-a9fb229fd81b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXJyb3JsZXNzJTIwY2FtZXJhJTIwbW9kZXJufGVufDF8fHx8MTc3NTAxNDQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
      date: "25/03/2026",
      price: "28.500.000",
      status: "delivered",
      statusText: "Delivered",
    },
    {
      id: "ORD-2024-002",
      title: "Sony A7 III Body",
      image: "https://images.unsplash.com/photo-1674668920910-85b8d3c187ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYW1lcmElMjBlcXVpcG1lbnQlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzUwMTQ0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "30/03/2026",
      price: "42.000.000",
      status: "shipping",
      statusText: "In Transit",
    },
    {
      id: "ORD-2024-003",
      title: "Godox AD600 Pro",
      image: "https://images.unsplash.com/photo-1769699167704-33f5c2bbf3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBsaWdodGluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzUwMTQ0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "02/04/2026",
      price: "18.000.000",
      status: "cancelled",
      statusText: "Cancelled",
    },
  ];

  const rentals = [
    {
      id: "RNT-2024-001",
      title: "Leica M11 Black",
      image: "https://images.unsplash.com/photo-1725779318629-eda3e096eb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwYWVzdGhldGljJTIwZGFya3xlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "01/04/2026",
      endDate: "05/04/2026",
      days: 4,
      pricePerDay: "2.500.000",
      total: "10.000.000",
      status: "active",
      statusText: "Active",
    },
    {
      id: "RNT-2024-002",
      title: "Hasselblad X2D 100C",
      image: "https://images.unsplash.com/photo-1511140973288-19bf21d7e771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGVxdWlwbWVudCUyMG1pbmltYWwlMjBibGFjayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc1MDE1MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "28/03/2026",
      endDate: "30/03/2026",
      days: 2,
      pricePerDay: "3.000.000",
      total: "6.000.000",
      status: "completed",
      statusText: "Completed",
    },
    {
      id: "RNT-2024-003",
      title: "Sony α1 + 24-70 GM",
      image: "https://images.unsplash.com/photo-1585548601784-e319505354bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FtZXJhJTIwZ2VhciUyMGx1eHVyeXxlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "10/04/2026",
      endDate: "13/04/2026",
      days: 3,
      pricePerDay: "1.800.000",
      total: "5.400.000",
      status: "pending",
      statusText: "Pending",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "shipping":
        return <Clock className="w-4 h-4" />;
      case "completed":
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "shipping":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed":
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 sticky top-0 bg-[#1a1a1a] z-10">
        <h1 className="text-3xl mb-6 tracking-tight">TRANSACTIONS</h1>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 rounded-2xl transition-all ${
              activeTab === "orders"
                ? "bg-[#FF8C42] text-black"
                : "bg-[#0a0a0a] text-gray-400 border border-gray-800"
            }`}
          >
            Đơn hàng
          </button>
          <button
            onClick={() => setActiveTab("rentals")}
            className={`flex-1 py-3 rounded-2xl transition-all ${
              activeTab === "rentals"
                ? "bg-[#FF8C42] text-black"
                : "bg-[#0a0a0a] text-gray-400 border border-gray-800"
            }`}
          >
            Đơn thuê
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        {activeTab === "orders" ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-900">
                    <ImageWithFallback
                      src={order.image}
                      alt={order.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm mb-1 truncate">{order.title}</h3>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.statusText}
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order Date</span>
                    <span className="text-gray-300">{order.date}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-gray-800">
                    <span className="text-gray-500 text-sm">Total</span>
                    <span className="text-[#FF8C42] text-lg">₫{order.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-900">
                    <ImageWithFallback
                      src={rental.image}
                      alt={rental.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm mb-1 truncate">{rental.title}</h3>
                        <p className="text-xs text-gray-500">{rental.id}</p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getStatusColor(
                        rental.status
                      )}`}
                    >
                      {getStatusIcon(rental.status)}
                      {rental.statusText}
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rental Period</span>
                    <span className="text-gray-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {rental.days} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-300">
                      {rental.startDate} - {rental.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Daily Rate</span>
                    <span className="text-gray-300">₫{rental.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-gray-800">
                    <span className="text-gray-500 text-sm">Total</span>
                    <span className="text-[#FF8C42] text-lg">₫{rental.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
