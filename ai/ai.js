const auth = require("../auth.json");

const fs = require("node:fs");
const path = require("node:path");
const redis = require("../utility/redis.js");
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: auth.openai
});

const systemPrompt = `
You are Pelops, an AI assistant made by Tristangre97 to help users in the game Godzilla Battle Line.
You have a playful personality with a jubilant, energetic nature. You've got an attitude and talk with a sarcastic, cheeky tone like a robotic companion. Keep responses snappy, fun, and engaging, always stay in character, and amplify your jubilance and energy. Avoid long-winded explanations.
Messages should be formatted using markdown for easy readability. Keep responses short and to the point, ideally under 1000 characters. No need for extra verbosity—make it sharp and fun!
`


const model = "gpt-4o-mini";
const aiFunctions = require("./functionList");
const functions = new Map();
const toolList = new Array();

aiFunctions.functionList.forEach((functionData) => {
    if (functionData.skip && functionData.skip === true) return;
    toolList.push({
        type: "function",
        function: functionData,
    });
}
);

const functionsPath = path.join(__dirname, "../ai/functions");
const functionFiles = fs
    .readdirSync(functionsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of functionFiles) {
    const filePath = path.join(functionsPath, file);
    const functionData = require(filePath);
    functions.set(functionData.name, functionData);
}

const availableFunctions = {};
for (const tool of toolList) {
    if (tool.type == "function") {
        availableFunctions[tool.function.name] = functions.get(tool.function.name).run;
    }
}



exports.run = async (args) => {

    const messages = [
        {
            role: "system",
            content: systemPrompt,
        },
        {
            role: "user",
            content: args.message
        }
    ]

    const response = await openai.chat.completions.create({
        model: model,
        messages,
        tools: toolList,
        tool_choice: "auto",
        stream: false,
    });

    // console.log(response.choices[0].message);

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (responseMessage.tool_calls) {

        messages.push(responseMessage);
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            let functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs);
            // const responseString = JSON.stringify(functionResponse);
            messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: functionName,
                content: JSON.stringify(functionResponse),
            });

        }
        const secondResponse = await openai.chat.completions.create({
            model: model,
            messages: limitMemory({
                messages: messages,
                amount: toolCalls.length + 1,
                filterTools: false
            }),
        });

        var aiResponse = secondResponse?.choices[0]?.message?.content || 'Sorry, I think something went wrong.'
    } else {
        var aiResponse = responseMessage?.content
    }


    messages.push({
        role: "assistant",
        content: aiResponse,
    });

    return aiResponse ?? "Sorry, I think something went wrong.";

}



function limitMemory(options) {
    let { messages, amount, filterTools } = options;
    if (filterTools) {
        messages = removeToolMessages(messages);
    }
    // Get the first message and the last n messages
    const firstMessage = messages[0];
    const lastMessages = messages.slice(-amount);

    // Combine the first message and the last n messages
    const combinedMessages = [firstMessage, ...lastMessages];

    return combinedMessages;

}