import { ChatWindow } from "@/components/ChatWindow";
import { PersonalizeChatWindow } from "@/components/PersonalizeChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Sitecore Personalize AI Assistant
      </h1>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
            This template showcases a simple Sitecore Personalize assistant that uses 
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}, Sitecore Personalize SDK
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>Create me a Condition that determines if I'm a Guest or not?</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <PersonalizeChatWindow 
      emoji="🏴‍☠️"
      placeholder="I am your Sitecore Personalize AI Assistant"
      emptyStateComponent={InfoCard}
    ></PersonalizeChatWindow>
  );
}
