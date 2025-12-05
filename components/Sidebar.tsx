import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNewChat, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-[260px] bg-gray-900 text-gray-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors text-sm text-white text-left"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Today</div>
          <div className="flex flex-col gap-2">
            {/* Mock History Items */}
            <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-100 rounded-md hover:bg-gray-800 overflow-hidden text-left transition-colors truncate">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span className="truncate">Designing a UI Layout</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-3 text-sm text-gray-100 rounded-md hover:bg-gray-800 overflow-hidden text-left transition-colors truncate">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span className="truncate">React Component Structure</span>
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-gray-700">
           <button className="flex items-center gap-3 px-3 py-3 w-full text-sm hover:bg-gray-800 rounded-md transition-colors text-left">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="font-medium">User Account</div>
           </button>
        </div>
      </div>
    </>
  );
};