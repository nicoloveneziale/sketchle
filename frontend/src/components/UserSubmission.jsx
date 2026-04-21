export default function UserSubmission({ submission }) {
    return (
        <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8 glass rounded-2xl p-4 border border-white/10">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Your Submission</h2>
            </div>
            <div className="flex justify-center">
                <div className="aspect-square w-150 rounded-2xl overflow-hidden border-2 border-white/10 glass transition-colors group-hover:border-indigo-500 flex justify-center items-center">
                    {submission ? (
                        <img
                            src={submission.drawingUrl}
                            alt="Your Submission"
                            className="object-cover w-full h-full pixelated"
                        />
                    ) : (
                        <a
                            href="https://github.com/HarryR-UK/Sketchle-Desktop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            <span className="text-4xl">+</span>
                            <span className="text-sm font-semibold uppercase tracking-widest">Download to Submit</span>
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}