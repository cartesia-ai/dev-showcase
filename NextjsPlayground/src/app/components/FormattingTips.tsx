"use client";

import { FORMATTING_TIPS } from "../constants";

interface FormattingTipsProps {
  showTips: boolean;
}

export default function FormattingTips({ showTips }: FormattingTipsProps) {
  if (!showTips) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-zinc-200">Formatting Tips for Better Results</h3>
      
      <ul className="space-y-2 bg-zinc-900 p-4 rounded border border-zinc-700 text-sm text-zinc-300">
        {FORMATTING_TIPS.map((tip) => (
          <li key={tip.id} className="flex">
            <span className="text-blue-400 mr-2">•</span>
            <div>
              <span className="font-medium text-blue-300">{tip.title}: </span>
              {tip.content}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 bg-zinc-900 p-3 rounded border border-zinc-700">
        <h4 className="text-sm font-medium mb-2 text-blue-300">Example</h4>
        <pre className="bg-zinc-950 p-3 rounded text-xs text-zinc-300 overflow-x-auto">
          {`Hello, my name is Sonic. <break time="1s"/> Nice to meet you.
Phone number: <spell>123-456-7890</spell>`}
        </pre>
      </div>
    </div>
  );
}
