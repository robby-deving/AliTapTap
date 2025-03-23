import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="h-[6.25rem] border-b border-gray-200 flex items-center justify-between px-[3.94rem]">
      <div className="text-xl font-bold"></div>
      
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <path
                d="M13.5 1C6.59625 1 1 6.59625 1 13.5C1 20.4037 6.59625 26 13.5 26C20.4037 26 26 20.4037 26 13.5C26 6.59625 20.4037 1 13.5 1Z"
                stroke="#231F20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.83838 21.4326C3.83838 21.4326 6.62463 17.8751 13.4996 17.8751C20.3746 17.8751 23.1621 21.4326 23.1621 21.4326M13.4996 13.5001C14.4942 13.5001 15.448 13.105 16.1513 12.4017C16.8545 11.6985 17.2496 10.7446 17.2496 9.75008C17.2496 8.75551 16.8545 7.80169 16.1513 7.09843C15.448 6.39516 14.4942 6.00008 13.4996 6.00008C12.5051 6.00008 11.5512 6.39516 10.848 7.09843C10.1447 7.80169 9.74963 8.75551 9.74963 9.75008C9.74963 10.7446 10.1447 11.6985 10.848 12.4017C11.5512 13.105 12.5051 13.5001 13.4996 13.5001Z"
                stroke="#231F20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="font-semibold">{user.username || 'User'}</h1>
          </div>
          
        </div>
      ) : (
        <div>
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </a>
        </div>
      )}
    </div>
  );
}