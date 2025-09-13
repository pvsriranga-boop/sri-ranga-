import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import { UserIcon, BotIcon, WarningIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isError = message.isError;

  let messageClasses = '';
  if (isError) {
    messageClasses = 'bg-red-900/50 text-red-300 border border-red-500/50 self-start';
  } else if (isUser) {
    messageClasses = 'bg-purple-600 text-white self-end';
  } else {
    messageClasses = 'bg-white text-gray-800 border border-purple-300 shadow-md self-start';
  }

  const containerClasses = isUser ? 'flex-row-reverse' : 'flex-row';

  const Icon = () => {
    if (isError) {
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-900/50 text-red-300">
          <WarningIcon />
        </div>
      );
    }

    const iconClasses = isUser ? 'bg-purple-600 text-white' : 'bg-gray-700';

    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconClasses}`}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
    );
  };

  return (
    <div className={`flex items-start gap-3 my-2 ${containerClasses} animate-fade-in-up`}>
      <Icon />
      <div
        className={`px-4 py-3 rounded-2xl max-w-lg md:max-w-xl lg:max-w-2xl whitespace-pre-wrap ${messageClasses}`}
      >
        {message.text}
      </div>
    </div>
  );
};
