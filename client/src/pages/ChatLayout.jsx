import React, { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { Search, MessageSquare, PlusIcon, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

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

  const { rooms, getToken, axios, setRooms, socket } = useAppContext();

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // "create" or "join"
  
  // Form input fields
  const [roomName, setRoomName] = useState("");
  const [targetRoomId, setTargetRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. ACTION: Create a brand new room workspace
  const handleCreateRooms = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/rooms/createRoom", {
        name: roomName, isGroup: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newRoomObject = {
        _id: data._id,
        name: data.name,
        isGroup: data.isGroup,
        lastMessage: null,
        unreadCount: 0,
        online: false
      };
      
      setRooms((prevRooms) => [newRoomObject, ...prevRooms]);
      setRoomName("");
      setIsModalOpen(false);
      navigate(`/chats/${data._id}`);
    } catch (error) {
      console.error("Failed to create room: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ACTION: Join an existing room using its MongoDB String ID
  const handleJoinRoomById = async (e) => {
    e.preventDefault();
    const cleanId = targetRoomId.trim();
    if (!cleanId) return;
    
    // Safety Check: Avoid re-joining if it's already in our sidebar state
    if (rooms?.some(r => r._id === cleanId)) {
      setIsModalOpen(false);
      setTargetRoomId("");
      navigate(`/chats/${cleanId}`);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      // Send connection token and request member addition
      const { data } = await axios.post(`/api/rooms/${cleanId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        // Build out fallback container properties matching sidebar list mapping requirements
        const joinedRoomObject = {
          _id: data.room._id,
          name: data.room.name,
          isGroup: data.room.isGroup,
          lastMessage: data.room.lastMessage || null,
          unreadCount: 0,
          online: false
        };

        setRooms((prevRooms) => [joinedRoomObject, ...prevRooms]);

        // Emit 'join-room' WS packet immediately so socket handles live message threads
        if (socket) {
          socket.emit('join-room', { roomId: cleanId });
        }

        setTargetRoomId("");
        setIsModalOpen(false);
        navigate(`/chats/${cleanId}`);
      }
    } catch (error) {
      console.error("Failed to join room by ID:", error);
      alert("Invalid Room ID or server connection issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#080910] overflow-hidden font-sans relative">

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

          <div 
            className="flex items-center justify-between border border-white/10 bg-indigo-600 hover:bg-indigo-500 rounded-xl p-1 px-2.5 text-xs font-semibold cursor-pointer shadow-lg z-40 text-white gap-1 transition-all" 
            onClick={() => {
              setActiveTab("create"); // Default view layout open key
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="h-4 w-4"/>  <span>New</span>
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
          {rooms && rooms.map((room, idx) => {
            const isActive = roomId === room._id;
            const palette  = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
            const initials = getInitials(room.name);
            const messageTime = room.lastMessage?.createdAt
              ? new Date(room.lastMessage.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })
              : "";
            return (
              <div
                key={room._id}
                onClick={() => navigate(`/chats/${room._id}`)}
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
                      {messageTime}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/40 truncate">
                    {room.lastMessage?.content ? (
                      <>
                        <span className="font-medium text-white/55">
                          {room.lastMessage.senderName}:
                        </span>{" "}
                        {room.lastMessage.content}
                      </>
                    ) : (
                      <span className="italic text-white/20">No messages yet</span>
                    )}
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

      {/* ═══════════════════ NEW CHAT ACTIONS MODAL (Unified) ═══════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#120e47] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl m-4 relative animate-[scaleUp_0.2s_ease-out]">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Segmented Tab Controllers */}
            <div className="flex border-b border-white/10 gap-4 mb-6">
              <button 
                onClick={() => setActiveTab("create")}
                className={`pb-2.5 text-sm font-medium transition-all relative ${activeTab === "create" ? "text-indigo-400 font-semibold" : "text-white/40 hover:text-white/70"}`}
              >
                Create Workspace
                {activeTab === "create" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab("join")}
                className={`pb-2.5 text-sm font-medium transition-all relative ${activeTab === "join" ? "text-indigo-400 font-semibold" : "text-white/40 hover:text-white/70"}`}
              >
                Join with ID
                {activeTab === "join" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />}
              </button>
            </div>

            {/* TAB CONTAINER VIEWPORT */}
            {activeTab === "create" ? (
              <form onSubmit={handleCreateRooms} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-indigo-300 uppercase tracking-wider mb-2">Room Name</label>
                  <input
                    type="text" required value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., Development Team, Book Club..."
                    className="w-full bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="submit" disabled={loading || !roomName.trim()} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg disabled:opacity-50 w-full">
                    {loading ? "Creating workspace..." : "Create Workspace"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleJoinRoomById} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-indigo-300 uppercase tracking-wider mb-2">Target Room String ID</label>
                  <input
                    type="text" required value={targetRoomId}
                    onChange={(e) => setTargetRoomId(e.target.value)}
                    placeholder="Paste MongoDB token id (e.g., 65c2a1...)"
                    className="w-full bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="submit" disabled={loading || !targetRoomId.trim()} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg disabled:opacity-50 w-full">
                    {loading ? "Syncing connection..." : "Join Workspace"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn   { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes badgePop  { from { transform:scale(0); } to { transform:scale(1); } }
        @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp   { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default ChatLayout;