import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Chatpanel from './pages/Chatpanel' 
import ContactsPanel from './pages/ContactsPanel'
import SettingsPanel from './pages/SettingsPanel'
import ChatLayout from './pages/ChatLayout'
import EmptyChatState from './pages/EmptyChatState'
import SignInPage from './components/SignInPage'
import SignUpPage from './components/SignUpPage'
import HomePage from './pages/homePage'
import Layout from './components/Layout'

const App = () => {
  return (
    <BrowserRouter>
       
        <Routes>
          <Route path='/' element={<HomePage/>}/>

       
        
        {/* Main page viewport content area */}
          <Route element={<Layout/>}>
            
            <Route path='/sign-in/*' element={<SignInPage/>} />
            <Route path='/sign-up/*' element={<SignUpPage/>} />
            
            <Route path='/chats' element={<ChatLayout />}>
              <Route index element={<EmptyChatState />} />
              <Route path=':roomId' element={<Chatpanel />} />
            </Route>
            
            <Route path='/contacts' element={<ContactsPanel />} />
            <Route path='/settings' element={<SettingsPanel />} />
          </Route>

        </Routes>

    </BrowserRouter>
  )
}

export default App