import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if(!context) throw new Error("UseAppContext must be used within Approvider");
    return context;
}
