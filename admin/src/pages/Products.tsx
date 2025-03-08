import React, { useState } from "react";
import useFetchCardProducts from "../hooks/useFetchCardProducts"; // Import the new hook

export default function CardDesigns() {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const cardDesignsData = useFetchCardProducts(); // Using the new hook

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  };

  return (
    <div className="overflow-auto w-full flex p-10 gap-10">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[2.25rem] font-bold">Card Designs</h1>
          <div className="flex gap-4">
            <button
              className={`py-2 px-4 rounded-lg
                ${selectedButton === 'Export'
                  ? 'bg-[#FDDF05] text-white font-semibold border-2 border-black'
                  : 'bg-white text-black border border-gray-300 font-semibold hover:bg-[#FDDF05] hover:text-white'}`}
              onClick={() => handleButtonClick('Export')}
            >
              Export
            </button>

            <button
              className={`py-2 px-4 rounded-lg
                ${selectedButton === 'Add Card Design'
                  ? 'bg-[#FDDF05] text-white font-semibold border-2 border-black'
                  : 'bg-white text-black border border-gray-300 font-semibold hover:bg-[#FDDF05] hover:text-white'}`}
              onClick={() => handleButtonClick('Add Card Design')}
            >
              Add Card Design
            </button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-md p-7 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-400 text-center">
                <th className="p-3 text-sm">Card Design ID</th>
                <th className="p-3 text-sm">Front Image</th>
                <th className="p-3 text-sm">Back Image</th>
                <th className="p-3 text-sm">Card Design Name</th>
                <th className="p-3 text-sm">Materials</th>
                <th className="p-3 text-sm">Price per Unit</th>
                <th className="p-3 text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {cardDesignsData.loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-3">Loading...</td>
                </tr>
              ) : cardDesignsData.data?.length ? (
                cardDesignsData.data.map((design: CardDesign) => (
                  <tr key={design._id} className="border-t border-gray-300 text-center">
                    <td className="p-3 text-[13px]">{design._id}</td>
                    <td className="p-3 text-[13px]">
                      <img src={design.front_image} alt={design.name} className="w-12 h-12 object-cover" />
                    </td>
                    <td className="p-3 text-[13px]">
                      <img src={design.back_image} alt={`${design.name} back`} className="w-12 h-12 object-cover" />
                    </td>
                    <td className="p-3 text-[13px]">{design.name}</td>
                    <td className="p-3 text-[13px]">
                      {Object.keys(design.materials).join(", ")}
                    </td>
                    <td className="p-3 text-[13px]">
                      {Object.entries(design.materials).map(([material, { price_per_unit }]) => (
                        <div key={material}>
                          {material}: {price_per_unit} PHP
                        </div>
                      ))}
                    </td>
                    <td className="p-3 text-[13px]">
                      <button className="bg-[#FDDF05] text-white py-1 px-3 rounded-md">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-3">No card designs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
