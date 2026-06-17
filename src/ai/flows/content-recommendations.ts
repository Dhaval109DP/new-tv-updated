'use server';
export const maxDuration = 60;
/**
 * @fileOverview An AI agent that provides personalized content recommendations based on viewing history.
 *
 * - getContentRecommendations - A function that returns content recommendations.
 * - ContentRecommendationsInput - The input type for the getContentRecommendations function.
 * - ContentRecommendationsOutput - The return type for the getContentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRecommendationsInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A list of movies, TV shows, and web series that the user has watched, separated by commas.'
    ),
});
export type ContentRecommendationsInput = z.infer<
  typeof ContentRecommendationsInputSchema
>;

const RecommendationItemSchema = z.object({
  title: z.string().describe('The title of the recommended movie or show.'),
  reason: z
    .string()
    .describe(
      "A brief, compelling reason why this is recommended based on the user's viewing history."
    ),
  genre: z.string().describe('The primary genre of the recommended content.'),
  platform: z
    .enum(['Desi Cinemas', 'Bollyzone', 'Play Desi!', 'Dailymotion', 'T-Flix'])
    .describe('The platform where the content can be found.'),
});

const ContentRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(RecommendationItemSchema)
    .describe(
      'A list of recommended movies, TV shows, and web series based on the viewing history.'
    ),
});
export type ContentRecommendationsOutput = z.infer<
  typeof ContentRecommendationsOutputSchema
>;

export async function getContentRecommendations(
  input: ContentRecommendationsInput
): Promise<ContentRecommendationsOutput> {
  return contentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRecommendationsPrompt',
  input: {schema: ContentRecommendationsInputSchema},
  output: {schema: ContentRecommendationsOutputSchema},
  prompt: `You are a content recommendation expert for Indian movies and TV shows. Based on the user's viewing history, you will recommend other movies, TV shows, and web series that they might enjoy.

For each recommendation, provide a title, a short compelling reason why the user would like it, its genre, and the platform where it can be watched.

Ensure the content is available on one of these five platforms: Desi Cinemas, Bollyzone, Play Desi!, Dailymotion, or T-Flix. You must specify which of these five platforms the content is on.

Here is the user's viewing history: {{{viewingHistory}}}`,
});

const contentRecommendationsFlow = ai.defineFlow(
  {
    name: 'contentRecommendationsFlow',
    inputSchema: ContentRecommendationsInputSchema,
    outputSchema: ContentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
