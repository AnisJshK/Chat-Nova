import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }) => {
    const [rooms,setRooms] = useState([]);
    const [messages,setMessages] = useState([]);
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

    const value = {
        axios,user,getToken,navigate,rooms,setRooms
    }

    return <AppContext.Provider value={value} >{children}</AppContext.Provider>

};
