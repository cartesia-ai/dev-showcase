"use client";

import { useState } from "react";
import { EMOTION_GROUPS } from "../constants";

interface EmotionControlsProps {
  disabled: boolean;
}

export default function EmotionControls({ disabled }: EmotionControlsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-800 p-4 rounded border border-zinc-700 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-zinc-200">Voice Emotions</h3>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
        >
          {expanded ? "Hide Controls" : "Show Controls"}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded border border-zinc-700">
            Select emotion levels (up to one per category). Default is Positivity: High.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMOTION_GROUPS.map((group) => {
              const inputId = `emotion${group.id.charAt(0).toUpperCase() + group.id.slice(1)}`;
              return (
                <div key={group.id} className="bg-zinc-900 p-3 rounded border border-zinc-700">
                  <label htmlFor={inputId} className="block text-sm font-medium mb-2 text-zinc-300">
                    {group.name}
                  </label>
                  <select
                    id={inputId}
                    name={inputId}
                    className="w-full p-2 border border-zinc-600 rounded bg-zinc-900 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={disabled}
                    defaultValue=""
                  >
                    {group.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
