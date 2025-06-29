import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Download, Share2, Maximize, RotateCcw, ExternalLink } from 'lucide-react';
import { tavusService, TavusVideoResponse } from '../services/tavusService';

interface AIVideoPlayerProps {
  lessonTitle: string;
  courseTitle: string;
  content: string;
  personaId?: string;
  onVideoComplete?: () => void;
}

const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({
  lessonTitle,
  courseTitle,
  content,
  personaId,
  onVideoComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoData, setVideoData] = useState<TavusVideoResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const generateVideo = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate video using Tavus API
      const videoResponse = await tavusService.generateCourseVideo(
        courseTitle,
        lessonTitle,
        content,
        personaId
      );
      
      // Wait for video completion
      const completedVideo = await tavusService.waitForVideoCompletion(videoResponse.video_id);
      
      setVideoData(completedVideo);
    } catch (error) {
      console.error('Error generating video:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onVideoComplete?.();
  };

  const handleDownload = () => {
    if (videoData?.video_url) {
      window.open(videoData.video_url, '_blank');
    }
  };

  const handleShare = async () => {
    const shareText = `Check out this AI-generated lesson: ${lessonTitle}`;
    const shareUrl = videoData?.video_url || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Video URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Video URL copied to clipboard!');
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', handleVideoLoad);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoLoad);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [videoData]);

  if (!tavusService.isConfigured()) {
    return (
      <div className="aspect-video bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-3">AI Video Generation</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Configure Tavus API to enable AI-generated video lectures
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              Add <code className="bg-blue-100 px-2 py-1 rounded">VITE_TAVUS_API_KEY</code> to your .env file
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!videoData && !isGenerating) {
    return (
      <div className="aspect-video bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-3">AI-Generated Video Lecture</h3>
          <p className="text-purple-100 mb-6 max-w-md">
            Generate a personalized video lecture with an AI instructor using Tavus technology
          </p>
          <button
            onClick={generateVideo}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Generate AI Video Lecture
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="aspect-video bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold mb-2">Generating Your AI Video...</h3>
          <p className="text-purple-100">
            Our AI is creating a personalized lecture with Tavus technology. This may take a few minutes.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center">
        <div className="text-center text-red-700">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Generation Failed</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={generateVideo}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        src={videoData?.video_url}
        poster={videoData?.thumbnail_url}
        className="w-full aspect-video"
        onClick={togglePlay}
      />
      
      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="w-full bg-white/20 rounded-full h-1 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              handleSeek(newTime);
            }}
          >
            <div
              className="bg-purple-500 h-1 rounded-full transition-all duration-200"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-purple-400 transition-colors duration-200"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-purple-400 transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-3 min-w-32">
                  <div className="text-white text-sm mb-2">Playback Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors duration-200 ${
                        playbackSpeed === speed
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleDownload}
              className="text-white hover:text-purple-400 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
            </button>

            <button 
              onClick={handleShare}
              className="text-white hover:text-purple-400 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button className="text-white hover:text-purple-400 transition-colors duration-200">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tavus Branding */}
      <div className="absolute top-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Powered by Tavus AI</span>
        </div>
      </div>
    </div>
  );
};

export default AIVideoPlayer;