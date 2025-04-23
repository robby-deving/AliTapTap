// In Orders.js
import { useEffect, useState } from "react";
import { Order, columns } from "../components/ui/ordersColumns";
import { DataTable } from "../components/ui/DataTable";
import { ButtonOutline } from "@/components/ui/buttonOutline";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Orders() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("https://api.alitaptap.me/api/v1/orders/get-user-orders");
                setData(response.data);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Function to export as CSV
    const exportToCSV = () => {
        const date = new Date().toLocaleString();
    
        // Add custom header information
        const customHeader = [
            ["AliTapTap Orders Report"],
            [`Date downloaded: ${date}`],
            [""], // Empty row for spacing
            ["Order ID", "Customer Name", "Design Name", "Amount", "Material", "Status", "Date"], // Column headers
        ];
    
        // Convert order data into rows
        const csvData = data.map(order => [
            order.orderId,
            order.fullName,
            order.designName,
            order.amount,
            order.material,
            order.status,
            new Date(order.date).toLocaleDateString()
        ]);
    
        // Merge custom header with actual data
        const finalCSVData = [...customHeader, ...csvData];

        const csv = Papa.unparse(finalCSVData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "orders.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to export as PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width; // Get page width
        const date = new Date().toLocaleString();

        // Set font and alignment
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("AliTapTap Orders Report", pageWidth / 2, 20, { align: "center" });

        // Set date alignment
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`${date}`, pageWidth / 2, 30, { align: "center" });
        
        autoTable(doc, {
            startY: 40,
            head: [["Order ID", "Customer Name", "Design Name", "Amount", "Material", "Status", "Date"]],
            body: data.map(order => [
                order.orderId,
                order.fullName,
                order.designName,
                order.amount,
                order.material,
                order.status,
                new Date(order.date).toLocaleDateString()
            ]),
            headStyles: {
                fillColor: [253, 223, 5] // RGB equivalent of #FDDF05
            }
        });
        doc.save("orders.pdf");
    };


    // Function to update a specific order in the data array
    const updateOrderInTable = (orderId: string, updatedData: Partial<Order>) => {
        setData(prevData => 
            prevData.map(order => 
                order.orderId === orderId ? { ...order, ...updatedData } : order
            )
        );
    };

    return (
        <div className='overflow-auto w-full flex p-10 gap-10'>
            <div className='flex-1 '>
                {/* Top Section */}
                <div className="flex justify-between items-center">
                    <h1 className='text-[2.25rem] font-bold pb-5'>Orders</h1>
                    <div>
                    {/* Export Dropdown */}
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
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    Export as PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Bottom Section */}
                <div>
                {loading ? (
                    <p className="text-center">Loading orders...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    /* Pass the updateOrderInTable function to the DataTable */
                    <DataTable 
                        columns={columns} 
                        data={data} 
                        updateOrderInTable={updateOrderInTable} 
                    />
                )}
                </div>
            </div>
        </div>
    );
}