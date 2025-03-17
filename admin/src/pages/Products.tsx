import { useState, useEffect, useRef } from "react"; // Import useRef for referencing the dropdown
import jsPDF from "jspdf"; // Import jsPDF for PDF export
import autoTable from "jspdf-autotable"; // Import autoTable for table export
import Papa from "papaparse"; // Import Papa for CSV parsing and stringifying
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
  modified_at?: string; // Added Modified At
  deleted_at?: string; // Added Deleted At
}

export default function CardDesigns() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Create a reference for the dropdown

  const cardDesignsData = useFetchCardProducts(); // Using the new hook

  // Handle modal open and close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Pagination logic is moved to the DataTable, no need to calculate it here
  const currentItems = cardDesignsData.data || []; // Data from the API hook

  // Function to export as CSV
  const exportToCSV = () => {
    const date = new Date().toLocaleString();

    // Add custom header information
    const customHeader = [
      ["AliTapTap Card Designs Report"],
      [`Date downloaded: ${date}`],
      [""], // Empty row for spacing
      ["Design ID", "Name", "Front Image", "Back Image", "Materials", "Price per Unit", "Created At", "Modified At"], // Removed "Deleted At"
    ];

    // Convert card design data into rows
    const csvData = currentItems.map(item => {
      const materialNames = Object.keys(item.materials).join(", ");
      const pricePerUnit = Object.values(item.materials)
        .map((material) => (material as Material).price_per_unit)
        .join(", ");

      // Add modified_at to the row data (Removed deleted_at)
      const modifiedAt = item.modified_at ? new Date(item.modified_at).toLocaleDateString() : "Not Modified";

      return [
        item._id, 
        item.name,
        item.front_image,
        item.back_image,
        materialNames,
        pricePerUnit,
        new Date(item.created_at).toLocaleDateString(),
        modifiedAt, // Added Modified At
      ];
    });

    // Merge custom header with actual data
    const finalCSVData = [...customHeader, ...csvData];

    // Convert the data to CSV format
    const csv = Papa.unparse(finalCSVData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "card-designs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; 
    const date = new Date().toLocaleString();

    // Set title for the report
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AliTapTap Card Designs Report", pageWidth / 2, 20, { align: "center" });

    // Set the date of download
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Date downloaded: ${date}`, pageWidth / 2, 30, { align: "center" });

    // Table Headers (Removed "Deleted At" column)
    autoTable(doc, {
      startY: 40, // Set the start position for the table
      head: [["Design ID", "Name", "Materials", "Price per Unit", "Created At", "Modified At"]], // Removed "Deleted At" column
      body: currentItems.map(item => {
        const materials = item.materials as Record<string, Material>;

        const materialNames = Object.keys(materials).join(", ");
        const pricePerUnit = Object.values(materials)
          .map((material: Material) => material.price_per_unit)
          .join(", ");

        // Add modified_at to the table data (Removed deleted_at)
        const modifiedAt = item.modified_at ? new Date(item.modified_at).toLocaleDateString() : "Not Modified";

        return [
          item._id,
          item.name,
          materialNames,
          pricePerUnit,
          new Date(item.created_at).toLocaleDateString(),
          modifiedAt, // Added Modified At
        ];
      }),
      headStyles: {
        fillColor: [253, 223, 5],
      },
      margin: { top: 40, bottom: 20 },
    });

    doc.save("card-designs.pdf");
  };

  // Close the dropdown if clicked outside of it
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

  return (
    <div className="overflow-auto w-full flex p-10 gap-10">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[2.25rem] font-bold">Products</h1>
          <div className="relative flex gap-4">
            {/* Export Button */}
            <button
              className="py-2 px-4 rounded-lg bg-white text-black border border-gray-300 font-semibold hover:bg-gray-100 active:bg-gray-300 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
            >
              Export
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                ref={dropdownRef}
                className="absolute bg-white shadow-md border border-gray-300 mt-1 rounded-lg p-2 w-48 z-10"
              >
                <div
                  onClick={exportToCSV}
                  className="cursor-pointer hover:bg-gray-100 py-2 px-4 text-black"
                >
                  Export as CSV
                </div>
                <div
                  onClick={exportToPDF}
                  className="cursor-pointer hover:bg-gray-100 py-2 px-4 text-black"
                >
                  Export as PDF
                </div>
              </div>
            )}

            {/* Add Card Button */}
            <button
              className="py-2 px-4 rounded-lg bg-white text-black border border-gray-300 font-semibold hover:bg-gray-100 active:bg-gray-300 cursor-pointer"
              onClick={openModal}
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
