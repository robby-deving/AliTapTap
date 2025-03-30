import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ModalOverlay, SuccessModalContent } from '../AddModalDesign';
import productDeleteConfirmationImage from '../../assets/deleteconfirmsvg.svg';
import productDeleteSuccessImage from '../../assets/deletesuccess.svg';
import { EditCardModal } from "@/components/ui/EditProductModal";

// Defining the types for CardDesign
export type CardDesign = {
  _id: string;
  front_image: string;
  back_image: string;
  name: string;
  materials: Record<string, { price_per_unit: number }>;
  created_at: string;
  modified_at?: string;
};

// ActionDropdown component for the "Edit" and "Delete" options
const ActionDropdown = ({ onEdit, onDelete, cardId }: { onEdit: () => void; onDelete: () => void; cardId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false); 
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

  const handleDelete = () => {
    setIsDeleteModalOpen(true); 
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false); 
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/card-designs/admin/delete-card-product/${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(); 
        setIsDeleteModalOpen(false); 
        setTimeout(() => {
          setIsDeleteSuccessModalOpen(true); 
        }, 300); 
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCloseDeleteSuccessModal = () => {
    setIsDeleteSuccessModalOpen(false); 
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ModalOverlay zIndex={1000}>
          <SuccessModalContent>
            <img
              src={productDeleteConfirmationImage}
              alt="Delete Confirmation"
              style={{ width: '1190px', height: '115px', marginBottom: '50px', marginTop: '50px'}} // Adjusted size
            />
            <Button
              onClick={handleCloseDeleteModal}
              className="custom-close-btn"
              style={{
                backgroundColor: '#E4E4E7',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease',
                width: '150px',
                height: '40px',
                marginRight: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E4E4E7';
              }}
            >
              Discard
            </Button>
            <Button
              onClick={handleConfirmDelete} 
              className="custom-close-btn"
              style={{
                backgroundColor: '#F15A29',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease',
                width: '150px',
                height: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F13B00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F15A29';
              }}
            >
              Yes
            </Button>
          </SuccessModalContent>
        </ModalOverlay>
      )}

      {/* Success Confirmation Modal */}
      {isDeleteSuccessModalOpen && (
        <ModalOverlay zIndex={2000}>
          <SuccessModalContent>
            <img
              src={productDeleteSuccessImage}
              alt="Delete Success"
              style={{ width: '1190px', height: '115px', marginBottom: '50px', marginTop: '50px'}} // Adjusted size
            />
            <Button
              onClick={handleCloseDeleteSuccessModal}
              className="custom-close-btn"
              style={{
                backgroundColor: '#E4E4E7',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease',
                width: '150px',
                height: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E4E4E7';
              }}
            >
              Close
            </Button>
          </SuccessModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

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
      const [isEditOpen, setIsEditOpen] = useState(false);
      const [cardData, setCardData] = useState<CardDesign | null>(null);

      const handleEdit = () => {
        setCardData(row.original);
        setIsEditOpen(true);
      };

      const handleDelete = () => {
        // Handle delete logic here
      };

      return (
        <>
          <ActionDropdown onEdit={handleEdit} onDelete={handleDelete} cardId={row.original._id} />
          {isEditOpen && cardData && (
            <EditCardModal
              card={cardData}
              onClose={() => setIsEditOpen(false)}
              onSuccess={() => {
                setIsEditOpen(false);
              }}
            />
          )}
        </>
      );
    },
  },
];
