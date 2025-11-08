import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BedrockRuntime, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { analyzeMatches } from './dataProcessor';
import { PlayerInsights } from '../../common/dataProcessor';
import { Match } from '../../common/sampleMatchData';
import { analyzeMatches, PlayerInsights, Match } from './dataProcessor';
import { Persona } from '../../personaData';
import { Saga } from '../../sagaData';

const bedrock = new BedrockRuntime();
const s3 = new S3Client({});
const matchDataBucket = process.env.MATCH_DATA_BUCKET;

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
        const { summonerName, persona } = JSON.parse(event.body) as { summonerName: string, persona: Persona };

        const getObjectCommand = new GetObjectCommand({
            Bucket: matchDataBucket,
            Key: 'matches.json',
        });
        const s3Response = await s3.send(getObjectCommand);
        const matchesString = await s3Response.Body?.transformToString();
        const matches: Match[] = matchesString ? JSON.parse(matchesString) : [];

        const insights = analyzeMatches(matches, summonerName);
        const sagaWithoutImages = await generateSagaContent(summonerName, persona, insights);
        const imagePromises = sagaWithoutImages.chapters.map(chapter => generateChapterImage(chapter.imagePrompt));
        const imageUrls = await Promise.all(imagePromises);
        const chaptersWithImages = sagaWithoutImages.chapters.map((chapter, index) => ({ ...chapter, imageUrl: imageUrls[index] }));
        const finalSaga = { ...sagaWithoutImages, chapters: chaptersWithImages };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ saga: finalSaga, insights: insights }),
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

    const body = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: prompt
            }]
        }]
    };
    const modelId = "anthropic.claude-sonnet-4-5-20250929-v1:0";

    const modelId = "anthropic.claude-sonnet-4-5-20250929-v1:0";

    const modelId = "anthropic.claude-sonnet-4-5-20250929-v1:0";

    const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

    const params = {
        body: JSON.stringify(body),
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
    };

    const command = new InvokeModelCommand(params);
    const response = await bedrock.send(command);
    const responseText = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(responseText);
    const sagaContent = JSON.parse(responseBody.content[0].text);
    // The response from Claude 3 is in a different format
    const sagaContent = JSON.parse(responseBody.content[0].text);


    const sagaContent = JSON.parse(responseBody.completion);


    return { ...sagaContent, summonerName };
}

async function generateChapterImage(imagePrompt: string): Promise<string> {
    const modelId = 'stability.stable-diffusion-xl-v0';
    const params = {
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

    const command = new InvokeModelCommand(params);
    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const base64Image = responseBody.artifacts[0].base64;
    return `data:image/png;base64,${base64Image}`;
}
