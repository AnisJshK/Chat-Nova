import React, { useState } from "react";
import { mockRooms, mockMessages, mockCurrentUser } from "../assets/dummydata"; // Adjust path as needed

const Chatpanel = () => {
  const [activeRoomId, setActiveRoomId] = useState(mockRooms[0]?.id);
  const [newMessage, setNewMessage] = useState("");

  const activeRoom = mockRooms.find((room) => room.id === activeRoomId);

  // 3. Filter messages dynamically to only show ones matching the selected room's ID
  const filteredMessages = mockMessages.filter(
    (msg) => msg.roomId === activeRoomId
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real application, you would fire a Firebase/database function here
    console.log("Sending message:", newMessage, "to room:", activeRoomId);
    setNewMessage("");
  };

  return (
    <div className="h-screen w-full flex bg-[#0a0b10] overflow-hidden font-sans">
      
      <aside className="w-96 h-full bg-indigo-600 flex flex-col p-4 m-2 rounded-2xl shrink-0 shadow-2xl">
        <div className="text-white text-2xl font-bold mb-4 px-2 flex justify-between items-center">
          <span>Chats</span>
          <span className="text-xs bg-indigo-500 px-2.5 py-1 rounded-full font-normal">
            Beta View
          </span>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
          {mockRooms.map((room) => {
            const isSelected = activeRoomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`flex flex-col rounded-2xl p-4 cursor-pointer transition-all border-0 shadow-md relative
                  ${isSelected
                    ? "bg-[#2b1db1] text-white shadow-blue-900/40 scale-[0.99]"
                    : "bg-indigo-800 text-white/90 hover:bg-indigo-700/80"
                  }
                `}
              >

                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-base truncate pr-2">{room.name}</h3>
                  {room.unreadCount > 0 && !isSelected && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center shrink-0">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 generic-card-row">
                  <p className="text-sm truncate opacity-75 flex-1">
                    <span className="font-medium">{room.lastMessage.senderName}:</span>{" "}
                    {room.lastMessage.content}
                  </p>
                  <span className="text-xs text-indigo-200 opacity-90 whitespace-nowrap shrink-0">
                    {room.lastMessage.createdAt}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ================= RIGHT PANEL CHAT WINDOW ================= */}
      <main className="flex-1 h-full p-4 flex flex-col min-w-0">
        {activeRoom ? (
          <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-gray-800/60 overflow-hidden">
            
            {/* Chat Top Header Row */}
            <div className="border-b border-gray-800/80 bg-slate-900/80 px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">{activeRoom.name}</h1>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Active Session
                </p>
              </div>
            </div>

            {/* Render Selected Dynamic Room Message Thread */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#0d0e14]">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => {
                  // Determine if the message sender is the logged-in user
                  const isMe = msg.userId === mockCurrentUser.uid;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] ${
                        isMe ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      {/* Sender metadata banner */}
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 px-1">
                        {!isMe && <span className="font-semibold text-indigo-300">{msg.senderName}</span>}
                        <span>{msg.createdAt}</span>
                      </div>

                      {/* Bubble Text Styling */}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-slate-800 text-gray-100 rounded-tl-none"
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
                  <p className="text-xs text-gray-600 max-w-xs text-center">
                    Messages array contains items keyed exclusively for "Alice Smith" (room_id_beta) right now.
                  </p>
                </div>
              )}
            </div>

            {/* Input Message Dispatcher */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/90 border-t border-gray-800/80 flex gap-3 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${activeRoom.name}...`}
                className="flex-1 bg-slate-950 text-white text-sm rounded-xl px-4 py-3 border border-gray-800 outline-none focus:border-indigo-500 transition-colors placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Send
              </button>
            </form>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-slate-900/10 rounded-2xl border border-dashed border-gray-800">
            <p className="text-lg font-semibold">No Conversation Selected</p>
            <p className="text-sm text-gray-500">Pick an active card out of your sidebar list to begin</p>
          </div>
        )}
      </main>

    </div>
  );
};

export default Chatpanel;