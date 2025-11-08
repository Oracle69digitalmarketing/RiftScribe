import React, { useState } from 'react';
import { Saga } from './sagaData';
// CORRECTED PATH: Pointing to the file inside aws/lambda/
import { PlayerInsights } from './common/dataProcessor';
import ShareCard from './ShareCard';

interface SagaViewProps { saga: Saga; insights: PlayerInsights; onReset: () => void; }

const SagaView: React.FC<SagaViewProps> = ({ saga, insights, onReset }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    return (
        <>
            <div className="animate-fade-in space-y-12">
                <header className="text-center">
                    <h2 className="font-display text-4xl md:text-5xl text-amber-300 tracking-wider">{saga.title}</h2>
                    <p className="text-slate-400 mt-2 text-xl">The Saga of {saga.summonerName}</p>
                </header>
                <div className="space-y-16">
                    {saga.chapters.map((chapter, index) => (
                        <article key={index} className="flex flex-col md:flex-row gap-8 items-center even:md:flex-row-reverse">
                            <div className="md:w-1/2">
                                {chapter.imageUrl ? ( <img src={chapter.imageUrl} alt={`Illustration for ${chapter.title}`} className="rounded-lg shadow-lg shadow-black/30 w-full object-cover aspect-square" /> ) : ( <div className="rounded-lg shadow-lg shadow-black/30 w-full aspect-square bg-slate-800 flex items-center justify-center"> <p className="text-slate-500">Image not available</p> </div> )}
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="font-display text-3xl text-amber-400 mb-4">{`Chapter ${index + 1}: ${chapter.title}`}</h3>
                                <p className="text-slate-300 leading-relaxed">{chapter.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <footer className="text-center mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button onClick={() => setIsShareModalOpen(true)} className="font-display text-xl bg-amber-500 text-slate-900 font-bold py-3 px-10 rounded-md hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40" > Share Your Legend </button>
                    <button onClick={onReset} className="font-display text-xl bg-slate-700 text-amber-300 font-bold py-3 px-10 rounded-md hover:bg-slate-600 transition-all duration-300" > Forge Another </button>
                </footer>
            </div>
            {isShareModalOpen && <ShareCard saga={saga} insights={insights} onClose={() => setIsShareModalOpen(false)} />}
        </>
    );
};
export default SagaView;
