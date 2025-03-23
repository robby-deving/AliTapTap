import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Chats from './pages/Chats';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Login from './pages/Login';
import Topbar from './components/Topbar';

function Layout() {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login"; // Check if on login page

    return (
        <div className="flex flex-row h-screen">
            {/* Hide Sidebar and Topbar on Login Page */}
            {!isLoginPage && <Sidebar />}
            <div className="flex-grow">
                {!isLoginPage && <Topbar />}
                <div>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/chats" element={<Chats />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;