import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {io} from 'socket.io-client'
import { AppContext } from "./AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }) => {
    const [rooms,setRooms] = useState([]);
    const [messages,setMessages] = useState([]);
    const [socket,setSocket] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

    const fetchRooms = async()=>{
        try {
            const token = await getToken();
            console.log(token)
            const {data} = await axios.get("/api/rooms/getRooms",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(data.success){
                setRooms(data.rooms)
            }
        } catch (error) {
            console.log("Error fetching rooms: ",error);
        }
    }


    useEffect(()=>{
        if(user){
            fetchRooms();
        }
    },[user])

    useEffect(() => {
        let socketInstance;

        if (user) {
            // Fetch initial HTTP layout data
            fetchRooms();

            // Establish WebSocket Connection
            socketInstance = io(import.meta.env.VITE_BASE_URL, {
                autoConnect: true,
                // Optional: Pass auth token via handshake if your backend requires it
                auth: async (cb) => {
                    const token = await getToken();
                    cb({ token });
                }
            });

            setSocket(socketInstance);

            // Global socket listeners (e.g., updating sidebar when a peer sends a message)
            socketInstance.on("receiveMessage", (data) => {
                const { roomUpdate } = data;
                if (!roomUpdate) return;

                setRooms((prevRooms) => {
                    return prevRooms.map((room) => {
                        if (room._id === roomUpdate.roomId) {
                            return {
                                ...room,
                                lastMessage: roomUpdate.lastMessage,
                                unreadCount: room.unreadCount + 1
                            };
                        }
                        return room;
                    });
                });
            });
        }

        // Cleanup: Disconnect socket when user logs out or provider unmounts
        return () => {
            if (socketInstance) {
                socketInstance.off("receiveMessage");
                socketInstance.disconnect();
            }
        };
    }, [user]); //

    const value = {
        axios,user,getToken,navigate,rooms,setRooms,messages,setMessages,socket
    }

    return <AppContext.Provider value={value} >{children}</AppContext.Provider>

};
