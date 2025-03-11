"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import ActionButtons from "./components/ActionButtons";
import FormattingTips from "./components/FormattingTips";
import LanguageSelector from "./components/LanguageSelector";
import ModelSelector from "./components/ModelSelector";
import TextInput from "./components/TextInput";
import SpeedSelector from "./components/SpeedSelector";
import EmotionControls from "./components/EmotionControls";
import { useAudio } from "./hooks/useAudio";

export default function Home() {
	const [selectedModel, setSelectedModel] = useState<string>("sonic-2");
	const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
	const [selectedSpeed, setSelectedSpeed] = useState<string>("normal");
	const [showTips, setShowTips] = useState<boolean>(false);
	const { state, generateSpeech, downloadAudio } = useAudio();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		await generateSpeech(formData, selectedModel, selectedLanguage);
	};

	const handleDownload = () => {
		downloadAudio(selectedModel, selectedLanguage);
	};

	return (
		<div className="min-h-screen bg-zinc-900 text-white">
			<div className="container p-6 mx-auto max-w-4xl">
				<h1 className="text-2xl font-bold mb-8 text-center">Cartesia TTS Example</h1>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ModelSelector 
							selectedModel={selectedModel}
							setSelectedModel={setSelectedModel}
							disabled={state.isPlaying}
						/>
						<LanguageSelector 
							selectedLanguage={selectedLanguage}
							setSelectedLanguage={setSelectedLanguage}
							disabled={state.isPlaying}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SpeedSelector
							selectedSpeed={selectedSpeed}
							setSelectedSpeed={setSelectedSpeed}
							disabled={state.isPlaying}
						/>
						<div className="hidden md:block" />
					</div>

					<EmotionControls disabled={state.isPlaying} />
					
					<FormattingTips showTips={showTips} />
					
					<TextInput 
						showTips={showTips}
						setShowTips={setShowTips}
						disabled={state.isPlaying}
					/>

					<ActionButtons 
						isPlaying={state.isPlaying}
						hasAudio={!!state.audioBlob}
						onDownload={handleDownload}
					/>
				</form>
			</div>
		</div>
	);
}
