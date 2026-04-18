import { useState } from "react";
import api from "../api/axios";

export default function ReportModal({ drawing, token, onClose }) {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post("/reports", {
                drawingId: String(drawing.id),
                message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Failed to submit report:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                {submitted ? (
                    <div className="text-center py-4">
                        <p className="text-green-400 font-black uppercase tracking-widest text-lg">Report Submitted</p>
                        <p className="text-slate-400 text-sm mt-2">Thanks for keeping the community safe.</p>
                        <button onClick={onClose} className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl transition-all">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-black uppercase tracking-widest text-white mb-1">Report Drawing</h2>
                        <p className="text-slate-400 text-xs mb-4">By {drawing.user.username}</p>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                            rows={4}
                            placeholder="Describe why you're reporting this drawing..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-2 rounded-xl transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !message.trim()}
                                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all"
                            >
                                {isSubmitting ? "Submitting..." : "Report"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}