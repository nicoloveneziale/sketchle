import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function LeaderBoard({topDrawings}) {
    return (
        topDrawings.length > 0 && (
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
            )
    )
}