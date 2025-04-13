"use client";

import React, { useState, FormEvent } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Adjust path if needed
import { ModeToggle } from "@/components/mode-toggle";    // Adjust path if needed
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, User, Bot, Send } from "lucide-react";

export default function ChatBotPage() {
  // Track user input
  const [inputValue, setInputValue] = useState("");
  // Track chat messages in an array of { role: "user"|"bot", content: string }
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; content: string }[]
  >([]);

  const [isGenerating, setIsGenerating] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputValue.trim() },
    ]);

    // Simulate an AI response
    simulateAIResponse();

    // Reset input
    setInputValue("");
  }

  // Simulate waiting for an AI response
  function simulateAIResponse() {
    setIsGenerating(true);

    // Show "Generating" for demonstration, then produce a dummy response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "This is an example answer from Cici. (Replace with real AI)",
        },
      ]);
      setIsGenerating(false);
    }, 2000);
  }

  return (
    <div className="flex p-8 min-h-screen flex-col bg-white text-black dark:bg-[#000] dark:text-white">
      {/* Top bar: ChatBot title + icons */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b">
        <div className="flex items-center gap-2">
          {/* Optional: If you have a sidebar */}
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-6" />
          <h1 className="text-2xl font-semibold">ChatBot</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>

      {/* <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Chatbot</h1>
        </div>
        <ModeToggle />
      </div> */}

      {/* Body container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Centered greeting */}
        {messages.length === 0 ? (
          // If no messages yet, show the large greeting
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-6xl font-light text-gray-500">
              Good Morning Mami,
            </h2>
            <h1 className="text-3xl md:text-6xl font-semibold text-gray-500 mt-4">
              How can cici help you today?
            </h1>
          </div>
        ) : (
          // If there are messages, show them
          <div className="w-full max-w-5xl space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xl text-md max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-[#2A2A2A] text-gray-800 dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {/* If still generating, show placeholder text */}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl text-md max-w-[75%] bg-gray-200 dark:bg-[#2A2A2A] text-gray-800 dark:text-white">
                  Generating Your Answer...
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat Input Footer */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl mx-auto py-4 flex items-center gap-4"
      >
        <Input
          type="text"
          className="flex-1 h-[80px] rounded-full text-lg px-8"
          placeholder="Ask me anything mami.."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          type="submit"
          className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 w-[50px] h-[50px] p-0 flex items-center justify-center"
        >
          <Send className="h-5 w-5 text-white" />
        </Button>
      </form>
    </div>
  );
}