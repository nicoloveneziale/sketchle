import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaHeart, FaUserAlt, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
    const [drawings, setDrawings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topDrawings, setTopDrawings] = useState([]);
    const [theme, setTheme] = useState("");
    const [submission, setSubmission] = useState(null)
    const { token } = useAuth();

    useEffect(() => {
        const fetchDrawings = async () => {
            try {
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const [todayRes, topRes, themeRes, submissionRes] = await Promise.all([
                    api.get("/drawings/today", config), 
                    api.get("/drawings/top", config), 
                    api.get("/theme/daily"),
                    api.get("/drawings/submission", config).catch(() => ({ data: null }))
                ]);

                if (themeRes.data) {
                    setTheme(themeRes.data.word);
                }

                console.log(submissionRes)

                if (submissionRes && submissionRes.data) {
                    setSubmission(submissionRes.data);
                } else {
                    setSubmission(null)
                }

                if (todayRes.data && Array.isArray(todayRes.data.content)) {
                    setDrawings(todayRes.data.content);
                }

                if (Array.isArray(topRes.data)) {
                    setTopDrawings(topRes.data);
                }
            } catch (err) {
                setError("Could not load today's gallery.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrawings();
    }, [token]);

    const handleLike = async (drawingId) => {
        if (!token) return;
        try {
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
            await api.post(`/drawings/${drawingId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64 text-indigo-600 font-medium">
            <div className="animate-pulse brutal-text tracking-widest">LOADING GALLERY...</div>
        </div>
    );

    return (
        <div className="max-w-full mx-auto px-4 py-10 brutal-text">
            {/* Header  */}
            <header className="mb-10 text-center glass border-b border-white/5 rounded-2xl shadow-xl w-full p-6">
                <h1 className="text-3xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                    Today's Theme 
                </h1>
                <h1 className="text-7xl font-extrabold text-white mt-2 uppercase tracking-tighter sm:text-4xl">
                    {theme}
                </h1>
                <p className="text-gray-400 mt-2 italic">Fresh sketches from the community</p>
            </header>

            {error && <p className="text-red-500 text-center glass border-red-500/20 p-4 rounded-lg">{error}</p>}

            {/* Users Submission */}
            { token ?
            <section className="mb-16 ">
                <div className="flex items-center space-x-3 mb-8 glass rounded-2xl p-4 border border-white/10">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Your Submission</h2>
                </div>
                <div className="flex justify-center">
                <div className="aspect-square w-150 rounded-2xl overflow-hidden border-2 border-white/10 glass transition-colors group-hover:border-indigo-500 flex justify-center items-center">
                    { submission ?
                     <img 
                        src={submission.drawingUrl} 
                        alt="Your Submission" 
                        className="object-cover w-full h-full pixelated"
                     />             
                     :
                     <h1>Add Submission +</h1>
                    }    
                </div>
                </div>
            </section>
            : <></>}

            {/* Leaderboard Section */}
            {topDrawings.length > 0 && (
                <section className="mb-16">
                    <div className="flex items-center space-x-3 mb-8 glass rounded-2xl p-4 border border-white/10">
                        <div className="bg-yellow-500/20 p-2 rounded-lg text-xl">🏆</div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Today's Top 10</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-8 lg:justify-start">
                        {topDrawings.map((drawing, index) => (
                            <div key={drawing.id} className="w-40 group">
                                <div className="relative">
                                    <div className="absolute -top-2 -left-2 z-10 bg-indigo-600 text-white shadow-xl rounded-full w-8 h-8 flex items-center justify-center font-black border-2 border-[#020617] text-sm">
                                        {index + 1}
                                    </div>
                                    
                                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 glass transition-colors group-hover:border-indigo-500">
                                        <img 
                                            src={drawing.drawingUrl} 
                                            alt="Top sketch" 
                                            className="object-cover w-full h-full pixelated"
                                        />
                                    </div>
                                </div>
                                <p className={`mt-3 text-xs font-black uppercase tracking-widest truncate text-center ${
                                    index === 0 ? "text-yellow-400" :
                                    index === 1 ? "text-slate-300" :
                                    index === 2 ? "text-amber-600" :
                                    "text-white"
                                } `}>
                                    <Link to={`/profile/${drawing.user.username}`}>
                                        {drawing.user.username}
                                    </Link>
                                </p>
                                <div className="flex justify-center items-center text-pink-500 text-xs font-black mt-1">
                                    <FaHeart className="mr-1" size={10} /> {drawing.likesCount}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12" />
                </section>
            )}

            <div className="flex items-center space-x-3 mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white px-2">Recent Submissions</h2>
            </div>

            {drawings.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border-2 border-dashed border-white/10">
                    <p className="text-gray-500 text-lg uppercase tracking-widest">No data found. Be the first to submit.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {drawings.map((drawing, index) => (
                        <motion.div 
                            key={drawing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }} 
                            className="flex flex-col h-full"
                        >
                            <div className="glass rounded-[2rem] overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full">
                                {/* Image Container  */}
                                <div className="aspect-square bg-slate-900/50 overflow-hidden relative">
                                    <img 
                                        src={drawing.drawingUrl} 
                                        alt="Sketch" 
                                        loading="lazy"
                                        className="object-cover w-full h-full pixelated"
                                    />
                                </div>

                                {/* Footer Information */}
                                <div className="p-6 flex justify-between items-center bg-white/5 border-t border-white/5 mt-auto">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-500/20 p-2.5 rounded-xl">
                                            <FaUserAlt size={12} className="text-indigo-400" />
                                        </div>
                                        <Link to={`/profile/${drawing.user.username}`}>
                                            <span className="text-sm font-black uppercase tracking-tight text-slate-200">
                                                {drawing.user.username || "Artist"}
                                            </span>
                                        </Link>
                                    </div>

                                    <button 
                                        onClick={() => handleLike(drawing.id)}
                                        disabled={!token}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-black
                                            ${!token 
                                                ? 'opacity-20 cursor-not-allowed bg-slate-800 text-slate-500' 
                                                : drawing.likedByUser 
                                                    ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]' 
                                                    : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                                    >
                                        {drawing.likedByUser ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
                                        <span className="text-sm">{drawing.likesCount || 0}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}