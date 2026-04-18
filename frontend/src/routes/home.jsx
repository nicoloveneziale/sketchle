import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import DrawingCard from "../components/DrawingCard";
import LeaderBoard from "../components/LeaderBoard";
import UserSubmission from "../components/UserSubmission";

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
                    setTheme(themeRes.data);
                }

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
                <h1 className="text-l md:text-3xl  font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                    Today's Theme 
                </h1>
                <h1 className="text-2xl md:text-7xl font-extrabold text-white mt-2 uppercase tracking-tighter">
                    {theme}
                </h1>
                <p className="text-gray-400 text-sm md:text-3xl mt-2 italic">Fresh sketches from the community</p>
            </header>

            {error && <p className="text-red-500 text-center glass border-red-500/20 p-4 rounded-lg">{error}</p>}

            { token ?
            <UserSubmission submission={submission}/>
            : <></>}

            <LeaderBoard topDrawings={topDrawings}/>

            <div className="flex items-center space-x-3 mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white px-2">Recent Submissions</h2>
            </div>

            {drawings.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border-2 border-dashed border-white/10">
                    <p className="text-gray-500 text-lg uppercase tracking-widest">No data found. Be the first to submit.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10">
                    {drawings.map((drawing, index) => (
                        <motion.div 
                            key={drawing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }} 
                            className="flex flex-col h-full"
                        >
                         <DrawingCard drawing={drawing} token={token} onLike={handleLike}/>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}