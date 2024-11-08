"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
const socketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();
    useEffect(() => {
        const socketio = io(process.env.BACKEND_URL);
        setSocket(socketio);

        return () => {
            socketio.disconnect();
        };
    }, []);

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
};

export default SocketProvider;

export const useSocket = () => {
    return useContext(socketContext);
};
