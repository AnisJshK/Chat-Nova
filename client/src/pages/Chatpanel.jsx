import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { mockRooms, mockMessages, mockCurrentUser } from "../assets/dummydata";

const Chatpanel = () => {
  const { roomId } = useParams();
  const [newMessage, setNewMessage] = useState("");

  const activeRoom = mockRooms.find((room) => room.id === roomId);
  const filteredMessages = mockMessages.filter((msg) => msg.roomId === roomId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage, "to room:", roomId);
    setNewMessage("");
  };

  if (!activeRoom) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-slate-900/10 rounded-2xl border border-dashed border-gray-800">
        <p className="text-lg font-semibold">Conversation Not Found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-gray-800/60 overflow-hidden">
      {/* Top Header */}
      <div className="border-b border-gray-800/80 bg-slate-900/80 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">{activeRoom.name}</h1>
          <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Active Session
          </p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#0d0e14]">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => {
            const isMe = msg.userId === mockCurrentUser.uid;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 px-1">
                  {!isMe && <span className="font-semibold text-indigo-300">{msg.senderName}</span>}
                  <span>{msg.createdAt}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words ${
                    isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-800 text-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <p className="text-base font-medium">No active thread data logged</p>
          </div>
        )}
      </div>

      {/* Message Box */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/90 border-t border-gray-800/80 flex gap-3 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message ${activeRoom.name}...`}
          className="flex-1 bg-slate-950 text-white text-sm rounded-xl px-4 py-3 border border-gray-800 outline-none focus:border-indigo-500 transition-colors placeholder-gray-500"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-5 py-3 rounded-xl transition-colors">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatpanel;