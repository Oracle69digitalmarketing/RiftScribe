import React from 'react';
import { personas, Persona } from './personaData';

interface PersonaSelectorProps {
    selectedPersona: Persona | null;
    onPersonaSelect: (persona: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onPersonaSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personas.map(persona => (
                <div
                    key={persona.name}
                    onClick={() => onPersonaSelect(persona)}
                    className={`
                        border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 
                        ${selectedPersona?.name === persona.name 
                            ? 'border-amber-400 bg-slate-700/50 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
                            : 'border-slate-600 bg-slate-800/50 hover:border-slate-400 hover:bg-slate-700/50'
                        }
                    `}
                >
                    <h3 className="font-display text-2xl text-amber-300 text-center mb-2">{persona.name}</h3>
                    <p className="text-slate-400 text-center text-sm">{persona.description}</p>
                </div>
            ))}
        </div>
    );
};

export default PersonaSelector;
