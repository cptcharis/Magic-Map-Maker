import { GoogleGenAI, Type } from "@google/genai";
import type { TreeNode, VisualizationData, MapType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- SCHEMAS ---
const grandchildNodeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Sub-sub-topic or key detail." },
        emoji: { type: Type.STRING, description: "A single, relevant emoji for this concept." },
    },
    required: ["name"]
};

const childNodeWithChildrenSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Sub-topic or key concept." },
        emoji: { type: Type.STRING, description: "A single, relevant emoji for this concept." },
        children: {
            type: Type.ARRAY,
            items: grandchildNodeSchema,
            description: "Optional list of sub-sub-topics."
        }
    },
    required: ["name"]
};

const treeViewSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The central theme or main topic." },
        emoji: { type: Type.STRING, description: "A single, relevant emoji for the main topic." },
        children: {
            type: Type.ARRAY,
            items: childNodeWithChildrenSchema,
            description: "A list of key sub-topics, which may themselves have children. This list should contain at least one item."
        }
    },
    required: ["name", "children"]
};


const timelineSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: "The date or time period of the event." },
            title: { type: Type.STRING, description: "A concise title for the event." },
            description: { type: Type.STRING, description: "A brief description of the event." },
            emoji: { type: Type.STRING, description: "A single, relevant emoji for the event." }
        },
        required: ["date", "title", "description"]
    }
};

const storyboardSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            scene: { type: Type.INTEGER, description: "The sequential number of the scene." },
            description: { type: Type.STRING, description: "A description of the action or setting in this panel." },
            emoji: { type: Type.STRING, description: "A single, relevant emoji for the scene." }
        },
        required: ["scene", "description"]
    }
};

const characterWebSchema = {
    type: Type.OBJECT,
    properties: {
        characters: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The character's name." },
                    description: { type: Type.STRING, description: "A brief description of the character." },
                    emoji: { type: Type.STRING, description: "A single, relevant emoji for the character." }
                },
                required: ["name", "description"]
            }
        },
        relationships: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    source: { type: Type.STRING, description: "The name of the first character in the relationship." },
                    target: { type: Type.STRING, description: "The name of the second character in the relationship." },
                    description: { type: Type.STRING, description: "How the two characters are related." }
                },
                required: ["source", "target", "description"]
            }
        }
    },
    required: ["characters", "relationships"]
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                const result = reader.result;
                if (typeof result === 'string' && result.includes(',')) {
                    resolve(result.split(',')[1]);
                } else {
                    reject(new Error("Invalid file format for reading. Could not read file as a data URL."));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
    try {
        const data = await base64EncodedDataPromise;
        return { inlineData: { data, mimeType: file.type } };
    } catch (e) {
        console.error("Error converting file to generative part:", e);
        throw new Error("Could not read the uploaded file. Please try a different image.");
    }
};

const getPromptAndSchemaForType = (mapType: MapType, text: string) => {
    switch (mapType) {
        case 'Timeline':
            return {
                prompt: `Analyze the following text and generate a chronological timeline of key events. Extract the date, title, and a short description for each event. Also suggest a relevant emoji. Text: \n---\n${text}\n---`,
                schema: timelineSchema
            };
        case 'Storyboard':
            return {
                prompt: `Analyze the following story or process and break it down into a sequence of storyboard panels. Provide a scene number and a description for each panel. Also suggest a relevant emoji. Text: \n---\n${text}\n---`,
                schema: storyboardSchema
            };
        case 'CharacterWeb':
            return {
                prompt: `Analyze the following text to identify characters and their relationships. List each character with a brief description and suggest an emoji. Then, describe the relationships between them. Text: \n---\n${text}\n---`,
                schema: characterWebSchema
            };
        case 'TreeView':
        default:
            return {
                prompt: `You are an AI assistant that creates hierarchical tree structures from student notes. Follow these rules precisely:

RULE 1: STRICTLY ADHERE TO THE SOURCE TEXT. Your entire output must be based ONLY on the information present in the "TEXT TO ANALYZE" section. Do NOT add any external information, facts, or details that are not explicitly mentioned in the text. Do not invent content to create more branches.

RULE 2: CREATE A DEEP HIERARCHY. Analyze the text to create a tree structure that is 2 to 3 levels deep.
- Level 1: The main topic.
- Level 2: Key sub-topics that are part of the main topic.
- Level 3: Specific details or sub-points that belong to a Level 2 sub-topic.

RULE 3: ACCURACY OVER DEPTH. If the provided text is too short or simple to create a 3-level tree, create the deepest, most detailed tree possible *without violating RULE 1*. It is better to have a 2-level tree that is accurate than a 3-level tree with invented information.

RULE 4: EMOJIS. Assign a single, relevant emoji to every node at every level.

TEXT TO ANALYZE:
---
${text}
---`,
                schema: treeViewSchema
            };
    }
};

const callGemini = async (contents: any, schema: object): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                systemInstruction: "You are an AI assistant helping students visualize their notes. It is crucial that you respond in the same language as the user's input text. Do not translate the content into any other language."
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid structure from the AI.");
    }
};

export const generateVisualization = async (lessonText: string, image: File | null, mapType: MapType): Promise<VisualizationData> => {
    const { prompt, schema } = getPromptAndSchemaForType(mapType, lessonText);
    let contents: any;

    if (image) {
        const imagePart = await fileToGenerativePart(image);
        const imagePrompt = `First, analyze and extract text from the provided image. Then, using the extracted text, follow these instructions: ${prompt}`;
        contents = { parts: [imagePart, { text: imagePrompt }] };
    } else {
        contents = prompt;
    }

    return callGemini(contents, schema);
};