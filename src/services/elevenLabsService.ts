interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  baseUrl: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface TextToSpeechRequest {
  text: string;
  model_id?: string;
  voice_settings?: VoiceSettings;
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Default voice
      baseUrl: 'https://api.elevenlabs.io/v1'
    };
  }

  private async initAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async getAvailableVoices(): Promise<Voice[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  async textToSpeech(
    text: string, 
    voiceId?: string,
    voiceSettings?: VoiceSettings
  ): Promise<ArrayBuffer> {
    try {
      const requestBody: TextToSpeechRequest = {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: voiceSettings || {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      };

      const response = await fetch(
        `${this.config.baseUrl}/text-to-speech/${voiceId || this.config.voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.config.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`Text-to-speech failed: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      throw error;
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      await this.initAudioContext();
      
      if (!this.audioContext) {
        throw new Error('Audio context not available');
      }

      const audioBufferDecoded = await this.audioContext.decodeAudioData(audioBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBufferDecoded;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async speakText(
    text: string, 
    voiceId?: string,
    voiceSettings?: VoiceSettings
  ): Promise<void> {
    try {
      const audioBuffer = await this.textToSpeech(text, voiceId, voiceSettings);
      await this.playAudio(audioBuffer);
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  // Speech-to-text using Web Speech API (for voice input)
  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ): () => void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const error = 'Speech recognition not supported';
      console.error(error);
      onError?.(error);
      return () => {};
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }
}

export const elevenLabsService = new ElevenLabsService();
export type { Voice, VoiceSettings };