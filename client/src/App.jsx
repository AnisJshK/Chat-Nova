import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatpanel from "./pages/Chatpanel";
import ContactsPanel from "./pages/ContactsPanel";
import ChatLayout from "./pages/ChatLayout";
import EmptyChatState from "./components/EmptyChatState";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  const { user } = useUser();
  return (
    <BrowserRouter>
    
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
      
        
          {/* Main page viewport content area */}
          <Route element={user ? <Layout /> : <Navigate to="/" replace />}>
            <Route path="/chats" element={<ChatLayout />}>
              <Route index element={<EmptyChatState />} />
              <Route path=":roomId" element={<Chatpanel />} />
            </Route>

            <Route path="/contacts" element={<ContactsPanel />} />
          </Route>
        </Routes>

    </BrowserRouter>
  );
};

export default App;
