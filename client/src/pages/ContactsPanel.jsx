import React from "react";
import { mockContacts } from "../assets/dummydata";
import { MailIcon, User, UserIcon } from "lucide-react";

const ContactsPanel = () => {
  return (
    <div className="w-screen h-screen flex">
      <div className="flex flex-col p-2 gap-2 m-2 w-full h-auto">
        {mockContacts.map((contact) => (
          <div
            key={contact.uid}
            className="text-white gap-2 m-2 h-auto w-full rounded-full shadow-lg  bg-indigo-500/10 hover:bg-indigo-300/10 cursor-pointer"
          >
            <div className="flex flex-1 flex-col p-2 justify-center left-2">
              <div className="flex gap-2 m-2">
                <span className="flex items-center gap-2 px-2 text-xl">
                  <User size={20} color="white" />
                  {contact.name}
                </span>
              </div>
              <div className="text-xs flex px-6 gap-4">
                <p className="flex items-center px-2 gap-2 hover:text-gray-400"><MailIcon size={10}/> {contact.email}</p>●
                <p className="">{contact.status}</p>●
                <p className="">{contact.customStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPanel;
