import { useState } from "react";
import useFetchCardProducts from "../hooks/useFetchCardProducts"; // Import the new hook
import Modal from "../components/Modal";
import { DataTable } from "../components/ui/ProductDataTable"; // Import DataTable
import { cardColumns } from "../components/ui/cardColumns"; // Import the default export

// Define types for card design and materials
interface Material {
  price_per_unit: number;
}

interface CardDesign {
  _id: string;
  front_image: string;
  back_image: string;
  name: string;
  materials: Record<string, Material>;
  created_at: string; // Added Date Created
}

export default function CardDesigns() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const cardDesignsData = useFetchCardProducts(); // Using the new hook

  // Handle modal open and close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Pagination logic is moved to the DataTable, no need to calculate it here
  const currentItems = cardDesignsData.data || []; // Data from the API hook

  return (
      <div className="overflow-auto w-full flex p-10 gap-10">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-[2.25rem] font-bold">Products</h1>
            <div className="flex gap-4">
              {/* Export Button */}
              <button
                className="py-2 px-4 rounded-lg bg-white text-black border border-gray-300 font-semibold"
                onClick={() => { /* Export logic */ }}
              >
                Export
              </button>

              {/* Add Card Button */}
              <button
                className="py-2 px-4 rounded-lg bg-white text-black border border-gray-300 font-semibold"
                onClick={openModal} // Open modal when clicked
              >
                Add Card
              </button>
            </div>
          </div>

        <DataTable
          columns={cardColumns} // Pass the columns for the DataTable
          data={currentItems} // Pass the current items data
        />
      </div>

      {/* Modal Component for Adding New Product */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}