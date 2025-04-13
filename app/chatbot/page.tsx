"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Adjust path if needed
import { ModeToggle } from "@/components/mode-toggle";    // Adjust path if needed
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, User, Bot, Send } from "lucide-react";


type ChatMessage = {
    role: "user" | "bot";
    content: string;
};

export default function ChatBotPage() {
    // Track user input
    const [inputValue, setInputValue] = useState("");
    // Track chat messages in an array of { role: "user"|"bot", content: string }
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [isGenerating, setIsGenerating] = useState(false);

    // Ref to the messages container so we can scroll it
    const messagesRef = useRef<HTMLDivElement>(null);

    // Whenever `messages` changes (like new message), auto-scroll to the bottom
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const question = inputValue.trim();
        if (!question) return;

        // User's message
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setInputValue("");

        // Simulate bot response
        simulateAIResponse();
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

            {/* Body container */}
            <main className="flex-1 relative py-4 max-h-196">
                <div className="pointer-events-none absolute top-0 left-0 w-full h-8 
                        bg-gradient-to-b from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0)] 
                        dark:from-[rgba(0,0,0,0.7)] dark:to-[rgba(0,0,0,0)] z-10" />
                <div 
                ref={messagesRef}
                style={{ scrollBehavior: "smooth" }}
                className="max-w-5xl mx-auto flex flex-col space-y-3 max-h-196 w-full overflow-y-auto px-4 pb-4 pt-6">
                    {/* Centered greeting */}
                    {messages.length === 0 && !isGenerating ? (
                        // If no messages yet, show the large greeting
                        <div className="mt-70 text-center space-y-2">
                            <h2 className="text-3xl md:text-6xl font-light text-gray-500">
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
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`p-3 rounded-xl text-md max-w-[75%] ${msg.role === "user"
                                            ? "bg-[#0456F7] text-white"
                                            : "bg-gray-200 dark:bg-[#2A2A2A] text-gray-800 dark:text-white"
                                            }`}
                                    >
                                        <div>
                                            {msg.content}
                                        </div>
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
                </div>
            </main>

            {/* Chat Input Footer */}
            <form
                onSubmit={handleSubmit}
                className="w-full py-4"
            >
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <Input
                        type="text"
                        className="flex-1 h-[80px] rounded-full text-lg px-8"
                        placeholder="Ask me anything mami.."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button
                        type="submit"
                        className="rounded-full bg-[#0456F7] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 w-[50px] h-[50px] p-0 flex items-center justify-center"
                    >
                        <Send className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </form>
        </div>
    );
}