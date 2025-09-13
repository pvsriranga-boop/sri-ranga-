import React from 'react';
import { BotIcon } from './Icons';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-3 my-2 flex-row animate-fade-in-up">
             <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <BotIcon />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-gray-800 text-gray-200 self-start flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse-fast"></span>
                <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse-fast" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse-fast" style={{animationDelay: '0.4s'}}></span>
            </div>
        </div>
    );
}