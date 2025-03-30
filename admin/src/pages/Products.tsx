import { useState, useEffect, useRef } from "react"; 
import jsPDF from "jspdf"; 
import autoTable from "jspdf-autotable"; 
import Papa from "papaparse"; 
import useFetchCardProducts from "../hooks/useFetchCardProducts"; 
import Modal from "../components/AddProductModal";
import { DataTable } from "../components/ui/ProductDataTable";
import { cardColumns } from "../components/ui/cardColumns"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ButtonOutline } from "@/components/ui/buttonOutline"; 

interface Material {
  price_per_unit: number;
}

export interface CardDesign {
  _id: string;
  front_image: string;
  back_image: string;
  name: string;
  materials: Record<string, Material>;
  created_at: string; 
  modified_at?: string; 
  deleted_at?: string; 
}

export default function CardDesigns() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 

  const cardDesignsData = useFetchCardProducts(); 

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const currentItems = cardDesignsData.data || [];

  const exportToCSV = () => {
    const date = new Date().toLocaleString();

    const customHeader = [
      ["AliTapTap Card Designs Report"],
      [`Date downloaded: ${date}`],
      [""], 
      ["Design ID", "Name", "Front Image", "Back Image", "Materials", "Price per Unit", "Created At", "Modified At"], // Removed "Deleted At"
    ];

    const csvData = currentItems.map(item => {
      const materialNames = Object.keys(item.materials).join(", ");
      const pricePerUnit = Object.values(item.materials)
        .map((material) => (material as Material).price_per_unit)
        .join(", ");

      const modifiedAt = item.modified_at ? new Date(item.modified_at).toLocaleDateString() : "Not Modified";

      return [
        item._id, 
        item.name,
        item.front_image,
        item.back_image,
        materialNames,
        pricePerUnit,
        new Date(item.created_at).toLocaleDateString(),
        modifiedAt,
      ];
    });

    const finalCSVData = [...customHeader, ...csvData];

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; 
    const date = new Date().toLocaleString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AliTapTap Card Designs Report", pageWidth / 2, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Date downloaded: ${date}`, pageWidth / 2, 30, { align: "center" });

    autoTable(doc, {
      startY: 40, 
      head: [["Design ID", "Name", "Materials", "Price per Unit", "Created At", "Modified At"]], 
      body: currentItems.map(item => {
        const materials = item.materials as Record<string, Material>;

        const materialNames = Object.keys(materials).join(", ");
        const pricePerUnit = Object.values(materials)
          .map((material: Material) => material.price_per_unit)
          .join(", ");

        const modifiedAt = item.modified_at ? new Date(item.modified_at).toLocaleDateString() : "Not Modified";

        return [
          item._id,
          item.name,
          materialNames,
          pricePerUnit,
          new Date(item.created_at).toLocaleDateString(),
          modifiedAt,
        ];
      }),
      headStyles: {
        fillColor: [253, 223, 5],
      },
      margin: { top: 40, bottom: 20 },
    });

    doc.save("card-designs.pdf");
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ButtonOutline text="Export" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-[#E4E4E7]">
                <DropdownMenuItem 
                    onClick={exportToCSV}
                    className="cursor-pointer hover:bg-gray-100"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={exportToPDF}
                    className="cursor-pointer hover:bg-gray-00"
                >
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Card Button */}
            <ButtonOutline text="Add Card" onClick={openModal} />
          </div>
        </div>

        <DataTable
          columns={cardColumns}
          data={currentItems} 
        />
      </div>

      {/* Modal Component for Adding New Product */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
