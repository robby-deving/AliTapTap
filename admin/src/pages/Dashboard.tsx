import React from 'react';
import SalesChart from "@/components/SalesChart"
import useFetchData from "../hooks/useFetchData";

export default function Dashboard() {
    const totalUsersData = useFetchData<{ totalUsers: number }>("total-users");
    const totalOrdersData = useFetchData<{ totalOrders: number }>("total-orders");
    const revenueData = useFetchData<{ dailyRevenue: number; monthlyRevenue: number; yearlyRevenue: number }>("revenue");
    const unverifiedOrdersData = useFetchData<{ formattedOrders: { order_id: string; name: string; transaction_number: string }[] }>("unverified-orders");
    const recentTransactionsData = useFetchData<{ recentTransactions: { transaction_number: string; total_amount: number; transaction_date: string; customer_id: { first_name: string; last_name: string } }[] }>("recent-transactions");
    const bestSellingData = useFetchData<{ _id: string; totalSold: number }[]>("best-selling");

    return (

        <div className='overflow-auto w-full flex p-10 gap-10'>
            <div className='flex-1 '>
                {/* Top Section */}
                <div className="flex justify-between items-center">
                    <h1 className='text-[2.25rem] font-bold pb-5'>Dashboard</h1>
                    <div>
                    {/* <label className="mr-2 text-sm font-medium">Filter by Date:</label>
                    <input type="date" className="border p-2 rounded-lg" /> */}
                    </div>
                </div>

                 {/* Bottom Section */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Left Section */}
                    <div>
                        {/* // Revenue */}
                        <div className='border border-[#E4E4E7] rounded-md p-7 bg-white '>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-xl font-semibold text-[#FDDF05]'>Revenue</h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
                                    <path d="M2.83333 13.9167V1.08333H6.04167C6.58337 1.08333 7.11977 1.19002 7.62024 1.39733C8.1207 1.60463 8.57544 1.90847 8.95848 2.29151C9.34152 2.67455 9.64537 3.12929 9.85267 3.62976C10.06 4.13023 10.1667 4.66663 10.1667 5.20833C10.1667 5.75003 10.06 6.28643 9.85267 6.7869C9.64537 7.28737 9.34152 7.7421 8.95848 8.12514C8.57544 8.50819 8.1207 8.81203 7.62024 9.01933C7.11977 9.22663 6.58337 9.33333 6.04167 9.33333H2.83333M12 3.83333H1M12 6.58333H1" stroke="#FFDF62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                                
                            <div className='flex gap-8 mt-5 justify-evenly items-center'>
                                <div>
                                    <h3 className='text-sm text-gray-400'>Daily</h3>
                                    <p className='font-bold text-2xl'>{revenueData.loading ? "Loading..." : `₱ ${revenueData.data?.dailyRevenue.toLocaleString()}.00`}</p>
                                </div>

                                <div className=' w-[2px] h-10 bg-[#FDDF05]'></div>

                                <div>
                                    <h3 className='text-sm text-gray-400'>Monthly</h3>
                                    <p className='font-bold text-2xl'>{revenueData.loading ? "Loading..." : `₱ ${revenueData.data?.monthlyRevenue.toLocaleString()}.00`}</p>
                                </div>

                                <div className=' w-[2px] h-10 bg-[#FDDF05]'></div>

                                <div>
                                    <h3 className='text-sm text-gray-400'>Yearly</h3>
                                    <p className='font-bold text-2xl'>{revenueData.loading ? "Loading..." : `₱ ${revenueData.data?.yearlyRevenue.toLocaleString()}.00`}</p>
                                </div>
                                
                            </div>
                        </div>

                        <div className='flex gap-5'>  {/*  this div contains the total user total orders and best selling */}
                            <div className='flex-1'>
                                <div className='bg-white border border-[#E4E4E7] rounded-md p-7 mt-5'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-xl font-semibold text-[#FDDF05]'>Total Orders</h2>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                            <path d="M1 4.30713H14L13.2778 14.2285H1.72222L1 4.30713Z" stroke="#FFDF62" stroke-width="1.75" stroke-linejoin="round"/>
                                            <path d="M4.61108 5.77696V1H10.3889V5.77696" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="round"/>
                                            <path d="M4.61108 11.2888H10.3889" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <p className='font-bold text-2xl mt-5'>
                                        {totalOrdersData.loading ? "Loading..." : `${totalOrdersData.data?.totalOrders.toLocaleString()}`}
                                    </p>
                                </div>

                                <div className='bg-white border border-[#E4E4E7] rounded-md p-7 mt-5'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-xl font-semibold text-[#FDDF05]'>Total Users</h2>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                            <path d="M11.1111 14.2285V12.7587C11.1111 11.9791 10.8067 11.2313 10.265 10.68C9.7232 10.1287 8.9884 9.81903 8.22222 9.81903H3.88889C3.12271 9.81903 2.38791 10.1287 1.84614 10.68C1.30436 11.2313 1 11.9791 1 12.7587V14.2285" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M6.05558 6.87934C7.65106 6.87934 8.94446 5.5632 8.94446 3.93967C8.94446 2.31613 7.65106 1 6.05558 1C4.46009 1 3.16669 2.31613 3.16669 3.93967C3.16669 5.5632 4.46009 6.87934 6.05558 6.87934Z" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M15.4444 14.2285V12.7587C15.4439 12.1073 15.2309 11.4746 14.8387 10.9598C14.4466 10.445 13.8975 10.0774 13.2778 9.91453M11.1111 1.09552C11.7325 1.25742 12.2833 1.62518 12.6766 2.1408C13.0699 2.65643 13.2834 3.29059 13.2834 3.94332C13.2834 4.59606 13.0699 5.23022 12.6766 5.74585C12.2833 6.26147 11.7325 6.62923 11.1111 6.79113" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>

                                    <p className='font-bold text-2xl mt-5'>
                                        {totalUsersData.loading ? "Loading..." : totalUsersData.data?.totalUsers ?? "Error"}
                                    </p>
                                </div>

                            </div>
                            <div className='flex-1 bg-white border border-[#E4E4E7] rounded-md p-7 mt-5'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-xl font-semibold text-[#FDDF05]'>Best Selling</h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M4.42411 10.8336L6.99965 9.28013L9.57519 10.8541L8.90065 7.9106L11.1696 5.94828L8.18522 5.68255L6.99965 2.9026L5.81408 5.66211L2.82973 5.92784L5.09866 7.9106L4.42411 10.8336ZM6.99965 11.2016L3.60648 13.2457C3.45658 13.341 3.29986 13.3819 3.13634 13.3683C2.97281 13.3547 2.82973 13.3002 2.70708 13.2048C2.58444 13.1094 2.48905 12.9903 2.42091 12.8475C2.35277 12.7047 2.33915 12.5444 2.38003 12.3667L3.27942 8.50338L0.274623 5.9074C0.138351 5.78475 0.0533171 5.64494 0.0195216 5.48795C-0.0142739 5.33097 -0.00418976 5.1778 0.049774 5.02844C0.103738 4.87909 0.185501 4.75644 0.295064 4.66051C0.404627 4.56457 0.554526 4.50325 0.744762 4.47654L4.71028 4.12905L6.24334 0.49058C6.31148 0.327053 6.41723 0.204408 6.56058 0.122645C6.70394 0.0408815 6.8503 0 6.99965 0C7.14901 0 7.29536 0.0408815 7.43872 0.122645C7.58208 0.204408 7.68783 0.327053 7.75596 0.49058L9.28902 4.12905L13.2545 4.47654C13.4453 4.50379 13.5952 4.56512 13.7042 4.66051C13.8133 4.7559 13.895 4.87854 13.9495 5.02844C14.004 5.17834 14.0144 5.33178 13.9806 5.48877C13.9468 5.64575 13.8615 5.7853 13.7247 5.9074L10.7199 8.50338L11.6193 12.3667C11.6602 12.5439 11.6465 12.7041 11.5784 12.8475C11.5103 12.9908 11.4149 13.1099 11.2922 13.2048C11.1696 13.2996 11.0265 13.3541 10.863 13.3683C10.6994 13.3825 10.5427 13.3416 10.3928 13.2457L6.99965 11.2016Z" fill="#FFDF62"/>
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    {bestSellingData.loading ? (
                                        <div className="text-center p-3">Loading...</div>
                                    ) : bestSellingData.data?.length ? (
                                        bestSellingData.data.map((design, index) => (
                                            <div key={index} className="flex justify-between items-center text-base font-bold pt-3">
                                                <span className="text-black">{design._id}</span>
                                                <span className="text-[#FDDF05]">{design.totalSold}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-3">No best-selling designs</div>
                                    )}
                                    {/* <div className="flex justify-between items-center text-base font-bold pt-3">
                                        <span className="text-black">Design 1</span>
                                        <span className="text-[#FDDF05]">30</span>
                                    </div>
                                    <div className="flex justify-between items-center text-base font-bold pt-3">
                                        <span className="text-black">Design 2</span>
                                        <span className="text-[#FDDF05]">25</span>
                                    </div>
                                    <div className="flex justify-between items-center text-base font-bold pt-3">
                                        <span className="text-black">Design 3</span>
                                        <span className="text-[#FDDF05]">20</span>
                                    </div>
                                    <div className="flex justify-between items-center text-base font-bold pt-3">
                                        <span className="text-black">Design 4</span>
                                        <span className="text-[#FDDF05]">18</span>
                                    </div>
                                    <div className="flex justify-between items-center text-base font-bold pt-3">
                                        <span className="text-black">Design 5</span>
                                        <span className="text-[#FDDF05]">15</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className='bg-white mt-5'>
                            <h1 className='text-xl font-semibold text-[#FDDF05]'>Unverified Orders</h1>
                            <div className="border border-[#E4E4E7] rounded-md mt-3">
                                <table className="w-full border-collapse">
                                    {/* Table Header */}
                                    <thead>
                                    <tr className="text-gray-400 text-center">
                                        <th className="p-3 text-sm">Order ID</th>
                                        <th className="p-3 text-sm">Name</th>
                                        <th className="p-3 text-sm">Transaction ID</th>
                                    </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody>
                                    {unverifiedOrdersData.loading ? (
                                        <tr>
                                            <td colSpan={3} className="text-center p-3">Loading...</td>
                                        </tr>
                                    ) : unverifiedOrdersData.data?.formattedOrders.length ? (
                                        unverifiedOrdersData.data.formattedOrders.map((order) => (
                                            <tr key={order.order_id} className="border-t border-[#E4E4E7] text-center">
                                                <td className="p-3 text-[13px]">{order.order_id}</td>
                                                <td className="p-3 text-[13px]">{order.name}</td>
                                                <td className="p-3 text-[13px]">{order.transaction_number}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center p-3">No unverified orders</td>
                                        </tr>
                                    )}
                                    {/* {[...Array(5)].map((_, index) => (
                                        <tr key={index} className="border-t border-gray-300 text-center">
                                        <td className="p-3 w-1/3 text-sm">00000001</td>
                                        <td className="p-3 w-1/3 text-sm">Archie Onoya</td>
                                        <td className="p-3 w-1/3 text-sm">00000001</td>
                                        </tr>
                                    ))} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div>
                        <div>
                            <h1 className='text-xl font-semibold text-[#FDDF05]'>Sales</h1>
                            <div className='border border-[#E4E4E7] rounded-md p-7 my-5'>
                                <SalesChart />
                            </div>
                        </div>

                        <div className='bg-white mt-5'>
                            <h1 className='text-xl font-semibold text-[#FDDF05]'>Recent Transactions</h1>
                            <div className="border border-[#E4E4E7] rounded-md mt-3">
                                <table className="w-full border-collapse">
                                    {/* Table Header */}
                                    <thead>
                                    <tr className="text-gray-400 text-center">
                                        <th className="p-3">Transaction ID</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Total</th>
                                        <th className="p-3">Date</th>
                                    </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody>
                                    {recentTransactionsData.loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center p-3">Loading...</td>
                                        </tr>
                                    ) : recentTransactionsData.data?.recentTransactions.length ? (
                                        recentTransactionsData.data.recentTransactions.map((transaction) => (
                                            <tr key={transaction.transaction_number} className="border-t border-[#E4E4E7] text-center">
                                                <td className="p-3 text-[13px]">{transaction.transaction_number}</td>
                                                <td className="p-3 text-[13px]">{transaction.customer_id.first_name} {transaction.customer_id.last_name}</td>
                                                <td className="p-3 text-[13px]">₱{transaction.total_amount.toLocaleString()}.00</td>
                                                <td className="p-3 text-[13px]">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center p-3">No recent transactions</td>
                                        </tr>
                                    )}
                                    {/* {[...Array(5)].map((_, index) => (
                                        <tr key={index} className="border-t border-gray-300 text-center">
                                        <td className="p-3 text-sm">00000001</td>
                                        <td className="p-3 text-sm">Design 1</td>
                                        <td className="p-3 text-sm">P1,200.00</td>
                                        <td className="p-3 text-sm">02-21-2025</td>
                                        </tr>
                                    ))} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}