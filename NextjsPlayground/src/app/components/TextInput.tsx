"use client";

interface TextInputProps {
  showTips: boolean;
  setShowTips: (show: boolean) => void;
  disabled: boolean;
}

export default function TextInput({
  showTips,
  setShowTips,
  disabled,
}: TextInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label htmlFor="text" className="block text-sm font-medium text-zinc-300">
          Text to Speak
        </label>
        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {showTips ? "Hide Tips" : "Show Tips"}
        </button>
      </div>
      <textarea
        id="text"
        name="text"
        rows={6}
        className="w-full p-3 border border-zinc-600 rounded bg-zinc-900 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter text to convert to speech..."
        required
        disabled={disabled}
      />
    </div>
  );
}
