import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission refresh
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

    //   if (data.data.isAdmin !== true) {
    //     setError("Email or password is incorrect");
    //     setIsLoading(false);
    //     return
    // } implement when done developing

      login(data.data); // Store user in context
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center rounded-b-[1.875rem] bg-gradient-to-b from-[#FFE301] to-[rgba(255,255,255,0.12)]">
        <div className=" mx-auto  bg-white rounded-lg shadow-md w-[40.75rem] p-20 ">
            <div className="flex flex-col items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="47" viewBox="0 0 42 47" fill="none">
                <path d="M12.0447 34.6167L20.192 30.6989L28.575 34.6167C28.575 34.6167 21.5977 47.0648 20.4433 45.562C19.2889 44.0591 21.0305 49.1018 12.0447 34.6167Z" fill="url(#paint0_linear_449_220)"/>
                <path d="M18.8419 10.0735L19.3712 9.83133C19.5577 9.74695 19.7522 9.68248 19.9517 9.63895C19.5605 9.71943 19.1853 9.86633 18.8419 10.0735ZM19.0821 11.4586L19.4691 11.2844C19.6152 11.1914 19.7712 11.1155 19.934 11.058C19.6254 11.1289 19.3351 11.2654 19.0821 11.4586ZM21.1617 11.0263C21.0844 11.0005 21.0057 10.9793 20.9259 10.963C20.9864 10.9761 21.0458 10.9935 21.1039 11.015C21.1502 11.0294 21.1955 11.0468 21.2396 11.0671L21.6844 11.273L22.1426 11.479C21.8563 11.2497 21.5198 11.0944 21.1617 11.0263Z" fill="#231F20"/>
                <path d="M41.1217 35.4179L38.4371 18.7216C38.3717 18.294 38.2015 17.8901 37.9422 17.5471C37.6829 17.2042 37.3429 16.9332 36.9535 16.7593L23.1324 10.4424L22.3227 10.0713L21.7978 9.83134C21.6129 9.74699 21.4198 9.68251 21.2218 9.63896L21.1306 9.62312L21.0527 9.60954L20.9259 9.59143H20.788H20.7169H20.4477H20.3788H20.2409L20.1119 9.60954L20.034 9.62312L19.9517 9.63896C19.7522 9.6825 19.5577 9.74697 19.3712 9.83134L18.8419 10.0735L18.099 10.413L4.20665 16.7616C3.81758 16.9353 3.47774 17.2059 3.21848 17.5484C2.95921 17.891 2.78885 18.2944 2.72311 18.7216L0.0362831 35.4179C-0.146101 36.5699 0.367688 37.7762 1.38415 38.5707C1.99299 39.0598 2.7437 39.3304 3.51938 39.3402C3.93316 39.3416 4.34253 39.2537 4.72044 39.0822L12.3739 35.5854L17.4139 44.6884C18.0011 45.7476 19.22 46.4062 20.5945 46.4062C21.9669 46.4062 23.188 45.7476 23.7751 44.6884L28.8085 35.5967L36.4375 39.0822C36.8154 39.2537 37.2248 39.3416 37.6386 39.3402C38.4142 39.3304 39.165 39.0598 39.7738 38.5707C40.7925 37.7762 41.3063 36.5699 41.1217 35.4179ZM19.2667 11.427C19.3315 11.3763 19.3991 11.3295 19.4691 11.2866L19.0821 11.4609C19.3355 11.2666 19.6266 11.1293 19.9362 11.058C20.0354 11.0212 20.1373 10.9925 20.2409 10.972L20.3143 10.9585C20.379 10.9473 20.4444 10.9405 20.51 10.9381H20.6568C20.7232 10.9404 20.7893 10.9472 20.8548 10.9585L20.9304 10.972C21.0102 10.9884 21.0889 11.0095 21.1662 11.0354C21.5258 11.1028 21.864 11.2581 22.1515 11.4881L21.6933 11.2821C21.7644 11.3244 21.8327 11.3713 21.8979 11.4224C22.385 11.8049 22.861 12.4907 22.7364 13.2716L20.579 26.6431L18.4282 13.267C18.3036 12.493 18.7796 11.8072 19.2667 11.4247V11.427ZM22.5385 43.9799C22.2026 44.5842 21.4575 44.9622 20.5968 44.9622C19.736 44.9622 18.9864 44.5842 18.6528 43.9799L13.6773 34.9901L19.8872 32.1542C20.1403 32.0423 20.3739 31.8894 20.579 31.7016C20.7852 31.8889 21.0195 32.0417 21.2729 32.1542L27.5007 35.0014L22.5385 43.9799ZM19.7961 30.1897C19.8116 30.287 19.8339 30.3821 19.8583 30.4771C19.73 30.6666 19.552 30.8156 19.3445 30.9071L13.0145 33.7974L10.123 28.5601C10.0194 28.3807 9.96472 28.1764 9.96472 27.9683C9.96472 27.7601 10.0194 27.5558 10.123 27.3764L17.2671 14.4756L19.7961 30.1897ZM4.17107 37.8374C3.46155 38.161 2.68975 37.869 2.20043 37.4865C1.7111 37.104 1.23735 36.4205 1.3619 35.6397L4.04651 18.9479C4.07657 18.7432 4.15752 18.5496 4.28169 18.3856C4.40586 18.2217 4.56913 18.0927 4.75603 18.0109L16.6933 12.5564L8.87747 26.6657C8.65234 27.0616 8.5338 27.5109 8.5338 27.9683C8.5338 28.4256 8.65234 28.8749 8.87747 29.2708L11.7111 34.3904L4.17107 37.8374ZM28.1679 33.8064L21.8223 30.9071C21.6152 30.815 21.4374 30.6661 21.3085 30.4771C21.3348 30.3826 21.3556 30.2867 21.3708 30.1897L23.9041 14.4213L31.075 27.3696C31.1777 27.5493 31.2318 27.7535 31.2318 27.9615C31.2318 28.1694 31.1777 28.3736 31.075 28.5533L28.1679 33.8064ZM38.9597 37.4865C38.4704 37.869 37.6964 38.1655 36.9869 37.8374L29.4713 34.4039L32.3116 29.2708C32.5367 28.8749 32.6553 28.4256 32.6553 27.9683C32.6553 27.5109 32.5367 27.0616 32.3116 26.6657L24.5069 12.5699L36.4041 18.0018C36.5919 18.0848 36.7558 18.2152 36.88 18.3809C37.0042 18.5465 37.0846 18.7417 37.1137 18.9479L39.7983 35.6442C39.9228 36.4205 39.4468 37.1063 38.9597 37.4865Z" fill="#231F20"/>
                <path d="M22.732 13.2738L20.5789 26.6431L18.4281 13.267C18.3036 12.4862 18.7796 11.8004 19.2667 11.4179C19.3315 11.3673 19.399 11.3204 19.4691 11.2776C19.6152 11.1847 19.7711 11.1087 19.9339 11.0513C20.034 11.0167 20.1367 10.9902 20.2409 10.9721L20.3143 10.9585C20.379 10.9473 20.4444 10.9405 20.51 10.9381H20.6568C20.7231 10.9404 20.7893 10.9472 20.8547 10.9585L20.9304 10.9721C20.9908 10.9852 21.0502 11.0026 21.1083 11.0241C21.1546 11.0385 21.1999 11.0559 21.244 11.0762L21.6888 11.2821C21.7599 11.3244 21.8282 11.3713 21.8934 11.4225C22.3805 11.8072 22.8565 12.493 22.732 13.2738Z" fill="url(#paint1_linear_449_220)"/>
                <path d="M25.3143 6.97285C25.2464 6.97181 25.1796 6.95495 25.119 6.92356C25.0585 6.89218 25.0058 6.8471 24.9651 6.79179C23.7996 5.31838 22.2427 4.50812 20.579 4.50812C18.9153 4.50812 17.3672 5.31838 16.1929 6.79179C16.1533 6.84786 16.1012 6.89355 16.0409 6.92506C15.9805 6.95658 15.9137 6.97301 15.8459 6.97301C15.7781 6.97301 15.7112 6.95658 15.6509 6.92506C15.5905 6.89355 15.5384 6.84786 15.4989 6.79179C15.4048 6.66632 15.3537 6.51284 15.3537 6.35497C15.3537 6.19711 15.4048 6.04362 15.4989 5.91816C16.8557 4.21163 18.6617 3.27237 20.579 3.27237C22.4962 3.27237 24.3023 4.21163 25.6613 5.91816C25.7544 6.04408 25.8047 6.19739 25.8047 6.35497C25.8047 6.51256 25.7544 6.66587 25.6613 6.79179C25.6207 6.8468 25.5684 6.8917 25.5083 6.92307C25.4482 6.95444 25.3818 6.97147 25.3143 6.97285Z" fill="#231F20"/>
                <path d="M23.3548 8.41678C23.2872 8.4154 23.2209 8.39837 23.1608 8.367C23.1006 8.33563 23.0483 8.29073 23.0078 8.23572C21.6733 6.55636 19.4936 6.55636 18.1568 8.23572C18.1171 8.29181 18.0648 8.33748 18.0042 8.36898C17.9437 8.40048 17.8767 8.41691 17.8087 8.41691C17.7408 8.41691 17.6738 8.40048 17.6133 8.36898C17.5527 8.33748 17.5004 8.29181 17.4607 8.23572C17.3677 8.11015 17.3175 7.95723 17.3175 7.80004C17.3175 7.64285 17.3677 7.48992 17.4607 7.36435C19.1822 5.20064 21.9825 5.20064 23.7018 7.36435C23.7957 7.48946 23.8466 7.64256 23.8466 7.80004C23.8466 7.95751 23.7957 8.11061 23.7018 8.23572C23.6612 8.29073 23.6089 8.33563 23.5488 8.367C23.4887 8.39837 23.4223 8.4154 23.3548 8.41678Z" fill="#231F20"/>
                <path d="M27.4051 5.40663C27.3375 5.40524 27.2711 5.38822 27.211 5.35685C27.1509 5.32547 27.0986 5.28058 27.0581 5.22557C23.486 0.737453 17.6742 0.737453 14.1021 5.22557C14.0621 5.28123 14.0097 5.3265 13.9492 5.3577C13.8887 5.38891 13.8218 5.40517 13.754 5.40517C13.6862 5.40517 13.6194 5.38891 13.5589 5.3577C13.4984 5.3265 13.446 5.28123 13.406 5.22557C13.3128 5.09965 13.2625 4.94633 13.2625 4.78875C13.2625 4.63117 13.3128 4.47785 13.406 4.35193C15.3232 1.94153 17.8721 0.615234 20.579 0.615234C23.2858 0.615234 25.837 1.94153 27.7542 4.35193C27.8474 4.47785 27.8977 4.63117 27.8977 4.78875C27.8977 4.94633 27.8474 5.09965 27.7542 5.22557C27.7135 5.28088 27.6608 5.32595 27.6003 5.35734C27.5398 5.38873 27.473 5.40559 27.4051 5.40663Z" fill="#231F20"/>
                <defs>
                    <linearGradient id="paint0_linear_449_220" x1="20.3098" y1="45.6864" x2="20.3098" y2="30.6989" gradientUnits="userSpaceOnUse">
                    <stop offset="0.01" stop-color="#FFF200"/>
                    <stop offset="0.35" stop-color="#FFF001"/>
                    <stop offset="0.5" stop-color="#FEE803"/>
                    <stop offset="0.62" stop-color="#FDDC06"/>
                    <stop offset="0.72" stop-color="#FBC90B"/>
                    <stop offset="0.81" stop-color="#F9B211"/>
                    <stop offset="0.89" stop-color="#F69519"/>
                    <stop offset="0.96" stop-color="#F37322"/>
                    <stop offset="1" stop-color="#F15A29"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_449_220" x1="20.5789" y1="10.9358" x2="20.5789" y2="26.6499" gradientUnits="userSpaceOnUse">
                    <stop offset="0.01" stop-color="#FFF200"/>
                    <stop offset="0.15" stop-color="#FFED01"/>
                    <stop offset="0.32" stop-color="#FDDF05"/>
                    <stop offset="0.49" stop-color="#FBC80B"/>
                    <stop offset="0.67" stop-color="#F8A714"/>
                    <stop offset="0.86" stop-color="#F47D20"/>
                    <stop offset="1" stop-color="#F15A29"/>
                    </linearGradient>
                </defs>
                </svg>
                <h1 className="font-bold mt-2 text-3xl">AliTapTap</h1>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>
            
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />
                </div>
                
                <div className="mb-2">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"           
                />
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div></div>
                    <a href="#" className="text-[#949494] hover:text-[#505050]">
                        Forgot your password?
                    </a>
                </div>
                
                {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
                )}
                
                <button
                type="submit"
                className="w-full h-[50px] font-semibold bg-[#FDCB07] text-white py-2 px-4 rounded-md hover:bg-[#fdcc07d8] focus:outline-none focus:ring-2 focus:ring-[#fdcc07c9] disabled:opacity-50"
                disabled={isLoading}
                >
                {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    </div>
  );
}