// In Orders.js
import React from 'react';
import { useEffect, useState } from "react";
import { Order, columns } from "../components/ui/ordersColumns";
import { DataTable } from "../components/ui/DataTable";
import { ButtonOutline } from "@/components/ui/buttonOutline";
import axios from "axios";

export default function Orders() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/v1/orders/get-user-orders");
                setData(response.data);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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