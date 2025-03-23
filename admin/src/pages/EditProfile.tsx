import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        username: user?.username || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        gender: user?.gender || "Male",
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSave = () => {
        console.log("Updated Profile:", formData);
        navigate("/profile");
    };

  return (
    <div className="overflow-auto w-full flex p-10 gap-10">
      <div className="flex-1">
        {/* Top Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-[2.25rem] font-bold">Edit Profile</h1>
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
                    <input
                    type="text"
                    className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]"
                    defaultValue={user?.first_name || ""}
                    />
                </div>

                <div>
                    <label className="block text-[#4F4F4F] mb-2">Last Name</label>
                    <input
                    type="text"
                    className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]"
                    defaultValue={user?.last_name || ""}
                    />
                </div>

                <div>
                    <label className="block text-[#4F4F4F] mb-2">Username</label>
                    <input
                    type="text"
                    className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]"
                    defaultValue={user?.username || ""}
                    />
                </div>

                <div>
                    <label className="block text-[#4F4F4F] mb-2">Gender</label>
                    {/* <select
                    className="w-full border border-[#BDBDBD] pl-4 py-4 pr-10 rounded text-[#4F4F4F] bg-white"
                    defaultValue={user?.gender || "Other"}
                    >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    </select> */}
                    <Select onValueChange={(value) => setFormData({ ...formData, gender: value })} defaultValue={formData.gender}>
                        <SelectTrigger className="w-full border cursor-pointer border-[#BDBDBD] px-4 py-7 rounded text-base text-[#4F4F4F] bg-white">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E4E4E7]">
                            <SelectItem value="Male" className="cursor-pointer hover:bg-gray-100">Male</SelectItem>
                            <SelectItem value="Female" className="cursor-pointer hover:bg-gray-100">Female</SelectItem>
                            <SelectItem value="Other" className="cursor-pointer hover:bg-gray-100">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-[#4F4F4F] mb-2">Email</label>
                    <input
                    type="email"
                    className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]"
                    defaultValue={user?.email || ""}
                    />
                </div>

                <div>
                    <label className="block text-[#4F4F4F] mb-2">Phone Number</label>
                    <input
                    type="tel"
                    className="w-full border border-[#BDBDBD] px-4 py-4 rounded text-[#4F4F4F]"
                    defaultValue={user?.phone_number || ""}
                    />
                </div>

                {/* <button
                    type="button"
                    className="w-full cursor-pointer bg-[#FDCB07] hover:bg-[#E5B606] text-white py-4 rounded text-lg font-semibold mt-4"
                >
                    Edit Profile
                </button> */}

                <div className="flex gap-4">
                    <button className="w-full cursor-pointer bg-[#C0C0C0] hover:bg-[#A9A9A9] text-white py-4 rounded text-lg font-semibold mt-4" onClick={() => navigate("/profile")}>Discard</button>
                    <button className="w-full cursor-pointer bg-[#FDCB07] hover:bg-[#E5B606] text-white py-4 rounded text-lg font-semibold mt-4" onClick={handleSave}>Save</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
