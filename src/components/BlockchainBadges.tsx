import React, { useState } from 'react';
import { Award, ExternalLink, Download, Share2, CheckCircle, Lock, Zap } from 'lucide-react';

interface BlockchainBadgesProps {
  courseId: string;
  progress: number;
  badgeName?: string;
  certificateNFT?: string;
}

const BlockchainBadges: React.FC<BlockchainBadgesProps> = ({
  courseId,
  progress,
  badgeName,
  certificateNFT
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleMintNFT = async () => {
    setIsMinting(true);
    
    // Simulate Algorand NFT minting process
    try {
      // In a real implementation, this would call the Algorand API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transaction hash
      const mockTxHash = `ALGO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionHash(mockTxHash);
      setIsMinted(true);
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleViewOnAlgorand = () => {
    // Open Algorand explorer with transaction hash
    const explorerUrl = `https://testnet.algoexplorer.io/tx/${transactionHash}`;
    window.open(explorerUrl, '_blank');
  };

  const handleShareCredential = () => {
    // Share credential on social media
    const shareText = `I just earned my "${badgeName}" blockchain certificate! 🎓 #BlockchainEducation #PocketMentor`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  const canMintBadge = progress >= 100;

  return (
    <div className="space-y-6">
      {/* Current Badge Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Course Certificate
        </h3>
        
        {!canMintBadge ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{badgeName}</h4>
                <p className="text-gray-600 text-sm">Complete the course to unlock</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress to Certificate</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Complete all lessons and projects to earn your blockchain-verified certificate NFT
            </p>
          </div>
        ) : !isMinted ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{badgeName}</h4>
                <p className="text-green-600 text-sm font-medium">Ready to mint! 🎉</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <h5 className="font-semibold text-green-900 mb-2">🎓 Congratulations!</h5>
              <p className="text-green-800 text-sm mb-3">
                You've completed the course! Your blockchain certificate is ready to be minted as an NFT on Algorand.
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Permanently stored on Algorand blockchain</li>
                <li>• Verifiable by employers and institutions</li>
                <li>• Transferable and shareable</li>
                <li>• No gas fees on Algorand</li>
              </ul>
            </div>
            
            <button
              onClick={handleMintNFT}
              disabled={isMinting}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                isMinting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {isMinting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Minting NFT...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Mint Certificate NFT
                </div>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{badgeName}</h4>
                <p className="text-green-600 text-sm font-medium">Minted Successfully! ✨</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <h5 className="font-semibold text-blue-900 mb-2">🔗 Blockchain Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Network:</span>
                  <span className="text-blue-900 font-medium">Algorand Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Transaction:</span>
                  <span className="text-blue-900 font-mono text-xs">{transactionHash?.slice(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Status:</span>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewOnAlgorand}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                View on Chain
              </button>
              <button
                onClick={handleShareCredential}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        )}
      </div>

      {/* My Badges Collection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">My Blockchain Badges</h3>
        
        <div className="space-y-3">
          {/* Earned Badge */}
          {isMinted && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{badgeName}</h4>
                <p className="text-xs text-green-600">Minted on Algorand</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
          
          {/* Future Badges */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-500">Advanced ML Specialist</h4>
              <p className="text-xs text-gray-400">Complete advanced courses</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-500">Data Science Master</h4>
              <p className="text-xs text-gray-400">Complete 5 data science courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
        <h4 className="font-bold text-purple-900 mb-3">🔗 Why Blockchain Certificates?</h4>
        <ul className="space-y-2 text-purple-800 text-sm">
          <li>• <strong>Tamper-proof:</strong> Cannot be forged or altered</li>
          <li>• <strong>Instantly verifiable:</strong> Employers can verify authenticity</li>
          <li>• <strong>Portable:</strong> Own your credentials forever</li>
          <li>• <strong>Global recognition:</strong> Accepted worldwide</li>
          <li>• <strong>No fees:</strong> Algorand's eco-friendly blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default BlockchainBadges;