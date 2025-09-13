import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chat } from '@google/genai';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { HistorySidebar } from './components/HistorySidebar';
import { startChat } from './services/geminiService';
import { ChatMessage, MessageRole, ChatHistory } from './types';

const App: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [histories, setHistories] = useState<ChatHistory[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const initialMessage: ChatMessage = {
        role: MessageRole.MODEL,
        text: "Hello! I'm Smart Campus Assistant. How can I help you navigate Malla Reddy University today?"
    };

    // Load histories from localStorage on initial render
    useEffect(() => {
        try {
            const savedHistories = localStorage.getItem('chatHistories');
            if (savedHistories) {
                setHistories(JSON.parse(savedHistories));
            }
            setChat(startChat());
        } catch (error) {
            console.error("Failed to initialize chat or load history:", error);
            // Handle error state if needed
        }
    }, []);

    // Save histories to localStorage whenever they change
    const saveHistories = (updatedHistories: ChatHistory[]) => {
        setHistories(updatedHistories);
        localStorage.setItem('chatHistories', JSON.stringify(updatedHistories));
    };

    const activeChatMessages = useMemo(() => {
        if (!activeChatId) {
            return [initialMessage];
        }
        const activeHistory = histories.find(h => h.id === activeChatId);
        return activeHistory ? activeHistory.messages : [initialMessage];
    }, [activeChatId, histories]);


    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!chat || isLoading || !messageText.trim()) return;

        const userMessage: ChatMessage = { role: MessageRole.USER, text: messageText };
        setIsLoading(true);

        let currentChatId = activeChatId;
        let updatedHistories = [...histories];
        let baseMessages = activeChatMessages;

        if (!currentChatId) {
            const newChat: ChatHistory = {
                id: Date.now().toString(),
                title: messageText.length > 30 ? `${messageText.substring(0, 27)}...` : messageText,
                messages: [initialMessage, userMessage],
            };
            updatedHistories = [newChat, ...updatedHistories];
            currentChatId = newChat.id;
            setActiveChatId(currentChatId);
            baseMessages = newChat.messages;
        } else {
            updatedHistories = updatedHistories.map(h =>
                h.id === currentChatId ? { ...h, messages: [...h.messages, userMessage] } : h
            );
            baseMessages.push(userMessage);
        }
        saveHistories(updatedHistories);
        
        const modelMessage: ChatMessage = { role: MessageRole.MODEL, text: "" };
        updatedHistories = updatedHistories.map(h => 
            h.id === currentChatId ? { ...h, messages: [...baseMessages, modelMessage] } : h
        );
        saveHistories(updatedHistories);

        try {
            const result = await chat.sendMessageStream({ message: messageText });
            
            let currentResponse = "";
            for await (const chunk of result) {
                currentResponse += chunk.text;
                const finalHistories = histories.map(h => {
                    if (h.id === currentChatId) {
                        const newMessages = [...h.messages];
                        newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: currentResponse };
                        return { ...h, messages: newMessages };
                    }
                    return h;
                });
                setHistories(finalHistories);
            }
            
            // Save final state after stream ends
            const finalHistories = histories.map(h => {
                 if (h.id === currentChatId) {
                    const newMessages = [...h.messages];
                    newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: currentResponse };
                    return { ...h, messages: newMessages };
                }
                return h;
            });
            saveHistories(finalHistories);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = {
                role: MessageRole.MODEL,
                text: "I'm sorry, but I encountered an error with the AI service. Please check your connection or try again later.",
                isError: true,
            };
            const finalHistories = histories.map(h => {
                if (h.id === currentChatId) {
                    const newMessages = [...h.messages];
                    // Replace the empty streaming message with the error message
                    newMessages[newMessages.length - 1] = errorMessage; 
                    return { ...h, messages: newMessages };
                }
                return h;
            });
            saveHistories(finalHistories);
        } finally {
            setIsLoading(false);
        }
    }, [chat, isLoading, activeChatId, histories]);

    const handleNewChat = () => {
        setActiveChatId(null);
    };
    
    const handleDeleteChat = (chatId: string) => {
        const updatedHistories = histories.filter(h => h.id !== chatId);
        saveHistories(updatedHistories);
        if (activeChatId === chatId) {
            setActiveChatId(null);
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 flex font-sans overflow-hidden">
            <HistorySidebar 
                histories={histories}
                activeChatId={activeChatId}
                onNewChat={handleNewChat}
                onSelectChat={setActiveChatId}
                onDeleteChat={handleDeleteChat}
                isLoading={isLoading}
            />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
                     <ChatWindow messages={activeChatMessages} isLoading={isLoading} />
                     <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </main>
            </div>
        </div>
    );
};

export default App;