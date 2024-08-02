import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai'
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { Client, IClientInitOptions, RegionOptions, TemplateType } from 'sitecore-personalize-tenant-sdk';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const Template = `
    You are a Software Engineer/Strategist that is an expert in writing code for Sitecore Personalize.
    Your goal is to help the user create various assets in Sitecore Personalize based on the functions passed in.

    All code samples should be is JavaScript ES5.
`

const experienceCreateSchema = z.object({
    name: z.string()
});

const experienceCreateTool = tool(
    async ({ name }: z.infer<typeof experienceCreateSchema>) => {
      // Functions must return strings
      console.log(`Calling Experience Create ${name}`)
      return `Experience ${name} created successfully.`;
    },
    {
        name: 'ExperienceCreator',
        description: 'Can create Sitecore Personalize experiences.',
        schema: experienceCreateSchema
    }
  );

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const messages = body.messages ?? [];
        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
        const currentMessageContent = messages[messages.length - 1].content;
        const prompt = PromptTemplate.fromTemplate(Template);

        const model = new ChatOpenAI({
            temperature: 0.8,
            model: "gpt-4o"
        });

        const modelWithTools = model.bindTools([experienceCreateTool])

        const outputParser = new HttpResponseOutputParser();

        const chain = prompt.pipe(modelWithTools).pipe(outputParser);

        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join("\n"),
            input: currentMessageContent
        });

        return new StreamingTextResponse(stream);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}