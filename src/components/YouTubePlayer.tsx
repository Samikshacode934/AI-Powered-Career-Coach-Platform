import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, RotateCcw, CheckCircle, ExternalLink } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  onVideoEnd?: () => void;
  autoplay?: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  onVideoEnd,
  autoplay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle iframe load error
  const handleIframeError = () => {
    setEmbedError(true);
  };

  // Open video in new tab
  const handleOpenInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    // Mark as completed when opened externally
    setVideoEnded(true);
    setShowNextButton(true);
    onVideoEnd?.();
  };

  const handleNextLesson = () => {
    console.log('Navigate to next lesson');
  };

  const handleRewatch = () => {
    setVideoEnded(false);
    setShowNextButton(false);
    setEmbedError(false);
    // Reload the iframe
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  // Handle share functionality with proper error handling
  const handleShare = async () => {
    const shareText = `Check out this educational video: ${title}`;
    const shareUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
      } catch (error) {
        // If Web Share API fails or is denied, fall back to Twitter share
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    }
  };

  // YouTube embed URL with proper parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&modestbranding=1&showinfo=0${autoplay ? '&autoplay=1' : ''}`;

  return (
    <div className="relative bg-black rounded-t-3xl overflow-hidden">
      <div className="aspect-video relative">
        {!embedError ? (
          <>
            {/* YouTube Embed */}
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={handleIframeError}
              onLoad={() => {
                // Check if iframe loaded successfully
                setTimeout(() => {
                  if (iframeRef.current) {
                    try {
                      // Try to access iframe content to detect if it loaded
                      const iframeDoc = iframeRef.current.contentDocument;
                      if (!iframeDoc) {
                        // If we can't access content, it might be blocked
                        setEmbedError(true);
                      }
                    } catch (e) {
                      // Cross-origin error is expected, but if iframe is completely blocked, we'll handle it
                    }
                  }
                }, 2000);
              }}
            />

            {/* Video Completion Overlay */}
            {videoEnded && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Lesson Complete!</h3>
                  <p className="text-gray-300 mb-8 max-w-md">
                    Great job! You've successfully completed this lesson. Ready to move on to the next one?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleRewatch}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-medium transition-colors duration-200"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Rewatch
                    </button>
                    <button
                      onClick={handleNextLesson}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Next Lesson
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Fallback when embed fails */
          <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Video Unavailable for Embed</h3>
              <p className="text-red-100 mb-8 max-w-md">
                This video cannot be embedded directly. Click below to watch it on YouTube.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleOpenInYouTube}
                  className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-5 h-5" />
                  Watch on YouTube
                </button>
                <button
                  onClick={handleRewatch}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-medium transition-colors duration-200"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Controls Overlay */}
        {showControls && !videoEnded && !embedError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenInYouTube}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-full text-sm transition-colors duration-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  YouTube
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>YouTube Educational Content</span>
              <span>•</span>
              <span>High Quality Learning</span>
              <span>•</span>
              <span>Free Access</span>
            </div>
          </div>
          <button
            onClick={handleOpenInYouTube}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Open in YouTube
          </button>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Learning Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Take notes while watching the video</li>
          <li>• Pause and rewind if you need to review concepts</li>
          <li>• Try to apply what you learn in the upcoming quiz</li>
          <li>• Use YouTube's playback speed controls if needed</li>
          <li>• If embed doesn't work, click "Open in YouTube" button</li>
        </ul>
      </div>

      {/* Alternative Video Sources */}
      <div className="bg-gray-50 p-4">
        <h4 className="font-medium text-gray-900 mb-3">📺 Alternative Ways to Watch</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleOpenInYouTube}
            className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">YouTube</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
              alert('Video URL copied to clipboard!');
            }}
            className="flex items-center gap-2 p-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">Copy Link</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;