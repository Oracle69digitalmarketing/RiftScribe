import React, { useState, useEffect, useCallback } from 'react';
import { Persona } from './personaData';
import { Saga } from './sagaData';

import { generateSaga } from './server/api'; 

// Import UI components
import PersonaSelector from './PersonaSelector';
import SagaView from './SagaView';
import { lore, LoreCategory } from './loreData';

// App state management
type AppState = 'FORM' | 'LOADING' | 'RESULT';

const App: React.FC = () => {
    const [summonerName, setSummonerName] = useState<string>('PlayerOne');
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [appState, setAppState] = useState<AppState>('FORM');
    const [saga, setSaga] = useState<Saga | null>(null);
    const [insights, setInsights] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (appState === 'LOADING') {
            const loreCategory = (selectedPersona?.name.split(',')[0].toLowerCase() as LoreCategory) || 'generic';
            const messages = lore[loreCategory] || lore.generic;
            let messageIndex = 0;
            setLoadingMessage(messages[messageIndex]);
            intervalId = setInterval(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                setLoadingMessage(messages[messageIndex]);
            }, 2500);
        }
        return () => clearInterval(intervalId);
    }, [appState, selectedPersona]);

    const handleSagaGeneration = useCallback(async () => {
        if (!summonerName || !selectedPersona) { setError('Please enter a summoner name and select a persona.'); return; }
        setError(null);
        setAppState('LOADING');
        try {
            const { saga, insights } = await generateSaga(summonerName, selectedPersona);
            setSaga(saga);
            setInsights(insights);
            setAppState('RESULT');
        } catch (err) {
            console.error("Saga generation failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setAppState('FORM');
        }
    }, [summonerName, selectedPersona]);

    const handleReset = () => {
        setSaga(null);
        setInsights(null);
        setSummonerName('PlayerOne');
        setSelectedPersona(null);
        setError(null);
        setAppState('FORM');
    };
    
    const renderContent = () => {
        switch (appState) {
            case 'LOADING': return ( <div className="text-center animate-fade-in"> <div className="mb-4 text-3xl animate-pulse">🔮</div> <h2 className="font-display text-3xl text-amber-300 mb-2">Forging Your Legend...</h2> <p className="text-slate-400 text-lg">{loadingMessage}</p> </div> );
            case 'RESULT': return saga && insights && <SagaView saga={saga} insights={insights} onReset={handleReset} />;
            case 'FORM': default: return ( <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-12"> <header className="text-center"> <h1 className="font-display text-5xl md:text-6xl text-amber-300 tracking-wider">RiftScribe</h1> <p className="text-slate-400 mt-2 text-xl">Forge Your League of Legends Saga</p> </header> <div className="space-y-4"> <label htmlFor="summonerName" className="block font-display text-xl text-amber-400 mb-2"> Summoner Name </label> <input id="summonerName" type="text" value={summonerName} onChange={(e) => setSummonerName(e.target.value)} placeholder="Enter your Summoner Name" className="w-full bg-slate-800/50 border-2 border-slate-600 rounded-md p-3 text-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all" /> <p className="text-sm text-slate-500">Using sample data for "PlayerOne". Enter any name to customize the story.</p> </div> <div className="space-y-4"> <h2 className="font-display text-xl text-amber-400">Choose Your Storyteller</h2> <PersonaSelector selectedPersona={selectedPersona} onPersonaSelect={setSelectedPersona} /> </div> {error && <p className="text-red-400 text-center bg-red-900/50 border border-red-500 rounded p-3">{error}</p>} <div className="text-center"> <button onClick={handleSagaGeneration} disabled={!summonerName || !selectedPersona} className="font-display text-2xl bg-amber-500 text-slate-900 font-bold py-4 px-12 rounded-md hover:bg-amber-400 transition-all duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 disabled:shadow-none" > Forge My Saga </button> </div> </div> );
        }
    };
    
    return ( <div className="bg-slate-900 text-white min-h-screen font-sans"> <div className="container mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-screen"> {renderContent()} </div> </div> );
};
export default App;
