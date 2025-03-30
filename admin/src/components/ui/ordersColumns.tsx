"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
import OrderDetailsModal from "./OrderDetailsModal";

export type Order = {
  orderId: string;
  userId: string;
  designName: string;
  amount: number;
  material: string;
  status: "Pending" | "Shipped" | "Delivered";
  date: string;
  quantity: number;
  fullName: string;
  phone: string;
  paymentMethod: string;
  front_image: string;
  back_image: string;
};

// Define a custom context type that includes updateOrderInTable
export interface OrderCellContext extends CellContext<Order, unknown> {
  updateOrderInTable?: (orderId: string, updatedData: Partial<Order>) => void;
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "designName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Design Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `₱${parseFloat(row.getValue("amount")).toFixed(2)}`,
  },
  {
    accessorKey: "material",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Material
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <div className={`px-2 py-1 rounded ${statusColor(status)}`}>{status}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    header: "More Details",
    cell: (context: OrderCellContext) => {
      // Now TypeScript knows updateOrderInTable might exist on context
      return (
        <OrderDetailsModal 
          order={context.row.original} 
          updateOrderInTable={context.updateOrderInTable}
        >
          <button className="p-1 bg-transparent hover:bg-gray-200 cursor-pointer rounded-md">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </OrderDetailsModal>
      );
    },
  },
];

// Function to style status based on value
const statusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-[#EFF5FF] border-1 border-[#587DBD] text-[#587DBD]";
    case "Shipped":
      return "bg-[#FFFDEB] border-1 border-[#FDDF05] text-[#FDDF05]";
    case "Delivered":
      return "bg-[#E5FEE9] border-1 border-[#319F43] text-[#319F43]";
    default:
      return "bg-gray-100 text-gray-500 border-gray-500";
  }
};