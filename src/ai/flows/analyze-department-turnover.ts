'use server';

/**
 * @fileOverview An AI agent to analyze department turnover trends.
 *
 * - analyzeDepartmentTurnover - A function that analyzes department turnover.
 * - AnalyzeDepartmentTurnoverInput - The input type for the analyzeDepartmentTurnover function.
 * - AnalyzeDepartmentTurnoverOutput - The return type for the analyzeDepartmentTurnover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDepartmentTurnoverInputSchema = z.object({
  employeeData: z.string().describe('A JSON string containing employee data, including department and employment history.'),
});
export type AnalyzeDepartmentTurnoverInput = z.infer<typeof AnalyzeDepartmentTurnoverInputSchema>;

const AnalyzeDepartmentTurnoverOutputSchema = z.object({
  analysis: z.string().describe('An analysis of department turnover trends, identifying departments with the highest turnover rates and potential contributing factors.'),
});
export type AnalyzeDepartmentTurnoverOutput = z.infer<typeof AnalyzeDepartmentTurnoverOutputSchema>;

export async function analyzeDepartmentTurnover(input: AnalyzeDepartmentTurnoverInput): Promise<AnalyzeDepartmentTurnoverOutput> {
  return analyzeDepartmentTurnoverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDepartmentTurnoverPrompt',
  input: {schema: AnalyzeDepartmentTurnoverInputSchema},
  output: {schema: AnalyzeDepartmentTurnoverOutputSchema},
  prompt: `You are an HR analyst tasked with identifying department turnover trends.

  Analyze the provided employee data to identify departments with the highest turnover rates and potential contributing factors.  Provide a concise summary of your findings.

  Employee Data: {{{employeeData}}}
  `,
});

const analyzeDepartmentTurnoverFlow = ai.defineFlow(
  {
    name: 'analyzeDepartmentTurnoverFlow',
    inputSchema: AnalyzeDepartmentTurnoverInputSchema,
    outputSchema: AnalyzeDepartmentTurnoverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
