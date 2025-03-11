"use client";

interface ActionButtonsProps {
  isPlaying: boolean;
  hasAudio: boolean;
  onDownload: () => void;
}

export default function ActionButtons({
  isPlaying,
  hasAudio,
  onDownload,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="submit"
        disabled={isPlaying}
        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded shadow-md hover:bg-blue-700 transition-colors disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
      >
        {isPlaying ? "Speaking..." : "Speak"}
      </button>
      
      {hasAudio && (
        <button
          type="button"
          onClick={onDownload}
          className="bg-green-600 text-white py-3 px-5 rounded shadow-md hover:bg-green-700 transition-colors"
        >
          Download
        </button>
      )}
    </div>
  );
}
