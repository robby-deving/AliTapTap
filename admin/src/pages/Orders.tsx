import React from 'react';
import { useEffect, useState } from "react";
import { Order, columns } from "../components/ui/ordersColumns";
import { DataTable } from "../components/ui/DataTable";
import { ButtonOutline } from "@/components/ui/buttonOutline";

async function getData(): Promise<Order[]> {
    return [
        {
          orderId: "ORD12345",
          userId: "USR001",
          designName: "Minimalist Black Card",
          amount: 250,
          material: "Plastic",
          status: "Pending",
          date: "2025-03-07",
        },
        {
          orderId: "ORD12346",
          userId: "USR002",
          designName: "Modern NFC Business Card",
          amount: 300,
          material: "Metal",
          status: "Shipped",
          date: "2025-03-06",
        },
      ];
}


export default function Orders() {
    const [data, setData] = useState<Order[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getData();
            setData(result);
        }
        fetchData();
    }, []);

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
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </div>
        
        
    );
}