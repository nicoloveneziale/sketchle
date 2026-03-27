import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaHeart, FaUserAlt, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    // States for temporary storage of this page
    const [drawings, setDrawings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topDrawings, setTopDrawings] = useState([]);

    // Verification token carried across the site
    const { token } = useAuth()

    // This runs every time the page is reloaded/loaded
    useEffect(() => {
        const fetchDrawings = async () => {
            try {
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const [todayRes, topRes] = await Promise.all([api.get("/drawings/today", config), api.get("/drawings/top", config)]); // Gets the drawings and top 10 from the backend

                if (todayRes.data && Array.isArray(todayRes.data.content)) {
                    setDrawings(todayRes.data.content); // Response data from the server contains the data
                }

                if (Array.isArray(topRes.data)) {
                    setTopDrawings(topRes.data);
                }
                
                console.log(todayRes.data)
            } catch (err) {
                setError("Could not load today's gallery.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrawings();
    }, []);



    // This runs every time the like button is pressed
    const handleLike = async (drawingId) => {
        if (!token) return; // If user is not logged in they cannot like
        try {
            setDrawings(prevDrawings => 
                prevDrawings.map(drawing => {
                    if (drawing.id === drawingId) {
                        console.log(drawing);
                        const alreadyLiked = drawing.likedByUser;
                        return {
                            ...drawing,
                            likedByUser: !alreadyLiked,
                            likesCount: alreadyLiked ? drawing.likesCount - 1 : drawing.likesCount + 1 // If user had already liked , it is then unliked
                        };
                    }
                    return drawing;
                })
            );
            await api.post(`/drawings/${drawingId}/like`, {}, { // Asks the backend to like the post
            headers: {
                Authorization: `Bearer ${token}` // Verification token so we can track who liked the post
            }
            });
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    // Loading screen
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

            {/* Leaderboard Section */}
            {topDrawings.length > 0 && (
                <section className="mb-16">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-yellow-100 p-2 rounded-lg">🏆</div>
                        <h2 className="text-2xl font-bold text-gray-800">Today's Top 10</h2>
                    </div>
                    
                    <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                        {topDrawings.map((drawing, index) => (
                            <div key={drawing.id} className="flex-shrink-0 w-40 group">
                                <div className="relative">
                                    {/* Rank Badge */}
                                    <div className="absolute -top-2 -left-2 z-10 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100">
                                        {index + 1}
                                    </div>
                                    
                                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-indigo-500 transition-all">
                                        <img 
                                            src={drawing.drawingUrl} 
                                            alt="Top sketch" 
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-700 truncate text-center">
                                  {drawing.user.username}
                                </p>
                                <div className="flex justify-center items-center text-pink-500 text-xs font-bold">
                                    <FaHeart className="mr-1" size={10} /> {drawing.likesCount}
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="border-gray-200 mt-4" />
                </section>
            )}

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
                                    loading="lazy"
                                    className="object-cover w-full h-full"
                                />
                           
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