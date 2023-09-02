const INTERPOLATION_PATTERN = /\[([^\]]+)\]/g;

type PossibleTypes = string | number | boolean;

type ContextVariables = Record<string, PossibleTypes>;

type InterpolationVariable = { key: string; value: PossibleTypes };

const extractVariables = (
  prompt: string,
  contextVariables: ContextVariables
) => {
  const matches = prompt.match(INTERPOLATION_PATTERN);
  if (!matches) {
    return null;
  }
  const variables = matches.map((match) => {
    const key = match.replace("[", "").replace("]", "");
    const value = contextVariables[key];
    return { key: `[${key}]`, value };
  });
  return variables;
};

const interpolate = (
  prompt: string,
  interpolationVariables: InterpolationVariable[]
) => {
  let promptIntermpolated = `${prompt}`;
  interpolationVariables.forEach((interpolationVariable) => {
    if (interpolationVariable.value) {
      promptIntermpolated = promptIntermpolated.replace(
        interpolationVariable.key,
        `${interpolationVariable.value}`
      );
    }
  });
  return promptIntermpolated;
};

export const interpolatePrompt = (
  prompt: string,
  contextVariables: ContextVariables
) => {
  const variables = extractVariables(prompt, contextVariables);
  if (!variables) {
    return prompt;
  }
  return interpolate(prompt, variables);
};
