import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Bedrock } from 'aws-sdk';
import { PlayerInsights } from '../common/dataProcessor';
import { Persona } from '../../personaData';
import { Saga, SagaChapter } from '../../sagaData';

const bedrock = new Bedrock();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("Lambda invoked with event body:", event.body);
    if (!event.body) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Bad request: no body provided" }),
        };
    }

    try {
        const { summonerName, persona, insights } = JSON.parse(event.body) as { summonerName: string, persona: Persona, insights: PlayerInsights };
        const sagaWithoutImages = await generateSagaContent(summonerName, persona, insights);
        const imagePromises = sagaWithoutImages.chapters.map(chapter => generateChapterImage(chapter.imagePrompt));
        const imageUrls = await Promise.all(imagePromises);
        const chaptersWithImages = sagaWithoutImages.chapters.map((chapter, index) => ({ ...chapter, imageUrl: imageUrls[index] }));
        const finalSaga = { ...sagaWithoutImages, chapters: chaptersWithImages };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ saga: finalSaga }),
        };
    } catch (error) {
        console.error("Error in Lambda handler:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message, error: message }),
        };
    }
};

async function generateSagaContent(summonerName: string, persona: Persona, insights: PlayerInsights): Promise<Saga> {
    const prompt = `
        You are a legendary storyteller, a RiftScribe. Your current persona is: "${persona.name} - ${persona.prompt}".
        Your task is to forge an epic saga for the League of Legends summoner: "${summonerName}".
        Use the following player insights to inspire the narrative. Weave these facts into the story, but do not simply list them. Make them legendary.
        
        - Season Summary: Over ${insights.totalGames} battles, they achieved ${insights.wins} victories to ${insights.losses} defeats, a testament to their resilience with a ${insights.winRate} win rate.
        - Main Champions: Their primary weapons of choice were:
            1.  ${insights.mostPlayedChampions[0]?.name || 'an unknown force'}: ${insights.mostPlayedChampions[0]?.games || 0} games, ${insights.mostPlayedChampions[0]?.winRate || 'N/A'} win rate.
            2.  ${insights.mostPlayedChampions[1]?.name || 'a secondary power'}: ${insights.mostPlayedChampions[1]?.games || 0} games, ${insights.mostPlayedChampions[1]?.winRate || 'N/A'} win rate.
            3.  ${insights.mostPlayedChampions[2]?.name || 'a tertiary strategy'}: ${insights.mostPlayedChampions[2]?.games || 0} games, ${insights.mostPlayedChampions[2]?.winRate || 'N/A'} win rate.
        - Peak Performance: Their most dominant performance was on ${insights.bestKDA.champion} with a staggering KDA of ${insights.bestKDA.kda}.
        - Arch-Nemesis: Their greatest challenge was ${insights.archNemesis.name}, who they faced in ${insights.archNemesis.losses} of their defeats.
        - Glorious Streak: They achieved an unstoppable winning streak of ${insights.longestWinningStreak} games.
        
        Craft a story with 3-4 chapters.
        - The first chapter should introduce the hero and their primary champion(s).
        - The middle chapters should describe their trials against their Arch-Nemesis, their greatest battle (the best KDA game), or their unstoppable streak.
        - The final chapter should be a conclusion, summarizing their legend.

        Return a JSON object with two keys: "title" (a grand, epic title for the saga) and "chapters" (an array of objects, where each object has "title", "text", and "imagePrompt" keys). The imagePrompt must be a detailed, dramatic prompt for an AI image generator to create a fantasy art illustration for the chapter.
    `;

    const body = { prompt, max_tokens_to_sample: 4000 };
    const modelId = "anthropic.claude-v2";
    const params: Bedrock.InvokeModelInput = {
        body: JSON.stringify(body),
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
    };

    const response = await bedrock.invokeModel(params).promise();
    const responseText = response.body.toString('utf-8');
    const sagaContent = JSON.parse(responseText);
    return { ...sagaContent, summonerName };
}

async function generateChapterImage(imagePrompt: string): Promise<string> {
    const modelId = 'stability.stable-diffusion-xl-v0';
    const params: Bedrock.InvokeModelInput = {
        body: JSON.stringify({
            text_prompts: [{ text: imagePrompt }],
            cfg_scale: 10,
            seed: 0,
            steps: 50,
        }),
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
    };

    const response = await bedrock.invokeModel(params).promise();
    const responseBody = JSON.parse(response.body.toString('utf-8'));
    const base64Image = responseBody.artifacts[0].base64;
    return `data:image/png;base64,${base64Image}`;
}