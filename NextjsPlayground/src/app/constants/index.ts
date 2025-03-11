// Available models and languages based on Cartesia documentation
export const MODELS = [
	{ id: "sonic-2", name: "Sonic 2 (Latest)" },
	{ id: "sonic-turbo", name: "Sonic Turbo (Low Latency)" },
	{ id: "sonic", name: "Sonic (Original)" },
];

export const LANGUAGES = [
	{ id: "en", name: "English" },
	{ id: "fr", name: "French" },
	{ id: "de", name: "German" },
	{ id: "es", name: "Spanish" },
	{ id: "pt", name: "Portuguese" },
	{ id: "zh", name: "Chinese" },
	{ id: "ja", name: "Japanese" },
	{ id: "hi", name: "Hindi" },
	{ id: "it", name: "Italian" },
	{ id: "ko", name: "Korean" },
	{ id: "nl", name: "Dutch" },
	{ id: "pl", name: "Polish" },
	{ id: "ru", name: "Russian" },
	{ id: "sv", name: "Swedish" },
	{ id: "tr", name: "Turkish" },
];

// Emotion options for voice controls
export const EMOTION_GROUPS = [
	{
		id: "positivity",
		name: "Positivity",
		options: [
			{ id: "", name: "Not Selected" },
			{ id: "positivity:lowest", name: "Lowest Positivity" },
			{ id: "positivity:low", name: "Low Positivity" },
			{ id: "positivity:high", name: "High Positivity" },
			{ id: "positivity:highest", name: "Highest Positivity" },
		],
	},
	{
		id: "anger",
		name: "Anger",
		options: [
			{ id: "", name: "Not Selected" },
			{ id: "anger:lowest", name: "Lowest Anger" },
			{ id: "anger:low", name: "Low Anger" },
			{ id: "anger:high", name: "High Anger" },
			{ id: "anger:highest", name: "Highest Anger" },
		],
	},
	{
		id: "surprise",
		name: "Surprise",
		options: [
			{ id: "", name: "Not Selected" },
			{ id: "surprise:lowest", name: "Lowest Surprise" },
			{ id: "surprise:low", name: "Low Surprise" },
			{ id: "surprise:high", name: "High Surprise" },
			{ id: "surprise:highest", name: "Highest Surprise" },
		],
	},
	{
		id: "sadness",
		name: "Sadness",
		options: [
			{ id: "", name: "Not Selected" },
			{ id: "sadness:lowest", name: "Lowest Sadness" },
			{ id: "sadness:low", name: "Low Sadness" },
			{ id: "sadness:high", name: "High Sadness" },
			{ id: "sadness:highest", name: "Highest Sadness" },
		],
	},
	{
		id: "curiosity",
		name: "Curiosity",
		options: [
			{ id: "", name: "Not Selected" },
			{ id: "curiosity:lowest", name: "Lowest Curiosity" },
			{ id: "curiosity:low", name: "Low Curiosity" },
			{ id: "curiosity:high", name: "High Curiosity" },
			{ id: "curiosity:highest", name: "Highest Curiosity" },
		],
	},
];

// Speed options for voice controls
export const SPEEDS = [
	{ id: "slowest", name: "Slowest" },
	{ id: "slow", name: "Slow" },
	{ id: "normal", name: "Normal" },
	{ id: "fast", name: "Fast" },
	{ id: "fastest", name: "Fastest" },
];

// Formatting tips for better speech generation
export const FORMATTING_TIPS = [
	{
		id: "punct",
		title: "Punctuation",
		content:
			"Use appropriate punctuation and end each sentence with punctuation.",
	},
	{
		id: "dates",
		title: "Dates",
		content: "Format dates as MM/DD/YYYY (e.g., 04/20/2023).",
	},
	{
		id: "pauses",
		title: "Pauses",
		content:
			'Insert pauses with <break time="1s" /> or <break time="500ms" />.',
	},
	{
		id: "questions",
		title: "Questions",
		content: "Use double question marks for emphasis (e.g., 'Are you here??').",
	},
	{
		id: "urls",
		title: "URLs",
		content:
			"Add a space between URLs/emails and punctuation (e.g., 'visit example.com ?').",
	},
	{
		id: "spelling",
		title: "Spelling Out",
		content:
			"Use <spell>123-456-7890</spell> to spell out numbers or identifiers.",
	},
	{
		id: "avoid",
		title: "Avoid",
		content: "Avoid using quotation marks unless referring to a quote.",
	},
];
