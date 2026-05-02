import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, [token])

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/user/check");
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: { userId: userData._id }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/user/${state === "Sign up" ? "register" : "login"}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["token"] = data.token;
                connectSocket(data.userData);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setToken("");
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = "";
        if(socket) socket.disconnect();
        setSocket(null);
        toast.success("Logged out successfully");
    }

    const value = {
        axios,
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        token,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);