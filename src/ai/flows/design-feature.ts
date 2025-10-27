'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DesignFeatureInputSchema = z.object({
  featureName: z.string().min(2).describe('The feature name to design.'),
  targetCloud: z.enum(['aws','azure','gcp','multi']).default('multi').describe('Primary target cloud.'),
  targetCertification: z.string().optional().describe('Optional target certification (e.g., AWS SAA-C03).'),
  learnerContext: z.string().optional().describe('Optional learner context or uploaded notes summary.'),
});
export type DesignFeatureInput = z.infer<typeof DesignFeatureInputSchema>;

const DesignFeatureOutputSchema = z.object({
  description: z.string(),
  userFlow: z.string(),
  uiUx: z.string(),
  components: z.array(z.string()),
  integration: z.string(),
  security: z.string(),
  metrics: z.array(z.string()),
  formatted: z.string().describe('Markdown formatted full spec'),
});
export type DesignFeatureOutput = z.infer<typeof DesignFeatureOutputSchema>;

const systemPrompt = ai.definePrompt({
  name: 'designFeaturePrompt',
  input: { schema: DesignFeatureInputSchema },
  output: { schema: DesignFeatureOutputSchema },
  prompt: `You are designing a new capability for an AI-powered Cloud Certification Preparation App inspired by Bag Learning. 

Feature name: {{{featureName}}}
Primary cloud scope: {{{targetCloud}}}
Target certification: {{{targetCertification}}}
Learner context (optional): {{{learnerContext}}}

Requirements:
- Enhance exam readiness and practical understanding of cloud technologies.
- Personalize content from learner uploads, weak topics, and target certification.
- Support self-paced study and track measurable improvement.
- Use inspiration from Bag Learning (AI tutor, smart notes, quizzes, knowledge tree) but tailor for cloud certification with real-world tasks, architecture reasoning, and scenario-based practice.

Return a JSON object with the following fields that match the output schema:
- description: 3-4 sentence purpose.
- userFlow: step-by-step from onboarding to results.
- uiUx: concrete UI layout and engagement hooks.
- components: list of core functional components (input, AI processing, output, analytics, orchestration).
- integration: how it integrates with Smart Notes, Flashcards, Quizzes, Mock Exams, Knowledge Tree.
- security: privacy and security considerations for uploaded content.
- metrics: KPIs like accuracy per domain, time efficiency, readiness score.
- formatted: A clean Markdown document that includes all sections with headings suitable for rendering.
`,
});

export async function designFeature(input: DesignFeatureInput): Promise<DesignFeatureOutput> {
  const { output } = await systemPrompt(input);
  return output!;
}

