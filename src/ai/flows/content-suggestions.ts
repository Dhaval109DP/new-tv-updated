'use server';
export const maxDuration = 60;
/**
 * @fileOverview An AI agent that provides auto-suggestions for movie and show titles.
 *
 * - getContentSuggestions - A function that returns a list of content suggestions based on a partial query.
 * - ContentSuggestionsInput - The input type for the getContentSuggestions function.
 * - ContentSuggestionsOutput - The return type for the getContentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentSuggestionsInputSchema = z.object({
  query: z
    .string()
    .describe('The partial text input from the user to generate suggestions for.'),
});
export type ContentSuggestionsInput = z.infer<
  typeof ContentSuggestionsInputSchema
>;

const ContentSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of up to 5 suggested movie or show titles based on the query.'
    ),
});
export type ContentSuggestionsOutput = z.infer<
  typeof ContentSuggestionsOutputSchema
>;

export async function getContentSuggestions(
  input: ContentSuggestionsInput
): Promise<ContentSuggestionsOutput> {
  return contentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentSuggestionsPrompt',
  input: {schema: ContentSuggestionsInputSchema},
  output: {schema: ContentSuggestionsOutputSchema},
  prompt: `You are a movie suggestion expert. Based on the user's partial input, suggest a list of up to 5 popular Indian movies, TV shows, or web series that match the query. Only return titles that are likely to be found on platforms like Desi Cinemas, Bollyzone, or Play Desi!. Do not add any extra formatting or numbering.

User's partial input: {{{query}}}`,
});

const contentSuggestionsFlow = ai.defineFlow(
  {
    name: 'contentSuggestionsFlow',
    inputSchema: ContentSuggestionsInputSchema,
    outputSchema: ContentSuggestionsOutputSchema,
  },
  async input => {
    // Return empty suggestions if query is too short
    if (input.query.length < 2) {
      return {suggestions: []};
    }
    const {output} = await prompt(input);
    return output || {suggestions: []};
  }
);
