"use client";

import { MODELS } from "../constants";

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled: boolean;
}

export default function ModelSelector({
  selectedModel,
  setSelectedModel,
  disabled,
}: ModelSelectorProps) {
  return (
    <div className="bg-zinc-800 p-4 rounded border border-zinc-700 shadow-md">
      <label htmlFor="model" className="block text-sm font-medium mb-2 text-zinc-300">
        Voice Model
      </label>
      <select
        id="model"
        name="model"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full p-2 border border-zinc-600 rounded bg-zinc-900 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        disabled={disabled}
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
