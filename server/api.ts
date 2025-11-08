import { PlayerInsights } from '../common/dataProcessor';
import { Persona } from '../personaData';
import { Saga } from '../sagaData';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export async function generateSaga(summonerName: string, persona: Persona): Promise<{ saga: Saga, insights: PlayerInsights }> {
    
    console.log("Calling LIVE AWS backend at:", API_ENDPOINT);

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summonerName, persona }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Backend Error:", errorBody);
            throw new Error(`Backend service failed with status ${response.status}. See console for details.`);
        }

        const responseBody = await response.json();
        return responseBody;

    } catch (error) {
        console.error("Error calling the live backend:", error);
        throw new Error("Failed to communicate with the RiftScribe backend service. Check the browser console for more details.");
    }
}
