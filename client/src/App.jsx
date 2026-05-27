import React from 'react'
import Navbar from './pages/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Chatpanel from './pages/Chatpanel'
import ContactsPanel from './pages/ContactsPanel'
import SettingsPanel from './pages/SettingsPanel'

const App = () => {
  return (
    <div className="flex h-screen w-screen flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      
      <Navbar />
      
      {/* Main page viewport content area */}
      <div className="flex-1 h-full overflow-hidden pb-16 md:pb-0">
        <Routes>
          {/* Catch empty '/' path and redirect them straight to /chats */}
          {/* <Route path="/" element={<Navigate to="/chats" replace />} /> */}
          
          <Route path='/chats' element={<Chatpanel />} />
          <Route path='/contacts' element={<ContactsPanel />} />
          <Route path='/settings' element={<SettingsPanel />} />
        </Routes>
      </div>

    </div>
  )
}

export default App