"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

// Define your Card Design type
export type CardDesign = {
  _id: string;
  front_image: string;
  back_image: string;
  name: string;
  materials: Record<string, { price_per_unit: number }>;
  created_at: string; // Added Date Created
};

export const cardColumns: ColumnDef<CardDesign>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm px-2" // Added smaller padding
      >
        Product ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm px-2">{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm px-2"
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm px-2">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "front_image",
    header: "Front Image",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.getValue("front_image")}
          alt="Front"
          className="w-18 h-12 object-contain border border-gray-300 rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: "back_image",
    header: "Back Image",
    cell: ({ row }) => (
      <div className="flex justify-center ml-4"> {/* Added margin to separate the two images */}
        <img
          src={row.getValue("back_image")}
          alt="Back"
          className="w-18 h-12 object-contain border border-gray-300 rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: "materials",
    header: "Materials",
    cell: ({ row }) => {
      const materials = row.getValue("materials");

      if (materials && typeof materials === "object") {
        return (
          <div className="text-sm px-2 ml-2">
            {Object.keys(materials).map((material) => (
              <div key={material}>{material}</div>
            ))}
          </div>
        );
      }
      return <div className="text-sm px-2">No materials available</div>;
    },
  },
  {
    accessorKey: "price_per_unit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm px-2"
      >
        Price per Unit
      </Button>
    ),
    cell: ({ row }) => {
      const materials = row.getValue("materials");
  
      if (materials && typeof materials === "object") {
        return (
          <div className="text-sm px-2">
            {Object.entries(materials).map(([material, { price_per_unit }]) => (
              <div key={material}>
                {material}: {price_per_unit} PHP
              </div>
            ))}
          </div>
        );
      }
  
      return <div className="text-sm px-2">No price available</div>;
    },
},
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm px-2"
      >
        Date Created
        <ArrowUpDown className="ml-0 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at") as string | undefined;

      if (!rawDate) return <div className="text-sm px-2">No date available</div>;

      const formattedDate = new Date(rawDate).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

      return <div className="text-sm px-2">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button className="p-1 bg-transparent hover:bg-gray-200 rounded-md">
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </button>
    ),
  },
];
