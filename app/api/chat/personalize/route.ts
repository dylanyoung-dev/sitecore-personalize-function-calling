import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai'
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers'

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const Template = `
    You are a Software Engineer/Strategist that is expert in writing code for Sitecore Personalize.

    You will write code that is only is ECMAScript 5.0 format, and should replace console.log with print() instead.
`

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

        const outputParser = new HttpResponseOutputParser();

        const chain = prompt.pipe(model).pipe(outputParser);

        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join("\n"),
            input: currentMessageContent
        });

        return new StreamingTextResponse(stream);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}