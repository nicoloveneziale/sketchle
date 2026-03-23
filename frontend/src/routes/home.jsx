import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaHeart, FaUserAlt, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const [drawings, setDrawings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth()

    useEffect(() => {
        const fetchDrawings = async () => {
            try {
                const response = await api.get("/drawings/today"); 
                
                if (typeof response.data === "string") {
                    setDrawings([]);
                } else {
                    setDrawings(response.data);
                }
                console.log(response.data)
            } catch (err) {
                setError("Could not load today's gallery.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrawings();
    }, []);

    const handleLike = async (drawingId) => {
        if (!token) return; 
        try {
            await api.post(`/drawings/${drawingId}/like`, {}, { 
            headers: {
                Authorization: `Bearer ${token}` 
            }
            });
            
            setDrawings(prevDrawings => 
                prevDrawings.map(drawing => {
                    if (drawing.id === drawingId) {
                        const alreadyLiked = drawing.likedByUser;
                        return {
                            ...drawing,
                            likedByUser: !alreadyLiked,
                            likesCount: alreadyLiked ? drawing.likesCount - 1 : drawing.likesCount + 1
                        };
                    }
                    return drawing;
                })
            );
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64 text-indigo-600 font-medium">
            <div className="animate-pulse">Loading Today's Masterpieces...</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Today's Gallery
                </h1>
                <p className="text-gray-500 mt-2 italic">Fresh sketches from the community</p>
            </header>

            {error && <p className="text-red-500 text-center bg-red-50 p-4 rounded-lg">{error}</p>}

            {drawings.length === 0 ? (
                <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">No drawings yet. Be the first to submit!</p>
                </div>
            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {drawings.map((drawing) => (
                        <div 
                            key={drawing.id} 
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="aspect-square bg-gray-50 overflow-hidden relative">
                                <img 
                                    src={drawing.drawingUrl} 
                                    alt="Sketch" 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Subtle overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>

                            {/* Footer Information */}
                            <div className="p-5 flex justify-between items-center bg-white mt-auto">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-indigo-50 p-2 rounded-full">
                                        <FaUserAlt size={14} className="text-indigo-500" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">
                                        {drawing.user.username || "Artist"}
                                    </span>
                                </div>

                                <button 
                                    onClick={() => handleLike(drawing.id)}
                                    disabled={!token}
                                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all duration-200 
                                        ${!token ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-pink-50 text-pink-500 hover:bg-pink-100 active:scale-95'}`}
                                    title={!token ? "Log in to like drawings" : ""}
                                >
                                    {drawing.likedByUser ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                                    <span className="font-bold text-sm">{drawing.likesCount || 0}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}