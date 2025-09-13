import React from 'react';
import { ChatHistory } from '../types';
import { TrashIcon, PlusIcon } from './Icons';

interface HistorySidebarProps {
  histories: ChatHistory[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isLoading: boolean;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  histories,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isLoading,
}) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent onSelectChat from firing
    if (window.confirm('Are you sure you want to delete this chat?')) {
      onDeleteChat(id);
    }
  };

  return (
    <div className="w-64 bg-gray-800/30 backdrop-blur-md border-r border-gray-700/50 flex flex-col h-full">
      <div className="p-3 border-b border-gray-700/50">
        <button
          onClick={onNewChat}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
        >
          <PlusIcon />
          New Chat
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <ul>
          {histories.map((history) => (
            <li key={history.id}>
              <button
                onClick={() => onSelectChat(history.id)}
                disabled={isLoading}
                className={`w-full text-left text-sm px-3 py-2.5 rounded-lg flex justify-between items-center group transition-colors disabled:opacity-50 ${
                  activeChatId === history.id
                    ? 'bg-gradient-to-r from-sky-500/10 via-fuchsia-600/10 to-orange-500/10 text-gray-100 font-semibold'
                    : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                <span className="truncate flex-1 pr-2">{history.title}</span>
                <span
                  onClick={(e) => handleDelete(e, history.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                  aria-label="Delete chat"
                >
                  <TrashIcon />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};