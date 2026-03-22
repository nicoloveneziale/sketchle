import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"; // Allows for navigation
// Icons
import {
    FaUserPlus
} from "react-icons/fa";

export default function Root() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen font-sans text-gray-900 flex flex-col">
            <nav className="p-4">
                <Link to="/register" className="flex items-center">
                    <FaUserPlus className="mr-1" /> Register
                </Link>
            </nav>
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    )
}