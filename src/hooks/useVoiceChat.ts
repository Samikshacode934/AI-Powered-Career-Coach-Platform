import { useState, useCallback, useRef } from 'react';
import { elevenLabsService, Voice, VoiceSettings } from '../services/elevenLabsService';

interface VoiceChatState {
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  transcript: string;
  error: string | null;
  availableVoices: Voice[];
  selectedVoice: string | null;
}

interface UseVoiceChatReturn extends VoiceChatState {
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string, voiceSettings?: VoiceSettings) => Promise<void>;
  loadVoices: () => Promise<void>;
  setSelectedVoice: (voiceId: string) => void;
  clearError: () => void;
  clearTranscript: () => void;
}

export const useVoiceChat = (): UseVoiceChatReturn => {
  const [state, setState] = useState<VoiceChatState>({
    isListening: false,
    isSpeaking: false,
    isLoading: false,
    transcript: '',
    error: null,
    availableVoices: [],
    selectedVoice: null
  });

  const stopListeningRef = useRef<(() => void) | null>(null);

  const startListening = useCallback(() => {
    if (state.isListening) return;

    setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));

    const stopFn = elevenLabsService.startListening(
      (transcript) => {
        setState(prev => ({ ...prev, transcript }));
      },
      (error) => {
        setState(prev => ({ 
          ...prev, 
          error: `Speech recognition error: ${error}`, 
          isListening: false 
        }));
        stopListeningRef.current = null;
      }
    );

    stopListeningRef.current = stopFn;
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
      stopListeningRef.current = null;
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const speakText = useCallback(async (text: string, voiceSettings?: VoiceSettings) => {
    if (state.isSpeaking) return;

    setState(prev => ({ ...prev, isSpeaking: true, error: null }));

    try {
      await elevenLabsService.speakText(text, state.selectedVoice || undefined, voiceSettings);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Text-to-speech error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [state.isSpeaking, state.selectedVoice]);

  const loadVoices = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const voices = await elevenLabsService.getAvailableVoices();
      setState(prev => ({ 
        ...prev, 
        availableVoices: voices,
        selectedVoice: prev.selectedVoice || (voices.length > 0 ? voices[0].voice_id : null)
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to load voices: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const setSelectedVoice = useCallback((voiceId: string) => {
    setState(prev => ({ ...prev, selectedVoice: voiceId }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speakText,
    loadVoices,
    setSelectedVoice,
    clearError,
    clearTranscript
  };
};