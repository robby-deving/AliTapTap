import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminProfile() {
//   const adminData = {
//     firstName: "Ian Gabriel",
//     lastName: "Villame",
//     username: "@ianVillame123",
//     gender: "Male",
//     email: "ian@gmail.com",
//     phoneNumber: "09123456789",
//   };
    const { user } = useAuth();

  return (
    <div className="overflow-auto w-full flex p-10 gap-10">
      <div className="flex-1">
        {/* Top Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-[2.25rem] font-bold">Profile</h1>
        </div>

        {/* Bottom Section */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-md p-2">
            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="w-30 h-30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
                  <path d="M80 5C38.5775 5 5 38.5775 5 80C5 121.422 38.5775 155 80 155C121.422 155 155 121.422 155 80C155 38.5775 121.422 5 80 5Z" stroke="#231F20" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22.0322 127.595C22.0322 127.595 38.7497 106.25 79.9997 106.25C121.25 106.25 137.975 127.595 137.975 127.595M79.9997 80C85.9671 80 91.6901 77.6295 95.9096 73.4099C100.129 69.1903 102.5 63.4674 102.5 57.5C102.5 51.5326 100.129 45.8097 95.9096 41.5901C91.6901 37.3705 85.9671 35 79.9997 35C74.0324 35 68.3094 37.3705 64.0898 41.5901C59.8703 45.8097 57.4997 51.5326 57.4997 57.5C57.4997 63.4674 59.8703 69.1903 64.0898 73.4099C68.3094 77.6295 74.0324 80 79.9997 80Z" stroke="#231F20" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-[#4F4F4F] mb-2">First Name</label>
                <p className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]">{user?.first_name || "N/A"}</p>
              </div>

              <div>
                <label className="block text-[#4F4F4F] mb-2">Last Name</label>
                <p className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]">{user?.last_name || "N/A"}</p>
              </div>

              <div>
                <label className="block text-[#4F4F4F] mb-2">Username</label>
                <p className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]">{user?.username || "N/A"}</p>
              </div>

              <div>
                <label className="block text-[#4F4F4F] mb-2">Gender</label>
                <p className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]">{user?.gender || "N/A"}</p>
              </div>

              <div>
                <label className="block text-[#4F4F4F] mb-2">Email</label>
                <p className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]">{user?.email || "N/A"}</p>
              </div>

              <div>
                <label className="block text-[#4F4F4F] mb-2">Phone Number</label>
                <p className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]">{user?.phone_number || "N/A"}</p>
              </div>

              <button type="button" className="w-full cursor-pointer bg-[#FDCB07] hover:bg-[#E5B606] text-white py-4 rounded text-lg font-semibold mt-4">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
