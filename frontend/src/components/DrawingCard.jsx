import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaUserAlt, FaFlag } from "react-icons/fa";
import ReportModal from "./ReportModal";

export default function DrawingCard({ drawing, token, onLike }) {
    const [showReport, setShowReport] = useState(false);

    return (
        <>
            <div className="glass rounded-[2rem] overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-square bg-slate-900/50 overflow-hidden relative group">
                    <img
                        src={drawing.drawingUrl}
                        alt="Sketch"
                        loading="lazy"
                        className="object-cover w-full h-full pixelated"
                    />
                    {token && (
                        <button
                            onClick={() => setShowReport(true)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-lg text-slate-400 hover:text-red-400"
                        >
                            <FaFlag size={12} />
                        </button>
                    )}
                </div>

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
                        onClick={() => onLike(drawing.id)}
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

            {showReport && (
                <ReportModal
                    drawing={drawing}
                    token={token}
                    onClose={() => setShowReport(false)}
                />
            )}
        </>
    );
}