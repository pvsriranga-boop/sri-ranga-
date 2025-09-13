import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isReceivingResponse = isLoading && messages.length > 0 && messages[messages.length - 1].role === MessageRole.MODEL;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
            <Message key={index} message={msg} />
        ))}
        {isReceivingResponse && <TypingIndicator />}
        <div ref={scrollRef} />
    </div>
  );
};
