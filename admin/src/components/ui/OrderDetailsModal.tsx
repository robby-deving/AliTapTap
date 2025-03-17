// In OrderDetailsModal.js
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/ordersDialog";
import { Button } from "@/components/ui/button";
import { Order } from "./ordersColumns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import axios from "axios";

interface OrderDetailsModalProps {
  order: Order;
  children: React.ReactNode;
  updateOrderInTable?: (orderId: string, updatedData: Partial<Order>) => void;
}

export default function OrderDetailsModal({ order, children, updateOrderInTable }: OrderDetailsModalProps) {
  const [orderStatus, setOrderStatus] = useState<string>(order.status ?? "Pending");
  const [loading, setLoading] = useState<boolean>(false);

  const getStatusStyles = () => {
    switch (orderStatus) {
      case "Pending":
        return "bg-[#EFF5FF] text-[#587DBD] border-[#587DBD]";
      case "Shipped":
        return "bg-[#FFFDEB] text-[#FDDF05] border-[#FDDF05]";
      case "Delivered":
        return "bg-[#E5FEE9] text-[#319F43] border-[#319F43]";
      default:
        return "bg-gray-100 text-gray-700 border-gray-500";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setOrderStatus(newStatus); // Update local state
    setLoading(true);

    try {
      // Call API to update the status
      await axios.put(
        `http://localhost:4000/api/v1/orders/update-order-status/${order.orderId}/status`,
        { order_status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update the row in the parent table
      if (updateOrderInTable) {
        updateOrderInTable(order.orderId, { status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setOrderStatus(order.status); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[51rem] max-w-5xl p-12 flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-bold text-left">Order Details</DialogTitle>
        </DialogHeader>
        <div className="flex gap-x-10">
          {/* Left Div */}
          <div className="w-[300px] p-5 rounded-lg border-2 border-[#FFEE70] flex flex-col gap-5">
            <p className="text-[#949494] uppercase text-xs font-semibold">Card Preview</p>

            <div className="w-full flex flex-col items-center gap-2">
              <img
                src={order.front_image}
                alt="Front Design"
                className="w-full h-40 object-cover rounded-md border border-[#949494] text-[#949494]"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <img
                src={order.back_image}
                alt="Back Design"
                className="w-full h-40 object-cover rounded-md border border-[#949494] text-[#949494]"
              />
            </div>
          </div>

          {/* Right Div */}
          <div className="space-y-7 text-sm py-5">
            <p className="text-[#949494] uppercase text-xs font-semibold">Order Information</p>
            {/* Card Info */}
            <div className="space-y-1">
              <p className="text-[#949494] text-xs font-semibold">Card Info</p>
              <div className="flex justify-between gap-75">
                <span className="font-medium text-sm">Material</span>
                <span className="text-sm">{order.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Quantity</span>
                <span className="text-sm">x{order.quantity}</span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-1">
              <p className="text-[#949494] text-xs font-semibold">Transaction Details</p>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Order ID</span>
                <span className="text-sm">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Customer Name</span>
                <span className="text-sm">{order.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Phone Number</span>
                <span className="text-sm">{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Payment Method</span>
                <span className="text-sm">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Order Status with Dropdown */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Order Status</span>
              <Select onValueChange={handleStatusChange}
                defaultValue={orderStatus}
                disabled={loading}
              >
                <SelectTrigger className={`w-28 px-4 py-1 text-xs rounded-md border text-center cursor-pointer ${getStatusStyles()}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E4E4E7]">
                  <SelectItem value="Pending" className="cursor-pointer">Pending</SelectItem>
                  <SelectItem value="Shipped" className="cursor-pointer">Shipped</SelectItem>
                  <SelectItem value="Delivered" className="cursor-pointer">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="font-bold text-lg">Total Price</span>
              <span className="font-bold text-lg">₱{order.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}