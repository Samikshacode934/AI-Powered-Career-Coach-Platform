import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause, AlertCircle } from 'lucide-react';
import { useVoiceChat } from '../hooks/useVoiceChat';
import { VoiceSettings } from '../services/elevenLabsService';

interface VoiceChatProps {
  onTranscriptReceived?: (transcript: string) => void;
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ 
  onTranscriptReceived, 
  onSpeakingStateChange 
}) => {
  const {
    isListening,
    isSpeaking,
    isLoading,
    transcript,
    error,
    availableVoices,
    selectedVoice,
    startListening,
    stopListening,
    speakText,
    loadVoices,
    setSelectedVoice,
    clearError,
    clearTranscript
  } = useVoiceChat();

  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true
  });

  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  useEffect(() => {
    if (transcript && onTranscriptReceived) {
      onTranscriptReceived(transcript);
    }
  }, [transcript, onTranscriptReceived]);

  useEffect(() => {
    if (onSpeakingStateChange) {
      onSpeakingStateChange(isSpeaking);
    }
  }, [isSpeaking, onSpeakingStateChange]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTestVoice = async () => {
    const testText = "Hello! I'm your AI career mentor. I'm here to help you achieve your professional goals.";
    await speakText(testText, voiceSettings);
  };

  // Helper function to get user-friendly error message
  const getErrorMessage = (error: string) => {
    if (error.includes('no-speech')) {
      return "No speech detected. Please ensure your microphone is connected, unmuted, and speak clearly into it.";
    }
    return error;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Voice AI Mentor</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{getErrorMessage(error)}</p>
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleVoiceToggle}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isListening ? 'Stop Listening' : 'Start Voice Chat'}
        </button>

        <button
          onClick={handleTestVoice}
          disabled={isSpeaking || isLoading}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isSpeaking
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          {isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isSpeaking ? 'Speaking...' : 'Test Voice'}
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900">Your Message:</h4>
            <button
              onClick={clearTranscript}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear
            </button>
          </div>
          <p className="text-blue-800">{transcript}</p>
        </div>
      )}

      {/* Voice Settings Panel */}
      {showSettings && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Voice Settings</h4>
          
          {/* Voice Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Voice
            </label>
            <select
              value={selectedVoice || ''}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableVoices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} - {voice.category}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stability: {voiceSettings.stability}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.stability}
                onChange={(e) => setVoiceSettings(prev => ({
                  ...prev,
                  stability: parseFloat(e.target.value)
                }))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Similarity: {voiceSettings.similarity_boost}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.similarity_boost}
                onChange={(e) => setVoiceSettings(prev => ({
                  ...prev,
                  similarity_boost: parseFloat(e.target.value)
                }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={voiceSettings.use_speaker_boost}
                onChange={(e) => setVoiceSettings(prev => ({
                  ...prev,
                  use_speaker_boost: e.target.checked
                }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Use Speaker Boost</span>
            </label>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isListening ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          {isListening ? 'Listening...' : 'Ready to listen'}
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isSpeaking ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {isSpeaking ? 'Speaking...' : 'Silent'}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;