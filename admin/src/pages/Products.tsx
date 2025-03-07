import React, { useState } from 'react';
import useFetchData from "../hooks/useFetchData";

export default function Products() {
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const productsData = useFetchData<{ product_id: string; front_picture: string; design_name: string; material: string; category: string }[]>("products");

    const handleButtonClick = (button: string) => {
        setSelectedButton(button);
    };

    return (
        <div className='overflow-auto w-full flex p-10 gap-10'>
            <div className='flex-1'>
                <div className="flex justify-between items-center mb-5">
                    <h1 className='text-[2.25rem] font-bold'>Products</h1>
                    <div className="flex gap-4">
                        {/* Export Button */}
                        <button
                            className={`py-2 px-4 rounded-lg 
                                ${selectedButton === 'Export' 
                                    ? 'bg-[#FDDF05] text-white font-semibold border-2 border-black'
                                    : 'bg-white text-black border border-gray-300 font-semibold hover:bg-[#FDDF05] hover:text-white'}
                            `}
                            onClick={() => handleButtonClick('Export')}
                        >
                            Export
                        </button>
                        
                        {/* Add Product Button */}
                        <button
                            className={`py-2 px-4 rounded-lg 
                                ${selectedButton === 'Add Product' 
                                    ? 'bg-[#FDDF05] text-white font-semibold border-2 border-black'
                                    : 'bg-white text-black border border-gray-300 font-semibold hover:bg-[#FDDF05] hover:text-white'}
                            `}
                            onClick={() => handleButtonClick('Add Product')}
                        >
                            Add Product
                        </button>
                    </div>
                </div>
                <div className="border border-gray-300 rounded-md p-7 bg-white">
                    <table className="w-full border-collapse">
                        {/* Table Header */}
                        <thead>
                            <tr className="text-gray-400 text-center">
                                <th className="p-3 text-sm">Product ID</th>
                                <th className="p-3 text-sm">Front Picture</th>
                                <th className="p-3 text-sm">Design Name</th>
                                <th className="p-3 text-sm">Material</th>
                                <th className="p-3 text-sm">Category</th>
                                <th className="p-3 text-sm">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {productsData.loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-3">Loading...</td>
                                </tr>
                            ) : productsData.data?.length ? (
                                productsData.data.map((product) => (
                                    <tr key={product.product_id} className="border-t border-gray-300 text-center">
                                        <td className="p-3 text-[13px]">{product.product_id}</td>
                                        <td className="p-3 text-[13px]">
                                            <img src={product.front_picture} alt={product.design_name} className="w-12 h-12 object-cover" />
                                        </td>
                                        <td className="p-3 text-[13px]">{product.design_name}</td>
                                        <td className="p-3 text-[13px]">{product.material}</td>
                                        <td className="p-3 text-[13px]">{product.category}</td>
                                        <td className="p-3 text-[13px]">
                                            <button className="bg-[#FDDF05] text-white py-1 px-3 rounded-md">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-3">No products available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
