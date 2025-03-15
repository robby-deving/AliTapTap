"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/ordersDialog";
import { Button } from "@/components/ui/button";
import { Order } from "./ordersColumns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface OrderDetailsModalProps {
  order: Order;
  children: React.ReactNode;
}

export default function OrderDetailsModal({ order, children }: OrderDetailsModalProps) {
  const [orderStatus, setOrderStatus] = useState<string>(order.status ?? "Pending"); // Initialize with order status

  // Function to determine the button styles based on status
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl min-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        {/* Container for Two Side-by-Side Divs */}
        <div className="flex gap-x-4">
          {/* Left Blank Div (You can add content later) */}
          <div className="w-1/2 bg-gray-100 p-5 rounded-lg"></div>

          {/* Right Div: Order Details */}
          <div className="space-y-5 text-sm p-5">
            <p className="text-gray-500 uppercase text-xs font-semibold">Order Information</p>
            {/* Card Info */}
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-semibold">Card Info</p>
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
              <p className="text-gray-500 text-xs font-semibold">Transaction Details</p>
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
              <Select onValueChange={(value: string) => setOrderStatus(value)} defaultValue={orderStatus}>
                <SelectTrigger className={`w-28 px-4 py-1 text-xs rounded-md border text-center cursor-pointer ${getStatusStyles()}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
