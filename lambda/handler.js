import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bedrockClient = new BedrockRuntimeClient();
const s3Client = new S3Client();

const BUCKET_NAME = process.env.GENERATED_IMAGES_BUCKET;

async function generateAndUploadImage(prompt, summonerName) {
    const imageParams = {
        modelId: "stability.stable-diffusion-xl-v0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            text_prompts: [{ text: prompt }],
            cfg_scale: 10,
            steps: 50,
            seed: 0,
        }),
    };

    const command = new InvokeModelCommand(imageParams);
    const apiResponse = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(apiResponse.body));

    const image = responseBody.artifacts[0].base64;
    const imageBuffer = Buffer.from(image, "base64");

    const imageKey = `${summonerName}-${Date.now()}.png`;

    const putObjectParams = {
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(putObjectParams));

    return `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
}

exports.handler = async (event) => {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));

    const { summonerName, persona, insights } = JSON.parse(event.body);

    console.log(`Generating saga for ${summonerName} with persona ${persona.name}`);

    const prompt = `
Human: You are a master storyteller, and your current persona is ${persona.name}, ${persona.description}.

Write a single, epic chapter of a League of Legends saga about a summoner named ${summonerName}.

Here are some insights about their recent performance:
- Most Played Champion: ${insights.mostPlayedChampion}
- Highest Win Rate Champion: ${insights.highestWinRateChampion}
- Total Kills: ${insights.totalKills}
- Total Deaths: ${insights.totalDeaths}
- Total Assists: ${insights.totalAssists}

Weave these insights into a compelling narrative. The chapter should have a title and a story that is at least 200 words long. The tone of the story should match the persona of ${persona.name}.

At the end of the chapter, create a prompt for an AI image generation model that captures the essence of the chapter. The image prompt should be a single sentence.

Format the output as a JSON object with the following structure:
{
  "title": "<chapter title>",
  "text": "<chapter text>",
  "imagePrompt": "<image prompt>"
}

Assistant:`

    const params = {
        modelId: "anthropic.claude-v2",
        contentType: "application/json",
        accept: "*/*",
        body: JSON.stringify({
            prompt: prompt,
            max_tokens_to_sample: 1024,
            temperature: 0.8,
        }),
    };

    try {
        const command = new InvokeModelCommand(params);
        const apiResponse = await bedrockClient.send(command);
        const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
        const responseBody = JSON.parse(decodedResponseBody);

        const generatedChapter = JSON.parse(responseBody.completion);

        const imageUrl = await generateAndUploadImage(generatedChapter.imagePrompt, summonerName);
        generatedChapter.imageUrl = imageUrl;

        const saga = {
            title: `The Saga of ${summonerName}`,
            summonerName: summonerName,
            chapters: [generatedChapter],
        };

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ saga: saga }),
        };

        return response;

    } catch (error) {
        console.error("Error generating saga:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error generating saga." }),
        };
    }
};