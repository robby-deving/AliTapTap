import React from 'react';
import { useEffect, useState } from "react";
import { Order, columns } from "../components/ui/ordersColumns";
import { DataTable } from "../components/ui/DataTable";
import { ButtonOutline } from "@/components/ui/buttonOutline";
import axios from "axios"; // Import axios for API requests


export default function Orders() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/v1/orders/get-user-orders"); // Adjust API route as needed
                setData(response.data);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // const [data, setData] = useState<Order[]>([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const response = await fetch("http://localhost:4000/api/v1/orders/get-user-orders");
    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch orders");
    //             }
    //             const result = await response.json();
    //             setData(result.data); // Extract the array from the response
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     }

    //     fetchData();
    // }, []);

    return (
        <div className='overflow-auto w-full flex p-10 gap-10'>
            <div className='flex-1 '>
                {/* Top Section */}
                <div className="flex justify-between items-center">
                    <h1 className='text-[2.25rem] font-bold pb-5'>Orders</h1>
                    <div>
                    {/* <label className="mr-2 text-sm font-medium">Filter by Date:</label>
                    <input type="date" className="border p-2 rounded-lg" /> */}
                    <ButtonOutline text="Export" onClick={() => alert("Going to Dashboard!")} />
                    </div>
                </div>

                {/* Bottom Section */}
                <div>
                {loading ? (
                    <p className="text-center">Loading orders...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    /* Data Table */
                    <DataTable columns={columns} data={data} />
                )}
                </div>
            </div>
        </div>
        
        
    );
}