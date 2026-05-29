import React, { useState } from "react";
import { mockContacts,mockRooms } from "../assets/dummydata";
import { MailIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactsPanel = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState();

  return (
    <div className="w-screen h-screen flex bg-slate-900"> {/* Added a dark background so white text is visible */}
      <div className="flex flex-col p-2 gap-2 m-2 w-full max-w-md h-auto">
        {mockContacts.map((contact) => (
          <div
            key={contact.uid}
            className="text-white gap-2 m-2 h-auto rounded-xl shadow-lg bg-indigo-500/10 hover:bg-indigo-300/10 cursor-pointer transition-colors"
            onClick={() => navigate(`/chats/${contact.uid}`)} // Fixed route path here
          >
            <div className="flex flex-col p-4 justify-center">
              <div className="flex gap-2 mb-1">
                <span className="flex items-center gap-2 text-xl font-medium">
                  <User size={20} color="white" />
                  {contact.name}
                </span>
              </div>
              <div className="text-xs flex items-center text-gray-400 gap-3 mt-1">
                <p className="flex items-center gap-1 hover:text-white transition-colors">
                  <MailIcon size={12} /> {contact.email}
                </p>
                <span>•</span>
                <p className="text-indigo-400">{contact.status}</p>
                <span>•</span>
                <p className="italic">{contact.customStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPanel;