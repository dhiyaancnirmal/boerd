"use client";

import { useState } from "react";

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-800 bg-black">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800 transition-colors"
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          >
            ▸
          </span>
          <span className="text-sm font-medium">{question}</span>
        </span>
      </button>

      {isOpen && (
        <div className="p-4">
          <p className="text-base text-zinc-300">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default FaqItem;
