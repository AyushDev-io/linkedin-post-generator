"use client"; // CRITICAL: This tells Next.js we are using browser features like buttons

import { useState } from "react";

export default function Home() {
  // 1. Setting up the "Memory" (State)
  const [topic, setTopic] = useState("");
  const [post, setPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 2. The Button Click Function
  const handleGenerate = async () => {
    if (!topic) {
      alert("Please enter a topic first!");
      return;
    }

    setIsGenerating(true); // Turn on loading mode
    setPost(""); // Clear any old post

    try {
      // 3. Talking to our Secret Tunnel (Backend)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: topic }),
      });

      const data = await response.json();

      if (response.ok) {
        setPost(data.post); // Save the AI text to memory!
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    } finally {
      setIsGenerating(false); // Turn off loading mode
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-8">
          Viral LinkedIn Post Generator
        </h1>

        <div className="space-y-6">
          {/* Input Area */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              What do you want to write about?
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows="3"
              placeholder="e.g., I just built my first micro-SaaS in 4 weeks and learned..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            ></textarea>
          </div>

          {/* The Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white font-bold text-lg py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating Magic..." : "Generate Viral Post"}
          </button>

          {/* Output Area */}
          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your AI-Generated Post:
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg p-3 bg-gray-50 outline-none text-gray-800"
              rows="8"
              readOnly
              placeholder="Your post will magically appear here..."
              value={post}
            ></textarea>
          </div>
        </div>
      </div>
    </main>
  );
}