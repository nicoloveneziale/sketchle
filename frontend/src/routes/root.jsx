import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { 
    FaUserPlus, 
    FaSignInAlt, 
    FaSignOutAlt, 
    FaUserCircle 
} from "react-icons/fa";

export default function Root() {
    const { token, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen font-sans text-gray-900 flex flex-col">
            <nav className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-sm shadow-sm">
                {/* Logo  */}
                <Link to="/" className="font-bold text-xl text-indigo-600">
                    Sketchle
                </Link>

                <div className="flex gap-4">
                    {/* If NOT logged in */}
                    {!token ? (
                        <>
                            <Link to="/register" className="flex items-center hover:text-indigo-600 transition-colors">
                                <FaUserPlus className="mr-1" /> Register
                            </Link>
                            <Link to="/login" className="flex items-center hover:text-indigo-600 transition-colors">
                                <FaSignInAlt className="mr-1" /> Log In
                            </Link>
                        </>
                    ) : (
                        /* Logged In */
                        <>
                            <div className="flex items-center text-gray-700 font-medium">
                                <FaUserCircle className="mr-1 text-indigo-500" /> 
                                <span>Logged In</span>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center text-red-600 hover:text-red-800 transition-colors font-medium"
                            >
                                <FaSignOutAlt className="mr-1" /> Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
}