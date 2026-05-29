import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './pages/Navbar'
import Chatpanel from './pages/Chatpanel' 
import ContactsPanel from './pages/ContactsPanel'
import SettingsPanel from './pages/SettingsPanel'
import ChatLayout from './pages/ChatLayout'
import EmptyChatState from './pages/EmptyChatState'

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
        
        <Navbar />
        
        {/* Main page viewport content area */}
        <div className="flex-1 h-full overflow-hidden pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Navigate to="/chats" replace />} />
            
            <Route path='/chats' element={<ChatLayout />}>
              <Route index element={<EmptyChatState />} />
              <Route path=':roomId' element={<Chatpanel />} />
            </Route>
            
            <Route path='/contacts' element={<ContactsPanel />} />
            <Route path='/settings' element={<SettingsPanel />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}

export default App