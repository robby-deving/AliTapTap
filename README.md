# **AliTapTap: An E-Commerce Mobile Application for NFC Business Cards**

AliTapTap is a user-friendly e-commerce mobile application that enables users to customize and purchase NFC business cards for personal and professional use. The platform simplifies customization, order tracking, and payment processing.

---

## **General Objective**
**To develop a user-friendly e-commerce mobile application for NFC cards that enables simple customization of card designs for both personal and professional use.**

## **Specific Objectives**
1️⃣ **To design and implement a simple, user-friendly interface for users to customize the design and select variants of NFC cards.**  
2️⃣ **To integrate an efficient payment system for smooth order processing.**  
3️⃣ **To provide a platform for users to easily purchase NFC cards, track their order status, and communicate with the seller.**  

---

## **Installation and Usage Instructions**

### **1️⃣ Clone the Repository**
Clone the project from your GitHub repository:

```bash
git clone https://github.com/robby-deving/AliTapTap.git
cd AliTapTap
cd client
```

### **2️⃣ Set Up Your Environment**

Install the necessary dependencies:

```bash
npm install
npm install socket.io-client
npm install axios
npx expo install expo-router
npx expo install @react-native-async-storage/async-storage
npm install react-native-svg
npm install --save-dev react-native-svg-transformer
npm install react-native-image-picker
```

### **3️⃣ Find Your Local IP Address (Required for Chat Development)**

#### **Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

#### **Windows (Command Prompt):**
```bash
ipconfig | findstr /i "IPv4 Address"
```

Once you have your local IP address, update the `index.tsx` and `chat.tsx` file from the `client/app` folder:

```tsx
useEffect(() => {
    const newSocket = io("http://YOUR_LOCAL_IP:4000");
    setSocket(newSocket);
});
```

Replace `YOUR_LOCAL_IP` with the actual IP address from the command output.

### **4️⃣ Start the Development Environment**
Start the development environment using Expo:

```bash
npx expo start
```

Scan the QR code using your mobile device to run the application.

---

## **Backend Setup: Connecting to Database**

### **1️⃣ Navigate to the Server Folder**
```bash
cd server
```

### **2️⃣ Update `package.json` Scripts**
Add the following to the `package.json` file inside the `server` directory:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### **3️⃣ Install Dependencies**
```bash
npm install express mongoose dotenv nodemon
npm install body-parser  
npm install bcrypt      
npm install jsonwebtoken 
npm install express@4 socket.io
npm install moment
```

### **4️⃣ Create a `.env` File**
Inside the `server` directory, create a `.env` file and add:

```ini
DB_URL=mongodb+srv://admin2:newpassword@alitaptap.uu5j7.mongodb.net/AliTapTapdb 
PORT = 4000
JWT_KEY=crashout
```

### **5️⃣ Start the Server**
Run the following command in the terminal to start the backend server:

```bash
npm run dev
```

The database must be connected successfully for the application to function properly.

---

## **Admin Panel Setup**

### **1️⃣ Navigate to the Admin Folder**
```bash
cd admin
```

### **2️⃣ Install Dependencies**
```bash
npm install
npm install socket.io-client
```

### **3️⃣ Start the Admin Panel**
```bash
npm run dev
```

---

## **Features**
✔ **Customizable NFC business cards** 🖌️  
✔ **Seamless order processing** 📦  
✔ **Real-time order tracking** 📍  
✔ **Secure payment integration** 💳  
✔ **User-friendly design** 📱  
✔ **Seller communication** ✉️  

---

## **Contributing**
Contributions are only for the members of the project! Thank you for understanding!
