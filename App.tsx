import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { MessageBubble } from './components/MessageBubble';
import { Message, Role } from './types';
import { streamGeminiResponse } from './services/geminiService';

const INITIAL_MESSAGE: Message = {
  id: 'intro',
  role: Role.Model,
  content: "Hello! I am a functional AI assistant powered by Gemini. How can I help you today?",
  timestamp: Date.now()
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentResponse, setCurrentResponse] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.User,
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentResponse('');

    // Create a placeholder ID for the incoming stream
    const responseId = (Date.now() + 1).toString();

    try {
      // History excluding the message we just added (to prevent duplication logic if we were managing it differently) 
      // but here we just pass the current history snapshot
      const stream = streamGeminiResponse(messages, text);
      
      let fullResponseText = '';

      for await (const chunk of stream) {
        fullResponseText += chunk;
        setCurrentResponse(fullResponseText);
      }

      // Stream finished, add final message
      const modelMessage: Message = {
        id: responseId,
        role: Role.Model,
        content: fullResponseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, modelMessage]);
      setCurrentResponse(''); // Clear streaming buffer
      
    } catch (error) {
      console.error("Failed to generate response", error);
       const errorMessage: Message = {
        id: responseId,
        role: Role.Model,
        content: "Sorry, I encountered an error while processing your request.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setIsSidebarOpen(false); // Close sidebar on mobile when starting new chat
  }, []);

  return (
    <div className="flex h-screen bg-gray-800 overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onNewChat={handleNewChat}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-full bg-white relative">
        {/* Mobile Header */}
        <div className="flex items-center p-2 text-gray-500 bg-white border-b border-gray-100 md:hidden z-10 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-gray-100"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="flex-1 text-center font-medium text-gray-700">GeminiGPT</div>
          <button onClick={handleNewChat} className="p-2 rounded-md hover:bg-gray-100">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-40 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-800">
               <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-gray-100">
                 <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
               </div>
               <h2 className="text-2xl font-semibold">GeminiGPT</h2>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {/* Live Streaming Message Bubble */}
              {isLoading && currentResponse && (
                <MessageBubble 
                  message={{
                    id: 'streaming-response',
                    role: Role.Model,
                    content: currentResponse,
                    timestamp: Date.now()
                  }} 
                />
              )}
            </>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
    </div>
  );
}