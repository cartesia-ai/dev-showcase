"use client";

import { LANGUAGES } from "../constants";

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  disabled: boolean;
}

export default function LanguageSelector({
  selectedLanguage,
  setSelectedLanguage,
  disabled,
}: LanguageSelectorProps) {
  return (
    <div className="bg-zinc-800 p-4 rounded border border-zinc-700 shadow-md">
      <label
        htmlFor="language"
        className="block text-sm font-medium mb-2 text-zinc-300"
      >
        Language
      </label>
      <select
        id="language"
        name="language"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="w-full p-2 border border-zinc-600 rounded bg-zinc-900 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        disabled={disabled}
      >
        {LANGUAGES.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}
