import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Saga } from './sagaData';
import { analyzeMatches } from './dataProcessor';
import { matches } from './sampleMatchData';


interface ShareCardProps {
    saga: Saga;
    onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ saga, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copyButtonText, setCopyButtonText] = useState('Copy Text');
    
    // Re-analyze to get the key insight for the card
    const insights = analyzeMatches(matches, saga.summonerName);
    const mainArtUrl = saga.chapters[0]?.imageUrl || `https://storage.googleapis.com/generativeai-assets/placeholder.jpg?seed=${Math.random()}`;
    const topChampion = insights.mostPlayedChampions[0]?.name || 'an unknown force';

    const handleDownloadImage = useCallback(() => {
        if (cardRef.current === null) {
            return;
        }

        toPng(cardRef.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `riftsrcibe-saga-${saga.summonerName}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Failed to generate image', err);
            });
    }, [cardRef, saga.summonerName]);

    const handleShare = (platform: 'twitter' | 'clipboard') => {
        const shareText = `Check out my League of Legends saga, "${saga.title}", as told by RiftScribe! My legend was forged with ${topChampion}.`;

        if (platform === 'twitter') {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(twitterUrl, '_blank');
        } else if (platform === 'clipboard') {
            navigator.clipboard.writeText(shareText).then(() => {
                setCopyButtonText('Copied!');
                setTimeout(() => setCopyButtonText('Copy Text'), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border border-amber-400/20 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg p-6 sm:p-8 m-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 className="font-display text-2xl text-amber-300 mb-6 text-center">Share Your Legend</h3>

                {/* The visual card to be shared */}
                <div id="legend-card" ref={cardRef} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <img src={mainArtUrl} alt="Saga Artwork" className="w-full h-64 object-cover" />
                    <div className="p-6">
                        <h4 className="font-display text-2xl text-amber-300 truncate">{saga.title}</h4>
                        <p className="text-slate-400 text-lg">The Saga of {saga.summonerName}</p>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <p className="text-sm text-slate-500 uppercase tracking-wider">Key Highlight</p>
                            <p className="text-slate-200 text-lg font-semibold">Most Played: {topChampion}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 px-6 py-2 text-right">
                         <p className="font-display text-amber-400 text-sm">Forged by RiftScribe</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                     <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={handleDownloadImage}
                            className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-md hover:bg-amber-400 transition-colors"
                        >
                            Download Card
                        </button>
                        <button
                            onClick={() => handleShare('twitter')}
                            className="bg-sky-500 text-white font-bold py-2 px-6 rounded-md hover:bg-sky-400 transition-colors"
                        >
                            Share on X
                        </button>
                        <button
                            onClick={() => handleShare('clipboard')}
                            className="bg-slate-600 text-slate-100 font-bold py-2 px-6 rounded-md hover:bg-slate-500 transition-colors w-32"
                        >
                            {copyButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareCard;
