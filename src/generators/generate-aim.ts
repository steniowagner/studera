import { interpolatePrompt } from "./interpolate-prompt";
import { Pinecone, Gpt } from "../utils";
import * as prompts from "./prompts";
import config from "./config";

const aimPrompt =
  `We need to create content to be used for education of a "[role]" in the "[industry]" industry.
Generate a sentence starting with an infinitive verb which captures why someone would study this content, with no more than 20 words.`
    .trim()
    .replace("\n", "");

export const generateAim = async (pinecone: Pinecone, gpt: Gpt) => {
  const prompt = interpolatePrompt(aimPrompt, config);
  const similarities = await pinecone.findSimilarVectors(prompt);
  const gptPrompt = `${prompts.guidelines}\nContext:${similarities}\nTask: ${prompt}`;
  const answer = await gpt.ask(gptPrompt);
  return answer.choices[0].message.content ?? "";
};
