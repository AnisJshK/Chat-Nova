export const SOCKET_EVENTS = {
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",

  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",

  TYPING: "typing",
  STOP_TYPING: "stop-typing",

  DISCONNECT: "disconnect",
} as const;