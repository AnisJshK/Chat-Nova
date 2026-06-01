import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockContacts, mockRooms } from "../assets/dummydata";
import {
  Search, Mail, UserCircle2,
  MessageSquare, Users, Dot,
} from "lucide-react";

const AVATAR_PALETTES = [
  { bg: "bg-indigo-950", text: "text-indigo-300",  ring: "ring-indigo-500/40" },
  { bg: "bg-blue-950",   text: "text-blue-300",    ring: "ring-blue-500/40"   },
  { bg: "bg-violet-950", text: "text-violet-300",  ring: "ring-violet-500/40" },
  { bg: "bg-teal-950",   text: "text-teal-300",    ring: "ring-teal-500/40"   },
  { bg: "bg-amber-950",  text: "text-amber-300",   ring: "ring-amber-500/40"  },
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const STATUS_STYLES = {
  online:  "bg-emerald-500/15 text-emerald-400",
  away:    "bg-amber-500/15   text-amber-400",
  busy:    "bg-rose-500/15    text-rose-400",
  offline: "bg-white/5        text-white/30",
};

const ContactsPanel = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleContactClick = (contact) => {
    // Try to find an existing room that matches this contact
    const match = mockRooms.find(
      (r) => r.id === contact.uid || r.contactId === contact.uid
    );
    navigate(match ? `/chats/${match.id}` : `/chats/${contact.uid}`);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#080910] font-sans overflow-hidden">

      {/* ══════════ HEADER ══════════ */}
      <header className="shrink-0 px-6 pt-6 pb-4
                         border-b border-white/[0.06] bg-[#080910]/95">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Users size={18} className="text-indigo-400" />
            <h1 className="text-[17px] font-semibold text-white tracking-tight">
              Contacts
            </h1>
            <span className="text-[11px] font-medium text-white/40
                             bg-white/[0.07] px-2 py-0.5 rounded-full">
              {mockContacts.length}
            </span>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-widest
                           bg-white/10 text-white/50 px-2.5 py-1 rounded-full">
            Beta
          </span>
        </div>

        {/* search */}
        <div className="flex items-center gap-2.5 bg-black/25
                        border border-white/[0.08] rounded-xl px-3.5 py-2.5
                        focus-within:border-indigo-500/50
                        focus-within:ring-[3px] focus-within:ring-indigo-500/[0.12]
                        transition-all duration-200">
          <Search size={14} className="text-white/30 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 bg-transparent border-none outline-none
                       text-[13px] text-white/85 placeholder-white/25
                       caret-indigo-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-white/25 hover:text-white/60 text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* ══════════ LIST ══════════ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2
                      scrollbar-thin scrollbar-thumb-white/[0.08] scrollbar-track-transparent">

        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
            <UserCircle2 size={32} className="text-white/15" />
            <p className="text-[13.5px] text-white/30">No contacts match "{query}"</p>
          </div>
        ) : (
          filtered.map((contact, idx) => {
            const palette  = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
            const initials = getInitials(contact.name);
            const statusStyle = STATUS_STYLES[contact.status] ?? STATUS_STYLES.offline;

            return (
              <div
                key={contact.uid}
                onClick={() => handleContactClick(contact)}
                style={{ animationDelay: `${idx * 40}ms` }}
                className="group flex items-center gap-3.5 px-4 py-3.5
                           rounded-2xl border border-white/[0.06]
                           bg-white/[0.03] cursor-pointer
                           hover:bg-indigo-500/[0.08] hover:border-indigo-500/25
                           hover:translate-x-0.5
                           active:scale-[0.99]
                           transition-all duration-150
                           animate-[slideIn_0.2s_ease-out_both]"
              >
                {/* avatar */}
                <div className={`relative w-11 h-11 rounded-xl shrink-0
                                 flex items-center justify-center
                                 text-[14px] font-semibold ring-1
                                 ${palette.bg} ${palette.text} ${palette.ring}`}>
                  {initials}
                  {/* online indicator */}
                  {contact.status === "online" && (
                    <span className="absolute -bottom-0.5 -right-0.5
                                     w-3 h-3 bg-emerald-400 rounded-full
                                     border-2 border-[#080910]
                                     animate-[statusPulse_2s_ease-in-out_infinite]" />
                  )}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-white/90 truncate">
                      {contact.name}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5
                                      rounded-full capitalize shrink-0 ${statusStyle}`}>
                      {contact.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-white/40 min-w-0">
                    <span className="flex items-center gap-1 truncate
                                     group-hover:text-white/60 transition-colors">
                      <Mail size={11} className="shrink-0" />
                      {contact.email}
                    </span>

                    {contact.customStatus && (
                      <>
                        <Dot size={14} className="shrink-0 text-white/20" />
                        <span className="italic text-indigo-400/80 truncate">
                          {contact.customStatus}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* message CTA */}
                <div className="shrink-0 w-8 h-8 rounded-[10px]
                                flex items-center justify-center
                                text-white/20 bg-transparent
                                group-hover:bg-indigo-500/20 group-hover:text-indigo-400
                                transition-all duration-150">
                  <MessageSquare size={15} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes slideIn      { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes statusPulse  { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.45; transform:scale(0.82); } }
      `}</style>
    </div>
  );
};

export default ContactsPanel;