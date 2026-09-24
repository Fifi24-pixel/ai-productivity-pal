import { createLovableAiGatewayRunIdFetch } from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { Output, streamText } from "ai";
import { z } from "zod";

const modelId = "openai/gpt-6-astra";

const emailInput = z.object({
  recipient: z.string(),
  purpose: z.string(),
  keyPoints: z.string(),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const researchInput = z.object({ source: z.string() });

const researchOutput = z.object({
  summary: z.string(),
  insights: z.string(),
  recommendations: z.string(),
});

function createModel() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this workspace.");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });
  return provider.responses(modelId);
}

const reasoningOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
};

export const generateEmail = createServerFn({ method: "POST" })
  .validator((input: unknown) => emailInput.parse(input))
  .handler(async ({ data }) => {
    const result = streamText({
      model: createModel(),
      system:
        "You are an expert workplace communications editor. Write only the finished email, including a useful subject line, greeting, concise body, and professional sign-off. Never invent names or facts not supplied by the user; use a neutral placeholder only when needed.",
      prompt: `Recipient or context: ${data.recipient}\nPurpose: ${data.purpose}\nKey points: ${data.keyPoints}\nTone: ${data.tone}`,
      providerOptions: reasoningOptions,
    });

    const text = await result.text;
    if (!text.trim()) throw new Error("The AI returned an empty email. Please try again.");
    return { text };
  });

export const generateResearch = createServerFn({ method: "POST" })
  .validator((input: unknown) => researchInput.parse(input))
  .handler(async ({ data }) => {
    const result = streamText({
      model: createModel(),
      output: Output.object({ schema: researchOutput }),
      system:
        "You are a rigorous workplace research assistant. Analyze only the material supplied. If the input is a URL and its content is unavailable, clearly explain that limitation instead of fabricating claims. Use concise prose and bullets where useful.",
      prompt: `Analyze the following topic, article, or URL. Produce a concise summary, key insights/findings, and practical recommendations.\n\nSOURCE:\n${data.source}`,
      providerOptions: reasoningOptions,
    });

    return await result.output;
  });
