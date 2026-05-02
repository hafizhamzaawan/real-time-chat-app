import { createContext, useState, useContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [showRightSidebar, setShowRightSidebar] = useState(false);

    const { socket, axios } = useAuthContext();

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/message/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/message/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages(prev => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if(socket){
            socket.on("newMessage", (message) => {
                if(selectedUser && message.senderId === selectedUser._id){
                    setMessages(prev => [...prev, message]);
                } else {
                    setUnseenMessages(prev => ({
                        ...prev,
                        [message.senderId]: (prev[message.senderId] || 0) + 1
                    }))
                }
            })
        }
        return () => {
            if(socket) socket.off("newMessage");
        }
    }, [socket, selectedUser])

    useEffect(() => {
        getUsers();
    }, [])

    // Reset right sidebar when user changes
    useEffect(() => {
        setShowRightSidebar(false);
    }, [selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages,
        sendMessage,
        getUsers,
        showRightSidebar,
        setShowRightSidebar
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);