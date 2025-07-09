
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { IconButton } from './components/IconButton';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';
import { StopIcon } from './components/icons/StopIcon';
import { CopyIcon } from './components/icons/CopyIcon';
import { TrashIcon } from './components/icons/TrashIcon';

const App: React.FC = () => {
  const {
    text,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasRecognitionSupport,
    error,
  } = useSpeechRecognition({ lang: 'bn-BD' });

  const [copyStatus, setCopyStatus] = useState<string>('');

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => setCopyStatus(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyStatus('Copied to clipboard!');
      })
      .catch(() => {
        setCopyStatus('Failed to copy text.');
      });
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getStatusMessage = (): string => {
    if (error) return error;
    if (copyStatus) return copyStatus;
    if (isListening) return "শুনছি...";
    return "মাইক্রোফোন ক্লিক করে কথা বলা শুরু করুন";
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Bangla Voice Typing
          </h1>
          <p className="text-lg text-indigo-200 mt-2">সহজেই ভয়েস দিয়ে বাংলা টাইপ করুন</p>
        </div>

        {!hasRecognitionSupport ? (
          <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Your browser does not support Speech Recognition. Please try Google Chrome.</span>
          </div>
        ) : (
          <div className="bg-black bg-opacity-30 p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
            <div className="relative">
              <textarea
                value={text}
                readOnly
                placeholder="আপনার বলা কথা এখানে প্রদর্শিত হবে..."
                className="w-full h-64 bg-gray-900 bg-opacity-70 border-2 border-gray-600 focus:border-indigo-500 focus:ring-0 rounded-lg p-4 text-lg text-gray-100 placeholder-gray-500 transition-colors duration-300 resize-none"
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center h-6 text-indigo-300 transition-opacity duration-300">
                {getStatusMessage()}
              </div>

              <div className="flex items-center gap-4">
                <IconButton
                  onClick={handleCopy}
                  disabled={!text}
                  className="bg-gray-700 hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <CopyIcon />
                </IconButton>
                <IconButton
                  onClick={resetText}
                  disabled={!text}
                  className="bg-gray-700 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <TrashIcon />
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>
       <button
        onClick={handleMicClick}
        disabled={!hasRecognitionSupport}
        className={`fixed bottom-8 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
          ${isListening 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {isListening ? <StopIcon /> : <MicrophoneIcon />}
      </button>
    </div>
  );
};

export default App;