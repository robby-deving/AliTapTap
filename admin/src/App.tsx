import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Chats from './pages/Chats';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import {  useAuth } from './context/AuthContext';

function App() {
    const { isAuthenticated } = useAuth();

    return (
            <Router>
                {isAuthenticated ? (
                    <div className="flex flex-row h-screen overflow-hidden">
                        <Sidebar />
                        <div className="flex-grow flex flex-col">
                            <Topbar />
                            <div className="flex-grow overflow-auto h-full">
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/chats" element={<Chats />} />                                </Routes>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Login />
                )}
            </Router>
    );
}

export default App;
