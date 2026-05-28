// mockData.js

// 1. MOCK CURRENT USER PROFILE
export const mockCurrentUser = {
  uid: "firebase_user_uid_101",
  email: "developer@fuzzie.app",
  isOnline: true,
  lastSeen: new Date()
};

// 2. MOCK CHAT ROOMS LIST
// Useful for rendering your sidebar conversation cards
export const mockRooms = [
  {
    id: "room_id_alpha",
    name: "Dev Team Sync",
    unreadCount: 3,
    lastMessage: {
      content: "Bun setup is running fine on production.",
      senderName: "Charlie Brown",
      createdAt: "1h ago"
    }
  },
  {
    id: "room_id_beta",
    name: "Alice Smith",
    unreadCount: 0,
    lastMessage: {
      content: "Hey, did you look at the new API backend?",
      senderName: "Alice Smith",
      createdAt: "2m ago"
    }
  },
  {
    id: "room_id_gamma",
    name: "General Architecture",
    unreadCount: 0,
    lastMessage: {
      content: "The Prisma schema has been successfully migrated over to Mongoose.",
      senderName: "System",
      createdAt: "Yesterday"
    }
  }
];

// 3. MOCK ACTIVE ROOM MESSAGES
// Ideal for mapping inside your active <main> chat window viewport
export const mockMessages = [
  {
    id: "msg_001",
    roomId: "room_id_beta",
    content: "Hey, did you look at the new API backend? I am setting up the token verification layer right now.",
    userId: "firebase_user_uid_002", // Alice's UID
    senderName: "Alice Smith",
    avatar: "A",
    createdAt: "1:35 PM",
    status: "READ"
  },
  {
    id: "msg_002",
    roomId: "room_id_beta",
    content: "Yeah! Just verify it through the Firebase Admin SDK on the Express middleware layer. Works seamlessly.",
    userId: "firebase_user_uid_101", // Current logged-in user UID
    senderName: "Me",
    avatar: "ME",
    createdAt: "1:38 PM",
    status: "READ"
  },
  {
    id: "msg_003",
    roomId: "room_id_beta",
    content: "Awesome, testing that with Bun right now. Will ping you if any CORS or JWT verification errors pop up.",
    userId: "firebase_user_uid_002",
    senderName: "Alice Smith",
    avatar: "A",
    createdAt: "1:40 PM",
    status: "DELIVERED"
  }
];

// 4. MOCK CONTACTS LIST
// Perfect for rendering the content inside your <ContactsPanel /> route
export const mockContacts = [
  {
    uid: "firebase_user_uid_002",
    name: "Alice Smith",
    email: "alice@fuzzie.app",
    status: "online",
    customStatus: "Coding away... 🚀"
  },
  {
    uid: "firebase_user_uid_003",
    name: "Charlie Brown",
    email: "charlie@fuzzie.app",
    status: "offline",
    customStatus: "Out for lunch"
  },
  {
    uid: "firebase_user_uid_004",
    name: "Dana Scully",
    email: "dana@fuzzie.app",
    status: "online",
    customStatus: "The truth is out there"
  }
];