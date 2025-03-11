'use server';

import { Cartesia } from "@cartesia/cartesia-js";
import { CartesiaClient } from "@cartesia/cartesia-js/Client";

export async function speak(formData: FormData): Promise<ArrayBuffer | null> {
    const text = formData.get('text') as string;
    const model = formData.get('model') as string || 'sonic-2';
    const language = formData.get('language') as Cartesia.SupportedLanguage || 'en';
    const apiKey = process.env.CARTESIA_API_KEY;
    
    // Get emotion and speed settings
    const emotions: Cartesia.Emotion[] = [];
    if (formData.get('emotionPositivity')) emotions.push(formData.get('emotionPositivity') as Cartesia.Emotion);
    if (formData.get('emotionAnger')) emotions.push(formData.get('emotionAnger') as Cartesia.Emotion);
    if (formData.get('emotionSurprise')) emotions.push(formData.get('emotionSurprise') as Cartesia.Emotion);
    if (formData.get('emotionSadness')) emotions.push(formData.get('emotionSadness') as Cartesia.Emotion);
    if (formData.get('emotionCuriosity')) emotions.push(formData.get('emotionCuriosity') as Cartesia.Emotion);
    
    // Default to positivity:high if no emotions selected
    if (emotions.length === 0) {
        emotions.push(Cartesia.Emotion.PositivityHigh);
    }
    
    // Get speed setting
    const speed = formData.get('speed') as Cartesia.NaturalSpecifier || 'normal';

    if (!text) {
        console.error('No text provided');
        return null;
    }

    if (!apiKey) {
        console.error('API key not found');
        return null;
    }

    try {
        const cartesia = new CartesiaClient({ apiKey });

        return await cartesia.tts.bytes({
            modelId: model,
            transcript: text,
            voice: {
                mode: "id",
                id: "a0e99841-438c-4a64-b679-ae501e7d6091",
                experimentalControls: {
                    emotion: emotions,
                    speed: speed,
                }
            },
            language: language,
            outputFormat: {
                container: "mp3",
                sampleRate: 44100,
                bitRate: 128000,  
            },
        });
    } catch (error) {
        console.error('Error calling Cartesia API:', error);
        return null;
    }
}
