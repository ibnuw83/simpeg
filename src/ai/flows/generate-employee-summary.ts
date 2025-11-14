'use server';

/**
 * @fileOverview A flow to generate a summary of an employee's data.
 *
 * - generateEmployeeSummary - A function that generates a summary of an employee's data.
 * - GenerateEmployeeSummaryInput - The input type for the generateEmployeeSummary function.
 * - GenerateEmployeeSummaryOutput - The return type for the generateEmployeeSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmployeeSummaryInputSchema = z.object({
  employeeData: z.string().describe('The complete data of the employee.'),
});
export type GenerateEmployeeSummaryInput = z.infer<typeof GenerateEmployeeSummaryInputSchema>;

const GenerateEmployeeSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the employee data.'),
});
export type GenerateEmployeeSummaryOutput = z.infer<typeof GenerateEmployeeSummaryOutputSchema>;

export async function generateEmployeeSummary(input: GenerateEmployeeSummaryInput): Promise<GenerateEmployeeSummaryOutput> {
  return generateEmployeeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmployeeSummaryPrompt',
  input: {schema: GenerateEmployeeSummaryInputSchema},
  output: {schema: GenerateEmployeeSummaryOutputSchema},
  prompt: `You are an HR assistant. Generate a concise summary of the following employee data:\n\n{{employeeData}}`,
});

const generateEmployeeSummaryFlow = ai.defineFlow(
  {
    name: 'generateEmployeeSummaryFlow',
    inputSchema: GenerateEmployeeSummaryInputSchema,
    outputSchema: GenerateEmployeeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
