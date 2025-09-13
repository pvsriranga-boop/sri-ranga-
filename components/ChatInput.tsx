import React, { useState, useCallback } from 'react';
import { PROMPT_SUGGESTIONS } from '../constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SendIcon, MicIcon, StopIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const PromptSuggestion: React.FC<{ text: string; onClick: (text: string) => void; disabled: boolean }> = ({ text, onClick, disabled }) => (
    <button
        onClick={() => onClick(text)}
        disabled={disabled}
        className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-700 text-gray-300 font-medium rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {text}
    </button>
);

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleTranscript = useCallback((transcript: string) => {
        setInputValue(transcript);
        if (transcript.trim()) {
            onSendMessage(transcript);
        }
    }, [onSendMessage]);

    const { isListening, toggleListening, hasSpeechRecognition } = useSpeechRecognition({ onTranscript: handleTranscript });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="p-4 bg-transparent flex-shrink-0">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
                    {PROMPT_SUGGESTIONS.map((prompt) => (
                        <PromptSuggestion key={prompt} text={prompt} onClick={onSendMessage} disabled={isLoading || isListening} />
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about campus life..."
                        disabled={isLoading || isListening}
                        className="flex-1 bg-gray-800 text-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300 disabled:opacity-70"
                    />
                     {hasSpeechRecognition && (
                         <button
                            type="button"
                            onClick={toggleListening}
                            disabled={isLoading}
                            className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all text-white disabled:bg-gray-600 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gradient-to-br from-sky-500 via-fuchsia-600 to-orange-500 hover:scale-110'}`}
                         >
                            {isListening ? <StopIcon /> : <MicIcon />}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || isListening || !inputValue.trim()}
                        className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-sky-500 via-fuchsia-600 to-orange-500 text-white rounded-full flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed hover:scale-110 transition-all active:scale-95"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};