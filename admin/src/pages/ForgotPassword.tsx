import { useState, useRef } from "react";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: PIN, Step 3: New Password
  const [pin, setPin] = useState(new Array(5).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call API to send pin code to email
      await axios.post("http://localhost:4000/api/v1/auth/forgot-password", { email });
      setStep(2); // Go to PIN entry step
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Error sending reset instructions. Please try again.");
    }
  };

  // Handle PIN input change
  const handlePinChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace in PIN input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle password reset submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const pinCode = pin.join(""); // Join PIN array into a string
    try {
      // Send the PIN code and new password to the backend for validation and reset
      await axios.post("http://localhost:4000/api/v1/auth/reset-password", {
        email,
        pinCode,
        newPassword: password,
      });

      alert("Your password has been successfully reset!");

      // Redirect to login page after successful reset
      navigate("/login"); // This will navigate to /login
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password. Please try again.");
    }
  };

  return (
<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFE301] to-[rgba(255,255,255,0.12)]">
      <div className="w-full max-w-md rounded-lg bg-white p-12 shadow-lg text-center flex flex-col items-center">
        <svg width="52" height="75" viewBox="0 0 52 75" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g clip-path="url(#clip0_1430_389)">
          <path d="M29.9275 14.8349C29.6535 13.9192 29.0997 13.1155 28.346 12.5398C27.67 12.0026 26.8571 11.6718 26.0025 11.5862H25.8472C24.191 11.6299 22.736 12.4377 22.0257 13.718L21.1631 15.2432L22.0602 14.8349L24.8523 13.5634C25.1005 13.4524 25.369 13.3957 25.6402 13.3972H25.7782C25.8457 13.4005 25.913 13.4082 25.9795 13.4205C26.4459 13.5019 26.8848 13.7004 27.2562 13.9979C27.8486 14.4616 28.4294 15.2898 28.277 16.2318L25.9996 30.3289L26.9054 35.9427L29.9045 17.3341L30.0368 16.5176C30.1272 15.9555 30.0898 15.38 29.9275 14.8349Z" fill="#231F20"/>
             <path d="M50.2573 47.6426C49.4883 48.2566 48.5415 48.5968 47.563 48.6108C47.0401 48.6118 46.5229 48.5015 46.0447 48.2871L36.2681 43.834L34.6291 43.0874L27.1787 39.6958C26.7226 39.4889 26.3193 39.1786 25.9998 38.7889C25.6803 39.1786 25.277 39.4889 24.8209 39.6958L17.359 43.0933L15.72 43.8398L5.95777 48.2871C5.47869 48.5019 4.96045 48.6122 4.43665 48.6108C3.45809 48.5968 2.51127 48.2566 1.74233 47.6426C0.462747 46.6598 -0.187109 45.1259 0.0486795 43.6765L3.3871 22.9712C3.46983 22.431 3.68552 21.9206 4.01421 21.4874C4.34291 21.0541 4.77401 20.7119 5.26766 20.4923L24.1336 11.9098C24.6709 11.6669 25.2571 11.556 25.8445 11.5861C24.1883 11.6299 22.7333 12.4377 22.023 13.7179L21.1604 15.2431L6.0009 22.1634C5.77793 22.2616 5.58317 22.4156 5.43482 22.6109C5.28647 22.8063 5.18939 23.0366 5.15264 23.2803L1.81134 43.9856C1.66182 44.9276 2.23979 45.7587 2.83213 46.2195C3.42448 46.6802 4.36476 47.036 5.22453 46.6452L14.8372 42.2709L16.4762 41.5243L24.0905 38.0569C24.3129 37.9583 24.5071 37.8041 24.6549 37.6088C24.8027 37.4135 24.8994 37.1834 24.9359 36.94L25.094 35.963L25.9998 30.3288L26.9056 35.9426L27.0637 36.9196C27.1005 37.1633 27.1976 37.3936 27.3459 37.5889C27.4943 37.7842 27.689 37.9382 27.912 38.0365L35.5061 41.4951L37.1451 42.2417L46.7751 46.6161C47.6377 47.0069 48.5751 46.654 49.1675 46.1903C49.7598 45.7266 50.3407 44.8984 50.1883 43.9565L46.847 23.2511C46.8066 23.0135 46.7087 22.7898 46.5622 22.6C46.4157 22.4102 46.225 22.2601 46.0073 22.1634L30.7961 15.2314L29.9564 13.7062C29.5759 13.0395 29.0152 12.4971 28.3404 12.1431C27.6671 11.7923 26.9234 11.6028 26.1666 11.5891C26.7586 11.5557 27.35 11.6656 27.8919 11.9098L46.7549 20.5011C47.2489 20.7202 47.6803 21.0623 48.009 21.4956C48.3378 21.929 48.5533 22.4395 48.6355 22.9799L51.9768 43.6852C52.1867 45.1259 51.5368 46.6598 50.2573 47.6426Z" fill="#231F20"/>
             <path d="M40.5755 32.831L30.7989 15.2315L29.9564 13.7063C29.5758 13.0395 29.0151 12.4971 28.3404 12.1432C27.667 11.7924 26.9234 11.6028 26.1665 11.5891C26.1119 11.5862 26.0572 11.5862 26.0026 11.5891H25.8588C24.2026 11.6328 22.7476 12.4406 22.0373 13.7209L21.1747 15.2461L11.3981 32.8339C11.1169 33.3262 10.9688 33.885 10.9688 34.4539C10.9688 35.0228 11.1169 35.5816 11.3981 36.0739L14.8314 42.2563L16.4704 41.5098L12.9566 35.1815C12.8275 34.9609 12.7594 34.709 12.7594 34.4525C12.7594 34.1959 12.8275 33.9441 12.9566 33.7234L22.0833 17.3049L23.5786 14.6103C23.9668 13.9075 24.8035 13.4438 25.7869 13.403H25.9767H26.1751C27.1585 13.4584 27.9896 13.9104 28.3806 14.6103L29.9046 17.3341L39.0112 33.7234C39.1397 33.9443 39.2075 34.196 39.2075 34.4525C39.2075 34.7089 39.1397 34.9607 39.0112 35.1815L35.506 41.4981L37.145 42.2447L40.5755 36.071C40.8567 35.5787 41.0048 35.0199 41.0048 34.451C41.0048 33.8821 40.8567 33.3233 40.5755 32.831Z" fill="#231F20"/>
             <rect x="2.64502" y="29.7981" width="46.5826" height="45.2018" fill="url(#pattern0_1430_389)"/>
             <path d="M36.2626 43.8342L29.9567 55.1842C29.2234 56.5023 27.7052 57.3218 25.9885 57.3218C24.2719 57.3218 22.7536 56.5023 22.0232 55.1842L15.7202 43.84L17.3592 43.0934L24.8211 39.696C25.2772 39.489 25.6805 39.1788 26 38.7891C26.3195 39.1788 26.7228 39.489 27.179 39.696L34.6236 43.0876L36.2626 43.8342Z" fill="url(#paint0_linear_1430_389)"/>
             <path d="M29.9563 13.7063C29.5758 13.0395 29.015 12.4971 28.3403 12.1432C27.667 11.7924 26.9233 11.6029 26.1664 11.5891H26.0169C25.1556 11.6701 24.3352 12.0001 23.6533 12.5398C22.9016 13.1125 22.3479 13.9118 22.0718 14.8232C21.9075 15.3679 21.8682 15.9434 21.9568 16.5059L22.0833 17.2933L25.0939 35.9339L25.9997 30.3289L23.7223 16.223C23.5785 15.2811 24.1536 14.4529 24.7431 13.9979C25.1081 13.7014 25.5398 13.501 25.9997 13.4147C26.0629 13.4147 26.1233 13.3972 26.1866 13.3914C26.5092 13.3646 26.8333 13.4197 27.1297 13.5517L29.9218 14.8232L30.7844 15.2198L29.9563 13.7063Z" fill="#231F20"/>
             <path d="M28.2773 16.2231L25.9999 30.329L23.7225 16.2231C23.5787 15.2812 24.1538 14.453 24.7433 13.998C25.1083 13.7015 25.54 13.5011 25.9999 13.4148C26.4598 13.5011 26.8915 13.7015 27.2565 13.998C27.8488 14.453 28.4297 15.2812 28.2773 16.2231Z" fill="url(#paint1_linear_1430_389)"/>
             <path d="M32.1186 8.19165C32.0312 8.18986 31.9455 8.16792 31.8677 8.1275C31.79 8.08708 31.7224 8.02923 31.67 7.95835C30.1546 6.05987 28.1389 5.01585 25.9996 5.01585C23.8602 5.01585 21.8531 6.05987 20.3291 7.95835C20.2777 8.03061 20.2101 8.08946 20.1319 8.13005C20.0536 8.17064 19.967 8.1918 19.8791 8.1918C19.7913 8.1918 19.7046 8.17064 19.6264 8.13005C19.5482 8.08946 19.4805 8.03061 19.4291 7.95835C19.3087 7.7961 19.2437 7.59856 19.2437 7.39551C19.2437 7.19246 19.3087 6.99492 19.4291 6.83267C21.186 4.63383 23.518 3.42358 25.9996 3.42358C28.4811 3.42358 30.8131 4.63383 32.5671 6.83267C32.6889 6.99434 32.7548 7.1921 32.7548 7.39551C32.7548 7.59892 32.6889 7.79668 32.5671 7.95835C32.5148 8.02923 32.4471 8.08708 32.3694 8.1275C32.2917 8.16792 32.2059 8.18986 32.1186 8.19165Z" fill="#231F20"/>
             <path d="M29.5854 10.0522C29.4976 10.0509 29.4112 10.0292 29.333 9.98872C29.2547 9.94828 29.1866 9.89019 29.1339 9.81893C27.4086 7.65507 24.5936 7.65507 22.8625 9.81893C22.8114 9.89118 22.7441 9.95004 22.6661 9.99065C22.5881 10.0313 22.5016 10.0524 22.414 10.0524C22.3263 10.0524 22.2399 10.0313 22.1619 9.99065C22.0838 9.95004 22.0165 9.89118 21.9654 9.81893C21.8452 9.65713 21.7803 9.46009 21.7803 9.25755C21.7803 9.05501 21.8452 8.85797 21.9654 8.69617C24.1881 5.90824 27.8083 5.90824 30.034 8.69617C30.1541 8.85797 30.2191 9.05501 30.2191 9.25755C30.2191 9.46009 30.1541 9.65713 30.034 9.81893C29.9816 9.88981 29.9139 9.94766 29.8362 9.98808C29.7585 10.0285 29.6727 10.0504 29.5854 10.0522Z" fill="#231F20"/>
             <path d="M34.8244 6.17369C34.7371 6.17191 34.6513 6.14997 34.5736 6.10955C34.4959 6.06912 34.4283 6.01127 34.3759 5.94039C29.7579 0.157478 22.2414 0.157478 17.6234 5.94039C17.5719 6.01209 17.5044 6.07043 17.4265 6.11065C17.3485 6.15087 17.2623 6.17184 17.1748 6.17184C17.0874 6.17184 17.0011 6.15087 16.9232 6.11065C16.8452 6.07043 16.7777 6.01209 16.7262 5.94039C16.6045 5.77873 16.5386 5.58096 16.5386 5.37756C16.5386 5.17415 16.6045 4.97638 16.7262 4.81472C19.2049 1.70892 22.4973 0 25.9996 0C29.502 0 32.7944 1.70892 35.273 4.81472C35.3947 4.97638 35.4607 5.17415 35.4607 5.37756C35.4607 5.58096 35.3947 5.77873 35.273 5.94039C35.2206 6.01127 35.153 6.06912 35.0753 6.10955C34.9976 6.14997 34.9118 6.17191 34.8244 6.17369Z" fill="#231F20"/>
          </g>
          <defs>
            
          <pattern id="pattern0_1430_389" patternContentUnits="objectBoundingBox" width="1" height="1">
             <use xlink:href="#image0_1430_389" transform="scale(0.00617284 0.00645161)"/>
             </pattern>
             <linearGradient id="paint0_linear_1430_389" x1="25.9914" y1="57.3218" x2="25.9914" y2="38.7891" gradientUnits="userSpaceOnUse">
             <stop offset="0.01" stop-color="#FFE000"/>
             <stop offset="0.3" stop-color="#FFDE01"/>
             <stop offset="0.47" stop-color="#FED503"/>
             <stop offset="0.6" stop-color="#FCC807"/>
             <stop offset="0.72" stop-color="#FAB40D"/>
             <stop offset="0.82" stop-color="#F89A15"/>
             <stop offset="0.92" stop-color="#F57C1F"/>
             <stop offset="1" stop-color="#F15A29"/>
             </linearGradient>
             <linearGradient id="paint1_linear_1430_389" x1="25.9999" y1="13.4265" x2="25.9999" y2="30.3319" gradientUnits="userSpaceOnUse">
             <stop offset="0.01" stop-color="#FFE300"/>
             <stop offset="0.3" stop-color="#FFE101"/>
             <stop offset="0.47" stop-color="#FED803"/>
             <stop offset="0.6" stop-color="#FDCB07"/>
             <stop offset="0.71" stop-color="#FBB70D"/>
             <stop offset="0.82" stop-color="#F89D15"/>
             <stop offset="0.91" stop-color="#F57F1E"/>
             <stop offset="1" stop-color="#F15A29"/>
             </linearGradient>
             <clipPath id="clip0_1430_389">
             <rect width="52" height="75" fill="white"/>
             </clipPath>
             <image id="image0_1430_389" width="162" height="155" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
          </defs>
        </svg>

        {step === 1 && (
          // Step 1: Email input form
          <>
            <h2 className="text-xl font-semibold">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mb-6">No worries, we'll send you reset instructions.</p>
            <form onSubmit={handleEmailSubmit} className="w-[300px]">
              <div className="mb-4 flex flex-col items-start">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#FDCB07] py-2 text-white font-medium hover:bg-yellow-600"
              >
                Reset Password
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          // Step 2: PIN entry form
          <>
            <h2 className="text-xl font-semibold">Enter Pin Code</h2>
            <p className="text-gray-500 text-sm mb-6">
              We sent a code to <span className="font-semibold">{email || "your email"}</span>
            </p>
            <div className="flex justify-center space-x-2">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="mt-6 w-full rounded-md bg-[#FDCB07] py-2 text-white font-medium hover:bg-yellow-600 disabled:bg-gray-300"
              disabled={pin.some((digit) => digit === "")}
            >
              Continue
            </button>
          </>
        )}

        {step === 3 && (
          // Step 3: Set New Password
          <>
            <h2 className="text-xl font-semibold">Set New Password</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your new password below.</p>
            <form onSubmit={handlePasswordSubmit} className="w-[300px]">
              <div className="mb-4 flex flex-col items-start">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 flex flex-col items-start">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#FDCB07] py-2 text-white font-medium hover:bg-yellow-600"
              >
                Save Password
              </button>
            </form>
          </>
        )}

        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-gray-600 hover:underline flex items-center justify-center">
            <span className="mr-1">&#8592;</span> Back to Log In
          </a>
        </div>
      </div>
    </div>
  );
}
