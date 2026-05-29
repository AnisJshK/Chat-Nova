import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Phone, Search, MoreVertical,
  Paperclip, Smile, Send,
  CheckCheck, MessageSquareDashed,
} from "lucide-react";
import { mockRooms, mockMessages, mockCurrentUser } from "../assets/dummydata";

const AVATAR_PALETTES = [
  { bg: "bg-indigo-950",  text: "text-indigo-300" },
  { bg: "bg-blue-950",    text: "text-blue-300"   },
  { bg: "bg-violet-950",  text: "text-violet-300" },
  { bg: "bg-teal-950",    text: "text-teal-300"   },
  { bg: "bg-amber-950",   text: "text-amber-300"  },
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const Chatpanel = () => {
  const { roomId } = useParams();
  const [newMessage, setNewMessage]     = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const activeRoom  = mockRooms.find((r) => r.id === roomId);
  const roomIndex   = mockRooms.findIndex((r) => r.id === roomId);
  const palette     = AVATAR_PALETTES[roomIndex % AVATAR_PALETTES.length];
  const baseMessages = mockMessages.filter((m) => m.roomId === roomId);
  const allMessages  = [...baseMessages, ...localMessages];

  useEffect(() => { setLocalMessages([]); }, [roomId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [allMessages]);

  const handleSend = (e) => {
    e?.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        roomId,
        userId: mockCurrentUser.uid,
        senderName: "You",
        content: text,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setNewMessage("");
    inputRef.current?.focus();
  };

  /* ── not found ── */
  if (!activeRoom) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3
                      bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
        <MessageSquareDashed size={32} className="text-white/20" />
        <p className="text-[15px] font-medium text-white/40">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0f18]">

      {/* ══════════════ HEADER ══════════════ */}
      <header className="flex items-center justify-between px-5 py-3.5
                         bg-[#0d0f18]/95 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          {/* room avatar */}
          <div className={`w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center
                           text-[13px] font-semibold ${palette.bg} ${palette.text}`}>
            {getInitials(activeRoom.name)}
          </div>

          <div>
            <p className="text-[15px] font-semibold text-white tracking-tight leading-none mb-1">
              {activeRoom.name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400
                               animate-[statusPulse_2s_ease-in-out_infinite] shrink-0" />
              <span className="text-[12px] text-emerald-400">Active session</span>
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex items-center gap-1">
          {[
            { icon: Search,       label: "Search messages" },
            { icon: Phone,        label: "Call"            },
            { icon: MoreVertical, label: "More options"    },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              aria-label={label}
              className="w-8 h-8 rounded-[9px] flex items-center justify-center
                         text-white/40 border-none bg-transparent cursor-pointer
                         hover:bg-white/[0.08] hover:text-white/85
                         transition-all duration-150"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </header>

      {/* ══════════════ MESSAGES ══════════════ */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 flex flex-col
                      scrollbar-thin scrollbar-thumb-white/[0.08] scrollbar-track-transparent">

        {/* date divider */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-white/25 font-mono tracking-wider">Today</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {allMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <MessageSquareDashed size={28} className="text-white/20" />
            <p className="text-[13.5px] text-white/30">No messages yet — say hi!</p>
          </div>
        ) : (
          allMessages.map((msg, i) => {
            const isMe       = msg.userId === mockCurrentUser.uid;
            const prevMsg    = allMessages[i - 1];
            const isLastMsg  = i === allMessages.length - 1;
            const showLabel  = !isMe && (!prevMsg || prevMsg.userId !== msg.userId);

            return (
              <div
                key={msg.id}
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                className={`flex flex-col gap-0.5 mb-1.5
                            animate-[msgIn_0.22s_ease-out_both]
                            ${isMe ? "items-end" : "items-start"}`}
              >
                {/* sender label */}
                {showLabel && (
                  <div className="flex items-center gap-1.5 px-1 mb-1">
                    <span className="text-[12px] font-medium text-indigo-400">
                      {msg.senderName}
                    </span>
                    <span className="text-[11px] text-white/25 font-mono">
                      {msg.createdAt}
                    </span>
                  </div>
                )}

                {/* bubble */}
                <div
                  className={`
                    relative max-w-[68%] px-3.5 py-2.5
                    text-[13.5px] leading-relaxed break-words
                    active:scale-[0.98] transition-transform duration-100 cursor-default
                    ${isMe
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-2xl rounded-tr-[4px] shadow-[0_2px_12px_rgba(80,70,229,0.3)]"
                      : "bg-[#1e2138] text-white/88 rounded-2xl rounded-tl-[4px] border border-white/[0.06]"
                    }
                  `}
                >
                  {/* tail */}
                  <span
                    className={`absolute top-0 w-2.5 h-2.5
                      ${isMe
                        ? "-right-[5px] bg-indigo-600 [clip-path:polygon(0_0,0_100%,100%_0)]"
                        : "-left-[5px] bg-[#1e2138] [clip-path:polygon(100%_0,100%_100%,0_0)]"
                      }`}
                  />
                  {msg.content}
                </div>

                {/* read receipt */}
                {isMe && isLastMsg && (
                  <div className="flex items-center gap-1 px-1 pt-0.5">
                    <CheckCheck size={13} className="text-indigo-400" />
                    <span className="text-[11px] text-white/30">Seen</span>
                  </div>
                )}

                {/* own message timestamp */}
                {isMe && !isLastMsg && (
                  <span className="text-[11px] text-white/20 font-mono px-1">
                    {msg.createdAt}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ══════════════ INPUT BAR ══════════════ */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3
                   bg-[#0d0f18]/98 border-t border-white/[0.06] shrink-0"
      >
        {/* attach */}
        <button
          type="button"
          aria-label="Attach file"
          className="w-8 h-8 rounded-[10px] flex items-center justify-center
                     text-white/30 bg-transparent border-none cursor-pointer
                     hover:text-white/70 hover:bg-white/[0.07]
                     transition-all duration-150 shrink-0"
        >
          <Paperclip size={18} />
        </button>

        {/* input wrapper */}
        <div className="flex-1 flex items-center gap-2 px-3.5
                        bg-white/[0.05] border border-white/[0.09] rounded-[14px]
                        focus-within:border-indigo-500/55 focus-within:bg-white/[0.07]
                        focus-within:ring-[3px] focus-within:ring-indigo-500/[0.12]
                        transition-all duration-200">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${activeRoom.name}…`}
            className="flex-1 bg-transparent border-none outline-none
                       text-white/88 text-[13.5px] font-sans py-[11px]
                       placeholder-white/25 caret-indigo-400"
          />
          <button
            type="button"
            aria-label="Emoji"
            className="text-white/25 hover:text-white/60 bg-transparent border-none
                       cursor-pointer flex items-center transition-colors duration-150 shrink-0"
          >
            <Smile size={18} />
          </button>
        </div>

        {/* send */}
        <button
          type="submit"
          aria-label="Send message"
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                     bg-gradient-to-br from-indigo-600 to-violet-600
                     text-white border-none cursor-pointer
                     shadow-[0_2px_8px_rgba(80,70,229,0.38)]
                     hover:scale-[1.08] hover:shadow-[0_4px_16px_rgba(80,70,229,0.52)]
                     active:scale-[0.93] transition-all duration-150"
        >
          <Send size={15} />
        </button>
      </form>

      <style>{`
        @keyframes msgIn       { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes statusPulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.45; transform:scale(0.82); } }
      `}</style>
    </div>
  );
};

export default Chatpanel;