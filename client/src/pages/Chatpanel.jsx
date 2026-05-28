import React, { useEffect, useRef, useState } from "react";

// ── Mock data (replace with your ../assets/dummydata imports) ────────────────
const mockCurrentUser = { uid: "user-1", name: "You" };

const mockRooms = [
  {
    id: "room-1",
    name: "# general",
    lastMessage: { content: "Hey, how's it going?", createdAt: "10:42 AM" },
  },
  {
    id: "room-2",
    name: "# design",
    lastMessage: { content: "Pushed the new mockups", createdAt: "9:15 AM" },
  },
  {
    id: "room-3",
    name: "# dev-team",
    lastMessage: { content: "PR is ready for review", createdAt: "Yesterday" },
  },
];

const mockMessages = [
  {
    id: "m1",
    roomId: "room-1",
    userId: "user-2",
    senderName: "Alice",
    content: "Hey! How's it going?",
    createdAt: "10:40 AM",
  },
  {
    id: "m2",
    roomId: "room-1",
    userId: "user-1",
    senderName: "You",
    content: "Pretty good! Just finishing up the chat UI.",
    createdAt: "10:41 AM",
  },
  {
    id: "m3",
    roomId: "room-1",
    userId: "user-2",
    senderName: "Alice",
    content: "Nice, looking forward to seeing it 🎉",
    createdAt: "10:42 AM",
  },
  {
    id: "m4",
    roomId: "room-2",
    userId: "user-3",
    senderName: "Bob",
    content: "Pushed the new mockups to Figma, take a look!",
    createdAt: "9:15 AM",
  },
  {
    id: "m5",
    roomId: "room-2",
    userId: "user-1",
    senderName: "You",
    content: "Looks great, loving the new color system.",
    createdAt: "9:18 AM",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const Chatpanel = () => {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const activeRoom = mockRooms.find((room) => room.id === activeRoomId);
  const filteredMessages = messages.filter((msg) => msg.roomId === activeRoomId);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages.length, activeRoomId]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || !activeRoomId) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      roomId: activeRoomId,
      userId: mockCurrentUser.uid,
      senderName: mockCurrentUser.name,
      content: trimmed,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  return (
    <div className="h-screen flex w-full bg-indigo-950 font-sans">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-80 flex flex-col h-full bg-indigo-900/60 border-r border-indigo-700/40 backdrop-blur-sm">
        {/* Sidebar header */}
        <div className="px-5 py-4 border-b border-indigo-700/40">
          <h2 className="text-white font-semibold text-lg tracking-tight">
            Messages
          </h2>
          <p className="text-indigo-300/60 text-xs mt-0.5">
            {mockRooms.length} channels
          </p>
        </div>

        {/* Room list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {mockRooms.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full text-left rounded-xl px-3 py-3 transition-all duration-150 group ${
                  isActive
                    ? "bg-indigo-600 shadow-lg shadow-indigo-900/60"
                    : "hover:bg-indigo-800/50"
                }`}
              >
                <div
                  className={`font-medium text-sm truncate ${
                    isActive ? "text-white" : "text-indigo-200"
                  }`}
                >
                  {room.name}
                </div>
                <div className="flex items-center justify-between mt-0.5 gap-2">
                  <p
                    className={`text-xs truncate ${
                      isActive ? "text-indigo-200" : "text-indigo-400"
                    }`}
                  >
                    {room.lastMessage.content}
                  </p>
                  <span
                    className={`text-[10px] whitespace-nowrap shrink-0 ${
                      isActive ? "text-indigo-300" : "text-indigo-500"
                    }`}
                  >
                    {room.lastMessage.createdAt}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Current user badge */}
        <div className="px-4 py-3 border-t border-indigo-700/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {mockCurrentUser.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {mockCurrentUser.name}
            </p>
            <p className="text-indigo-400 text-xs">Online</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        </div>
      </aside>

      {/* ── Main panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeRoom ? (
          <>
            {/* Channel header */}
            <header className="px-6 py-4 border-b border-indigo-700/40 bg-indigo-900/40 backdrop-blur-sm flex items-center gap-3 shrink-0">
              <div>
                <h1 className="text-white font-semibold">{activeRoom.name}</h1>
                <p className="text-indigo-400 text-xs mt-0.5">
                  {filteredMessages.length} message
                  {filteredMessages.length !== 1 ? "s" : ""}
                </p>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => {
                  const isMe = msg.userId === mockCurrentUser.uid;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] ${
                        isMe ? "self-end items-end ml-auto" : "self-start items-start"
                      }`}
                    >
                      {/* Sender + timestamp */}
                      <div className="flex items-center gap-2 mb-1 px-1">
                        {!isMe && (
                          <span className="text-xs font-semibold text-indigo-300">
                            {msg.senderName}
                          </span>
                        )}
                        <span className="text-[10px] text-indigo-500">
                          {msg.createdAt}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-tr-sm"
                            : "bg-indigo-800/70 text-indigo-100 rounded-tl-sm border border-indigo-700/40"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2 py-20">
                  <div className="w-12 h-12 rounded-full bg-indigo-800/60 flex items-center justify-center mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-indigo-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </div>
                  <p className="text-indigo-300 font-medium text-sm">
                    No messages yet
                  </p>
                  <p className="text-indigo-500 text-xs max-w-xs">
                    Be the first to say something in {activeRoom.name}
                  </p>
                </div>
              )}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="px-6 py-4 border-t border-indigo-700/40 bg-indigo-900/40 backdrop-blur-sm shrink-0">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-3 bg-indigo-800/60 border border-indigo-700/50 rounded-2xl px-4 py-2.5 focus-within:border-indigo-500 transition-colors"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Message ${activeRoom.name}`}
                  className="flex-1 bg-transparent text-white placeholder-indigo-500 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="text-indigo-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* No room selected */
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-800/50 border border-indigo-700/40 flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-8 h-8 text-indigo-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-base">
              Select a channel
            </h2>
            <p className="text-indigo-400 text-sm max-w-xs">
              Pick a conversation from the sidebar to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatpanel;