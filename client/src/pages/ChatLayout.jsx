import React from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { mockRooms } from "../assets/dummydata";

const ChatLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex bg-[#0a0b10] overflow-hidden font-sans">
      
      {/* ================= LEFT PANEL SIDEBAR (PERSISTENT) ================= */}
      <aside className="w-96 h-full bg-indigo-600 flex flex-col p-4 m-2 rounded-2xl shrink-0 shadow-2xl">
        <div className="text-white text-2xl font-bold mb-4 px-2 flex justify-between items-center">
          <span>Chats</span>
          <span className="text-xs bg-indigo-500 px-2.5 py-1 rounded-full font-normal">
            Beta View
          </span>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
          {mockRooms.map((room) => {
            const isSelected = roomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => navigate(`/chats/${room.id}`)}
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

      {/* ================= DYNAMIC RIGHT PANEL PLACEHOLDER ================= */}
      <main className="flex-1 h-full p-4 flex flex-col min-w-0">
        {/* React Router will inject either ChatWindow or EmptyState here */}
        <Outlet />
      </main>

    </div>
  );
};

export default ChatLayout;