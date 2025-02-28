import React from 'react';

export default function Dashboard() {
    return (
        <div className=' h-full flex p-10 gap-10 overflow-hidden'>
            <div className='flex-1 '>
                <h1 className='text-[2.25rem] font-bold pb-5'>Dashboard</h1>
                <div>
                    {/* // Revenue */}
                    <div className='border border-gray-300 rounded-md p-5 bg-white '>
                        <h2 className='text-2xl font-semibold text-[#FDDF05]'>Revenue</h2>
                        <div className='flex justify-between gap-5 mt-5'>
                            <div>
                                <h3 className='text-sm text-gray-400'>Today</h3>
                                <p className='font-bold text-2xl'>P 1,300,00</p>
                            </div>

                            <div className=' w-[2px] bg-[#FDDF05]'></div>

                            <div>
                                <h3 className='text-sm text-gray-400'>Monthly</h3>
                                <p className='font-bold text-2xl'>P 1,300,00</p>
                            </div>

                            <div className=' w-[2px] bg-[#FDDF05]'></div>

                            <div>
                                <h3 className='text-sm text-gray-400'>Yearly</h3>
                                <p className='font-bold text-2xl'>P 1,300,00</p>
                            </div>
                         
                        </div>
                    </div>

                   <div className='flex gap-5'>  {/*  this div contains the total user total orders and best selling */}
                        <div className='flex-1'>
                            <div className='bg-white border border-gray-300 rounded-md p-5 mt-5'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-2xl font-semibold text-[#FDDF05]'>Total Orders</h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                        <path d="M1 4.30713H14L13.2778 14.2285H1.72222L1 4.30713Z" stroke="#FFDF62" stroke-width="1.75" stroke-linejoin="round"/>
                                        <path d="M4.61108 5.77696V1H10.3889V5.77696" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="round"/>
                                        <path d="M4.61108 11.2888H10.3889" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p className='font-bold text-2xl'>P 1,000.00</p>
                            </div>

                            <div className='bg-white border border-gray-300 rounded-md p-5 mt-5'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-2xl font-semibold text-[#FDDF05]'>Total Users</h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M11.1111 14.2285V12.7587C11.1111 11.9791 10.8067 11.2313 10.265 10.68C9.7232 10.1287 8.9884 9.81903 8.22222 9.81903H3.88889C3.12271 9.81903 2.38791 10.1287 1.84614 10.68C1.30436 11.2313 1 11.9791 1 12.7587V14.2285" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M6.05558 6.87934C7.65106 6.87934 8.94446 5.5632 8.94446 3.93967C8.94446 2.31613 7.65106 1 6.05558 1C4.46009 1 3.16669 2.31613 3.16669 3.93967C3.16669 5.5632 4.46009 6.87934 6.05558 6.87934Z" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15.4444 14.2285V12.7587C15.4439 12.1073 15.2309 11.4746 14.8387 10.9598C14.4466 10.445 13.8975 10.0774 13.2778 9.91453M11.1111 1.09552C11.7325 1.25742 12.2833 1.62518 12.6766 2.1408C13.0699 2.65643 13.2834 3.29059 13.2834 3.94332C13.2834 4.59606 13.0699 5.23022 12.6766 5.74585C12.2833 6.26147 11.7325 6.62923 11.1111 6.79113" stroke="#FFDF62" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>

                                <p className='font-bold text-2xl'>143</p>
                            </div>

                        </div>
                        <div className='flex-1 bg-white border border-gray-300 rounded-md p-5 mt-5'>
                            <div>
                                <h1>Best Selling</h1>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M4.42411 10.8336L6.99965 9.28013L9.57519 10.8541L8.90065 7.9106L11.1696 5.94828L8.18522 5.68255L6.99965 2.9026L5.81408 5.66211L2.82973 5.92784L5.09866 7.9106L4.42411 10.8336ZM6.99965 11.2016L3.60648 13.2457C3.45658 13.341 3.29986 13.3819 3.13634 13.3683C2.97281 13.3547 2.82973 13.3002 2.70708 13.2048C2.58444 13.1094 2.48905 12.9903 2.42091 12.8475C2.35277 12.7047 2.33915 12.5444 2.38003 12.3667L3.27942 8.50338L0.274623 5.9074C0.138351 5.78475 0.0533171 5.64494 0.0195216 5.48795C-0.0142739 5.33097 -0.00418976 5.1778 0.049774 5.02844C0.103738 4.87909 0.185501 4.75644 0.295064 4.66051C0.404627 4.56457 0.554526 4.50325 0.744762 4.47654L4.71028 4.12905L6.24334 0.49058C6.31148 0.327053 6.41723 0.204408 6.56058 0.122645C6.70394 0.0408815 6.8503 0 6.99965 0C7.14901 0 7.29536 0.0408815 7.43872 0.122645C7.58208 0.204408 7.68783 0.327053 7.75596 0.49058L9.28902 4.12905L13.2545 4.47654C13.4453 4.50379 13.5952 4.56512 13.7042 4.66051C13.8133 4.7559 13.895 4.87854 13.9495 5.02844C14.004 5.17834 14.0144 5.33178 13.9806 5.48877C13.9468 5.64575 13.8615 5.7853 13.7247 5.9074L10.7199 8.50338L11.6193 12.3667C11.6602 12.5439 11.6465 12.7041 11.5784 12.8475C11.5103 12.9908 11.4149 13.1099 11.2922 13.2048C11.1696 13.2996 11.0265 13.3541 10.863 13.3683C10.6994 13.3825 10.5427 13.3416 10.3928 13.2457L6.99965 11.2016Z" fill="#FFDF62"/>
                                </svg>
                            </div>
                            <div>
                                <h2>Design 1</h2>
                                <p>30</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white h-full mt-5'>
                        <h1>Unverified Orders</h1>
                        <div className='border border-gray-300 rounded-md p-5 '>

                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1 bg-gray-300'></div>
        </div>
    );
}