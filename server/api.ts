// FIX: Implement saga generation logic using Gemini API to resolve errors from empty file.
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { PlayerInsights } from '../dataProcessor';
import { Persona } from '../personaData';
import { Saga, SagaChapter } from '../sagaData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// This function generates the story/saga content
async function generateSagaContent(summonerName: string, persona: Persona, insights: PlayerInsights): Promise<Saga> {
    const sagaSchema = {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: 'A grand, epic title for the saga. No quotes.',
            },
            chapters: {
                type: Type.ARRAY,
                description: 'An array of 3-4 chapters detailing the hero\'s journey.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: 'The title of this chapter. No quotes.',
                        },
                        text: {
                            type: Type.STRING,
                            description: 'The story text for this chapter, around 100-150 words. It should be a complete narrative paragraph.',
                        },
                        imagePrompt: {
                            type: Type.STRING,
                            description: 'A detailed, dramatic, and vivid prompt for an AI image generator to create an illustration for this chapter. The prompt should describe a fantasy art scene in the style of League of Legends splash art. Focus on a single, clear subject. Example: "A heroic warrior in golden armor raising a glowing sword to the stormy sky, cinematic lighting, detailed, epic fantasy art."'
                        }
                    },
                    required: ['title', 'text', 'imagePrompt']
                }
            }
        },
        required: ['title', 'chapters']
    };

    const prompt = `
        You are a legendary storyteller, a RiftScribe. Your current persona is: "${persona.name} - ${persona.prompt}".
        
        Your task is to forge an epic saga for the League of Legends summoner: "${summonerName}".
        
        Use the following player insights to inspire the narrative. Weave these facts into the story, but do not simply list them. Make them legendary.
        
        - **Season Summary:** Over ${insights.totalGames} battles, they achieved ${insights.wins} victories to ${insights.losses} defeats, a testament to their resilience with a ${insights.winRate} win rate.
        - **Main Champions:** Their primary weapons of choice were:
            1.  **${insights.mostPlayedChampions[0]?.name || 'an unknown force'}**: ${insights.mostPlayedChampions[0]?.games || 0} games, ${insights.mostPlayedChampions[0]?.winRate || 'N/A'} win rate.
            2.  **${insights.mostPlayedChampions[1]?.name || 'a secondary power'}**: ${insights.mostPlayedChampions[1]?.games || 0} games, ${insights.mostPlayedChampions[1]?.winRate || 'N/A'} win rate.
            3.  **${insights.mostPlayedChampions[2]?.name || 'a tertiary strategy'}**: ${insights.mostPlayedChampions[2]?.games || 0} games, ${insights.mostPlayedChampions[2]?.winRate || 'N/A'} win rate.
        - **Peak Performance:** Their most dominant performance was on ${insights.bestKDA.champion} with a staggering KDA of ${insights.bestKDA.kda}. A moment of pure skill.
        - **Arch-Nemesis:** The champion that proved to be their greatest challenge was ${insights.archNemesis.name}, who they faced in ${insights.archNemesis.losses} of their defeats.
        - **Glorious Streak:** They achieved an unstoppable winning streak of ${insights.longestWinningStreak} games.
        
        Craft a story with a clear beginning, middle, and end across 3-4 chapters. Each chapter should build upon the last.
        
        - The first chapter should introduce the hero and their primary champion(s).
        - The middle chapters should describe their trials against their Arch-Nemesis, their greatest battle (the best KDA game), or their unstoppable streak.
        - The final chapter should be a conclusion, summarizing their legend and impact on the Summoner's Rift.
        
        Adhere strictly to your persona's tone and style. The saga must be epic, engaging, and worthy of a legend.
        Generate the response in JSON format according to the provided schema.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: sagaSchema,
        },
    });
    
    const sagaContent = JSON.parse(response.text);
    return {
        ...sagaContent,
        summonerName,
    };
}

// This function generates an image for a single chapter
async function generateChapterImage(imagePrompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1', // Square aspect ratio to fit the UI
        },
    });
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}

// The main exported function that orchestrates the saga generation
export async function generateSaga(summonerName: string, persona: Persona, insights: PlayerInsights): Promise<Saga> {
    try {
        const sagaWithoutImages = await generateSagaContent(summonerName, persona, insights);

        // Generate images for each chapter in parallel
        const imagePromises = sagaWithoutImages.chapters.map(chapter => 
            generateChapterImage(chapter.imagePrompt)
        );
        const imageUrls = await Promise.all(imagePromises);

        // Add the generated image URLs to the chapters
        const chaptersWithImages: SagaChapter[] = sagaWithoutImages.chapters.map((chapter, index) => ({
            ...chapter,
            imageUrl: imageUrls[index],
        }));
        
        return {
            ...sagaWithoutImages,
            chapters: chaptersWithImages,
        };
    } catch (error) {
        console.error("Error generating saga:", error);
        // Provide a more graceful fallback or re-throw a custom error
        throw new Error("Failed to forge the saga. The cosmic energies are unstable. Please try again.");
    }
}
