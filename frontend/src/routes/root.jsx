import { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Particles, { initParticlesEngine } from "@tsparticles/react"; 
import { loadSlim } from "@tsparticles/slim";
import logoMain from "../assets/logo-main.svg";

export default function Root() {
    const { token, logout, username } = useAuth(); 
    const navigate = useNavigate();
    const [init, setInit] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);

        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="relative h-dvh text-slate-200 flex flex-col overflow-hidden brutal-text">
            <div className="absolute inset-0 galaxy-stars z-0 pointer-events-none" />
            <div className="absolute inset-0 scanlines z-5 opacity-30" />
            {init && (
                <Particles 
                    id="tsparticles"
                    options={{
                        fpsLimit: 120,
                        fullScreen: { enable: false }, 
                        particles: {
                            number: { value: isMobile ? 80 : 300 }, 
                            color: "#ffffff",
                            shape: { type: "circle" },
                            opacity: {
                                value: {min: 0.1, max: 0.8},
                                animation: {
                                    enable: true,
                                    speed: 1,
                                    sync: false
                                }
                            }, 
                            size: { value: { min: 0.5, max: 3 } },
                            move: {
                                enable: true,
                                speed: 2, 
                                direction: "none",
                                random: true,
                                straight: false,
                                outModes: { default: "out" }
                            },
                            links: {
                                enable: true,
                                distance: 150,
                                color: "#6366f1",
                                opacity: 0.1,
                                width: 1
                            }
                        },
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: "grab", 
                                },
                                onClick: {
                                    enable: true,
                                    mode: "push", 
                                },
                            },
                            modes: {
                                grab: {
                                    distance: 130,
                                    links: { opacity: 0.5 }
                                },
                                push: { quantity: isMobile ? 2 : 4 }
                            }
                        },
                        detectRetina: true,
                    }} 
                />
            )}

            <nav className="relative z-20 flex-shrink-0 p-4 flex justify-between items-center glass mx-4 mt-4 rounded-2xl border-b border-white/5">
                <Link to="/" className="brutal-text text-2xl tracking-tighter text-gradient">
                    <img 
                        src={logoMain} 
                        alt="Sketchle Logo" 
                        className="h-13 w-auto invert drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    />
                </Link>

                <div className="flex gap-6 items-center">
                    {!token ? (
                        <>
                            <Link to="/register" className="flex items-center hover:text-indigo-400 transition-colors text-sm font-bold">
                                <FaUserPlus className="mr-2" /> Register
                            </Link>
                            <Link to="/login" className="flex items-center bg-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-500 transition-all text-sm font-bold shadow-lg shadow-indigo-500/20">
                                <FaSignInAlt className="mr-2" /> Log In
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center text-slate-300 font-medium text-sm">
                                <FaUserCircle className="mr-2 text-indigo-500 text-xl" /> 
                                <Link to={`/profile/${username}`}>{username}</Link>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center text-red-400 hover:text-red-300 transition-colors font-bold text-sm"
                            >
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <main className="relative z-10 flex-grow overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}