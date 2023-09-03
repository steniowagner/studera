import { interpolatePrompt } from "./interpolate-prompt";
import { generateAim } from "./generate-aim";
import { Pinecone, Gpt, writeTXTFile } from "../utils";
import * as prompts from "./prompts";
import config from "./config";

type Statement = {
  statement: string;
  answer: string;
  feedback: string;
};

type MultiAnswerQuestion = {
  learning_objective: string;
  statements: Statement[];
};

const multiAnswerPrompt = `Considering that our aim is "[aim]", generate [number_of_multi_answer_questions] learning objectives for this training material.
A learning objective need to describe a specific outcome and make clear what a "[role]" in the industry "[industry]" needs to know and/or do to achieve that outcome, in no more than 30 words, and it should start with a present tense verb.

For each learning objective listed, we want to generate from [min_statements] to [max_statements] statements.
    Those statements will be either true or false, and will be used to test the user's knowledge.
    To create a well-written statement, consider what a "[role]" in the industry "[industry]" need to think, say, do or know to be effective.
    To create the false statements, consider:
      - what cognitive errors might a "[role]" in the industry "[industry]" make and why, or
      - what might cause "[role]" to be resistant to avoiding this statement and why, or
      - what may be hard to understand for a "[role]" and why.
    Each statement generated must:
      - be relevant to the objective;
      - be realistic;
      - be derived from the ingested content;
      - be distinct from each other (or not similar to each other);
      - be no more than [word_count] words;
      - describe an action and start with a present tense verb.
    For each statement, generate a sentence explaining either why this is correct (for true statements) or a sentence explaining why it is incorrect, and what confusion a "[role]" in the industry "[industry]" might make if they think the statement is correct.

Present the results following this JSON structure:

[{
  "learning_objective": <learning objective>
  "statements": [{
    "statement": <description of the statement>
    "answer": <if it's true (T) or false (F)>
    "feedback": <explanation about why the statement it's True or False>
  }]
}]
`;

const writeQuestionsFile = async (
  multiAnswerQuestions: MultiAnswerQuestion[]
) => {
  const content = multiAnswerQuestions
    .map((openAnswerQuestion) => {
      const statements = openAnswerQuestion.statements.map(
        ({ statement }) => `[ ] ${statement}`
      );
      return `* Learning Objective: ${
        openAnswerQuestion.learning_objective
      }\n\n> Statements:\n${statements.join("\n")}`;
    })
    .join("\n\n#\n\n");
  await writeTXTFile(`${process.argv[2]}-multi-answer-questions`, content);
};

const writeAnswersFile = async (
  multiAnswerQuestions: MultiAnswerQuestion[]
) => {
  const content = multiAnswerQuestions
    .map((openAnswerQuestion) => {
      const answers = openAnswerQuestion.statements.map(
        (statement) =>
          `Statement: ${statement.statement}\nAnswer: ${statement.answer}\nFeedback: ${statement.feedback}`
      );
      return `* Learning Objective: ${
        openAnswerQuestion.learning_objective
      }\n\n> Answers:\n\n${answers.join("\n\n---\n\n")}`;
    })
    .join("\n\n#\n\n");
  await writeTXTFile(`${process.argv[2]}-multi-answer-answers`, content);
};

export const generateMultiAnswerQuestions = async () => {
  const pinecone = new Pinecone();
  await pinecone.init();
  const gpt = new Gpt();
  const aim = await generateAim(pinecone, gpt);
  const prompt = interpolatePrompt(multiAnswerPrompt, {
    ...config,
    aim,
  });
  const similarities = await pinecone.findSimilarVectors(prompt);
  const gptPrompt = `${prompts.guidelines}\nContext:${similarities}\nTask: ${prompt}`;
  const answer = await gpt.ask(gptPrompt);
  const multiAnswerQuestions = JSON.parse(
    answer.choices[0].message.content ?? ""
  ) as MultiAnswerQuestion[];
  await Promise.all([
    writeQuestionsFile(multiAnswerQuestions),
    writeAnswersFile(multiAnswerQuestions),
  ]);
};

(async () => {
  await generateMultiAnswerQuestions();
})();
