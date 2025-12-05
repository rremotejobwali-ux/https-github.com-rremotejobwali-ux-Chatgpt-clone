import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.User;

  return (
    <div className={`w-full text-gray-800 border-b border-black/5 dark:border-white/5 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto flex gap-4 p-4 md:py-6 lg:px-0 m-auto">
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${isUser ? 'bg-gray-500' : 'bg-green-500'}`}>
            {isUser ? (
               <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            ) : (
              <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"></path>
                <path d="m12 16 4-4-4-4"></path>
                <path d="M8 12h8"></path>
              </svg>
            )}
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden break-words">
          <div className="prose prose-slate max-w-none text-base leading-7 whitespace-pre-wrap">
            {message.content}
          </div>
          {message.isError && (
            <div className="text-red-500 text-sm mt-2">
              Failed to send message. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};