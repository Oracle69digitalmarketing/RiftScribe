export interface SagaChapter {
    title: string;
    text: string;
    imagePrompt: string; // The AI-generated prompt for the image
    imageUrl?: string; // The final URL of the generated image
}

export interface Saga {
    title: string;
    summonerName: string;
    chapters: SagaChapter[];
}
