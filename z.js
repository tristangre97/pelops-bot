const auth = require("./auth.json");

const fs = require("node:fs");

const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: auth.openai
});
const { zodTextFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const InstructionFormat = z.object({
    movieName: z.string(),
    year: z.string(),
});

const unitDataJSON = require('./data/unitData.json');
const unitDataNew = {}

async function main() {
    for (const unit in unitDataJSON) {

        const unitData = unitDataJSON[unit];
        if (unitData.movie) {
            console.log(`Skipping ${unit} as it already has a movie`);
            unitDataNew[unit] = unitData;
            continue;
        }


        const prompt = `What movie does the following Godzilla unit come from and what year was it released? ${unitData.name}`
        const response = await openai.responses.parse({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: "You are a helpful assistant that provides the movie title and release year for a given character from the game Godzilla: Battle Line. Always search the web to ensure your answers are accurate and up-to-date."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            text: {
                format: zodTextFormat(InstructionFormat, "instruction"),
            },
            tools: [
                {
                    "type": "web_search",
                    "user_location": {
                        "type": "approximate",
                        "country": "US",
                        "region": "SC",
                        "city": "Kershaw"
                    },
                    "search_context_size": "medium"
                }
            ],
        });

        const movieDetails = response.output_parsed;
        console.log(`Unit: ${unit}, Movie: ${movieDetails.movieName}, Year: ${movieDetails.year}`);

        unitDataNew[unit] = {
            ...unitData,
            movie: movieDetails.movieName,
            year: movieDetails.year
        };


    }
    fs.writeFileSync('./data/unitDataNew.json', JSON.stringify(unitDataNew, null, 2));
}

main();