import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react"; // Removed Share icon
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// CardDesign type definition
export type CardDesign = {
  _id: string;
  front_image: string;
  back_image: string;
  name: string;
  materials: Record<string, { price_per_unit: number }>;
  created_at: string;
  modified_at?: string; // Added Modified At
};

const ActionDropdown = ({ onEdit, onDelete, cardId }: { onEdit: () => void; onDelete: () => void; cardId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const response = await fetch(`http://localhost:4000/api/v1/card-designs/admin/delete-card-product/${cardId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok) {
          onDelete();
          alert("Product successfully deleted");
        } else {
          alert(`Failed to delete: ${data.message}`);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="p-2 bg-transparent hover:bg-gray-200 rounded-md cursor-pointer">
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </button>
      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute right-0 bg-white shadow-md border border-gray-300 mt-1 rounded-lg p-2 w-48 z-10" style={{ top: "100%" }}>
          <div onClick={onEdit} className="cursor-pointer hover:bg-gray-100 py-2 px-4 text-black text-[14px] text-left">
            <Edit className="inline mr-2 h-4 w-4 text-gray-500" />
            Edit
          </div>
          <div onClick={handleDelete} className="cursor-pointer hover:bg-gray-100 py-2 px-4 text-black text-red-600 text-[14px] text-left">
            <Trash className="inline mr-2 h-4 w-4 text-red-600" />
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

// Column definition for the table
export const cardColumns: ColumnDef<CardDesign>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-sm px-2">
        Product ID
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm px-2">{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-sm px-2">
        Product Name
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm px-2">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "front_image",
    header: "Front Image",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img src={row.getValue("front_image")} alt="Front" className="w-18 h-12 object-contain border border-gray-300 rounded-md" />
      </div>
    ),
  },
  {
    accessorKey: "back_image",
    header: "Back Image",
    cell: ({ row }) => (
      <div className="flex justify-center ml-4">
        <img src={row.getValue("back_image")} alt="Back" className="w-18 h-12 object-contain border border-gray-300 rounded-md" />
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
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-sm px-2">
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
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-sm px-2">
        Date Created
        <ArrowUpDown className="ml-0 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at") as string | undefined;
      if (!rawDate) return <div className="text-sm px-2">No date available</div>;
      const formattedDate = new Date(rawDate).toISOString().split("T")[0];
      return <div className="text-sm px-2">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "modified_at",
    header: "Modified At",
    cell: ({ row }) => {
      const rawDate = row.getValue("modified_at") as string | undefined;
      if (!rawDate) return <div className="text-sm px-2">Not Modified</div>;
      const formattedDate = new Date(rawDate).toISOString().split("T")[0];
      return <div className="text-sm px-2">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleEdit = () => {
        console.log("Edit clicked", row.original); // Replace with actual edit functionality
      };

      const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
          console.log("Delete clicked", row.original); // Replace with actual delete functionality
        }
      };

      return <ActionDropdown onEdit={handleEdit} onDelete={handleDelete} cardId={row.original._id} />;
    },
  },
];
