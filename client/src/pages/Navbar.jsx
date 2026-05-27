import React, { useState } from 'react';
import { MessageSquare, Users, Settings } from 'lucide-react';
import CNovaIcon from '../assets/ChatNova1.png'
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [activeTab, setActiveTab] = useState('chats');
  const navigate = useNavigate();
  // Helper to sync local state and bubble the change up to your main App container
  

  return (
    <>
      {/* 1. DESKTOP LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col items-center justify-between w-20 bg-slate-900 border-r border-slate-800 py-6 z-10 h-screen">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* App Logo Indicator */}
          <div className="h-20 w-20 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
            <img src={CNovaIcon} alt="" />
          </div>
          
          {/* Navigation Items */}
          <nav className="flex flex-col gap-4 w-full px-2">
            <button 
              onClick={() => {navigate('/chats'),setActiveTab('chats')}}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'chats' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => {navigate('/contacts'),setActiveTab('contacts')}}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'contacts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Users className="h-5 w-5" />
            </button>
          </nav>
        </div>

        {/* Global Settings Trigger */}
        <button 
          onClick={() => {navigate('/settings'),setActiveTab('settings')}}
          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Settings className="h-5 w-5" />
        </button>
      </aside>

      {/* 2. MOBILE BOTTOM NAVBAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 md:hidden flex justify-around items-center z-20 pb-safe px-4">
        <button 
          onClick={() => navigate('/chats')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'chats' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-wide">Chats</span>
        </button>
        
        <button 
          onClick={() => navigate('/contacts')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'contacts' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-wide">Contacts</span>
        </button>
        
        <button 
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-wide">Settings</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;