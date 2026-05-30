import React from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { Search, MessageSquare, PlusIcon } from "lucide-react";
import { mockRooms } from "../assets/dummydata";

const AVATAR_PALETTES = [
  { bg: "bg-indigo-950",  text: "text-indigo-300" },
  { bg: "bg-blue-950",    text: "text-blue-300"   },
  { bg: "bg-violet-950",  text: "text-violet-300" },
  { bg: "bg-teal-950",    text: "text-teal-300"   },
  { bg: "bg-amber-950",   text: "text-amber-300"  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ChatLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex bg-[#080910] overflow-hidden font-sans">

      {/* ═══════════════════ SIDEBAR ═══════════════════ */}
      <aside className="w-72 h-full flex flex-col shrink-0 px-3 py-5 gap-4
                        bg-gradient-to-b from-[#1a1460] to-[#120e47]
                        border-r border-white/[0.07]">

        {/* header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400" />
            <span className="text-[17px] font-semibold text-white tracking-tight">
              Messages
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-2xl p-1 m-1 hover:bg-indigo-600/10 text-sm cursor-pointer shadow-lg z-40 " onClick={()=>{}}>
           <PlusIcon className="h-5 w-5 p-0.5 m-0.5"/>  <p className="p-0.5 m-0.5 right-2.5">New</p>
          </div>
         
        </div>

        {/* search */}
        <div className="flex items-center gap-2 bg-black/25 border border-white/[0.08]
                        rounded-xl px-3 py-2 cursor-pointer
                        hover:border-white/[0.16] transition-colors">
          <Search size={14} className="text-white/30 shrink-0" />
          <span className="text-[13px] text-white/30">Search chats…</span>
        </div>

        {/* room list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-0.5
                        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {mockRooms.map((room, idx) => {
            const isActive = roomId === room.id;
            const palette  = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
            const initials = getInitials(room.name);

            return (
              <div
                key={room.id}
                onClick={() => navigate(`/chats/${room.id}`)}
                style={{ animationDelay: `${idx * 50}ms` }}
                className={`
                  group flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer
                  border transition-all duration-150 animate-[slideIn_0.2s_ease-out_both]
                  ${isActive
                    ? "bg-indigo-500/20 border-indigo-500/35"
                    : "border-transparent hover:bg-white/[0.06] hover:translate-x-0.5"
                  }
                `}
              >
                {/* left accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2
                                   w-[3px] h-[60%] bg-indigo-400 rounded-r-full" />
                )}

                {/* avatar */}
                <div className={`relative w-9 h-9 rounded-[10px] shrink-0
                                 flex items-center justify-center
                                 text-[13px] font-semibold
                                 ${palette.bg} ${palette.text}`}>
                  {initials}
                  {room.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5
                                     bg-emerald-400 rounded-full border-2 border-[#120e47]" />
                  )}
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13.5px] font-medium text-white/90 truncate">
                      {room.name}
                    </span>
                    <span className="text-[11px] text-white/30 font-mono shrink-0 ml-1.5">
                      {room.lastMessage.createdAt}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/40 truncate">
                    <span className="font-medium text-white/55">
                      {room.lastMessage.senderName}:
                    </span>{" "}
                    {room.lastMessage.content}
                  </p>
                </div>

                {/* unread badge */}
                {room.unreadCount > 0 && !isActive && (
                  <span className="min-w-[18px] h-[18px] px-1 bg-rose-500 text-white
                                   text-[10px] font-bold rounded-full
                                   flex items-center justify-center shrink-0
                                   animate-[badgePop_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ═══════════════════ OUTLET ═══════════════════ */}
      <main className="flex-1 h-full flex flex-col min-w-0">
        <Outlet />
      </main>

      {/* keyframe helpers (Tailwind JIT arbitrary) */}
      <style>{`
        @keyframes slideIn   { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes badgePop  { from { transform:scale(0); } to { transform:scale(1); } }
      `}</style>
    </div>
  );
};

export default ChatLayout;