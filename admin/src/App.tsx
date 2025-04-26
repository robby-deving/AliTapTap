import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Chats from './pages/Chats';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Login from './pages/Login';
import Topbar from './components/Topbar';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import {  useAuth } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';

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
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/chats" element={<Chats />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/edit-profile" element={<EditProfile />} />

                                </Routes>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route path="*" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Routes>
                )}
            </Router>
    );
}

export default App;