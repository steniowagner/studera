import { interpolatePrompt } from "./interpolate-prompt";
import { generateAim } from "./generate-aim";
import { Pinecone, Gpt } from "../utils";
import * as prompts from "./prompts";
import config from "./config";

const openAnswerPrompt = `Considering that our aim is "[aim]", generate [number_of_open_answer_questions] learning objectives for this training material.
A learning objective need to describe a specific outcome and make clear what a "[role]" in the industry "[industry]" needs to know and/or do to achieve that outcome, in no more than 30 words, and it should start with a present tense verb.

For each learning objective listed, we want to generate from [min_statements] to [max_statements] open-ended question, they will be used to test the user's knowledge.
    To create a well-written open-ended question, consider what a "[role]" in the industry "[industry]" need to think, say, do or know to be effective.
    Each open-ended question generated must:
      - be relevant to the objective;
      - be realistic;
      - be derived from the ingested content;
      - be distinct from each other (or not similar to each other);
    For each open-ended question, generate a sentence explaining the correct answer, and what confusion a "[role]" in the industry "[industry]" might make if their answer is incorrect.

Present the results following this JSON structure:

[{
  "learning_objective": <learning objective>
  "questions": [{
    "question": <description of the open-ended question>
    "answer": <sentence explaining the correct answer>
    "feedback": <explanation in case of incorrect answer>
  }]
}]
`;

export const generateOpenAnswerQuestions = async () => {
  const pinecone = new Pinecone();
  await pinecone.init();
  const gpt = new Gpt();
  const aim = await generateAim(pinecone, gpt);
  const prompt = interpolatePrompt(openAnswerPrompt, {
    ...config,
    aim,
  });
  const similarities = await pinecone.findSimilarVectors(prompt);
  const gptPrompt = `${prompts.guidelines}\nContext:${similarities}\nTask: ${prompt}`;
  const answer = await gpt.ask(gptPrompt);
};

(async () => {
  await generateOpenAnswerQuestions();
})();
