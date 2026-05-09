import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useChatContext } from '../context/ChatContext'

const SideBar = () => {
    const navigate = useNavigate();
    const { logout, onlineUsers, authUser } = useAuthContext();
    const { users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, getUsers } = useChatContext();
    const [input, setInput] = useState("");

    const filteredUsers = input
        ? users.filter(user => user.fullName.toLowerCase().includes(input.toLowerCase()))
        : users;

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <div className={`h-full flex flex-col bg-[#1a1a2e] border-r border-white/10 text-white overflow-hidden
            ${selectedUser ? "hidden md:flex" : "flex"}`}>

            <div className='px-4 pt-5 pb-3 border-b border-white/10 flex-shrink-0'>
                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="Logo" className='w-36'/>
                    <div className='relative group'>
                        <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition'>
                            <img src={assets.menu_icon} alt="menu" className='w-4'/>
                        </div>
                        <div className='absolute top-full right-0 z-20 w-44 mt-2 rounded-xl bg-[#1e1b3a] border border-white/10 shadow-xl hidden group-hover:block overflow-hidden'>
                            <div className='px-4 py-3 border-b border-white/10 flex items-center gap-2'>
                                <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full object-cover'/>
                                <div>
                                    <p className='text-xs font-medium text-white'>{authUser?.fullName}</p>
                                    <p className='text-xs text-gray-400 truncate max-w-[100px]'>{authUser?.email}</p>
                                </div>
                            </div>
                            <div className='p-2'>
                                <p onClick={() => navigate("/profile")} className='cursor-pointer text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition'>
                                    Edit Profile
                                </p>
                                <p onClick={logout} className='cursor-pointer text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg px-3 py-2 transition'>
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-4 focus-within:border-violet-500 transition-colors'>
                    <img src={assets.search_icon} alt="" className='w-3.5 opacity-50'/>
                    <input
                        onChange={(e) => setInput(e.target.value)} value={input}
                        type="text" placeholder="Search users..."
                        className='bg-transparent outline-none text-white text-xs placeholder-gray-500 flex-1'
                    />
                </div>
            </div>

            <div className='px-4 py-2 flex-shrink-0'>
                <p className='text-xs text-gray-500'>{onlineUsers.length} online</p>
            </div>

            <div className='flex-1 overflow-y-auto px-2 pb-4'>
                {filteredUsers.length === 0 && (
                    <p className='text-center text-gray-500 text-xs mt-10'>No users found</p>
                )}
                {filteredUsers.map((user) => (
                    <div
                        onClick={() => {
                            setSelectedUser(user);
                            setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                        }}
                        key={user._id}
                        className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1
                            ${selectedUser?._id === user._id
                                ? "bg-violet-600/30 border border-violet-500/30"
                                : "hover:bg-white/5 border border-transparent"
                            }`}>
                        <div className='relative flex-shrink-0'>
                            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full object-cover'/>
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#1a1a2e]'></span>
                            )}
                        </div>
                        <div className='flex flex-col flex-1 min-w-0'>
                            <p className='text-sm font-medium text-white truncate'>{user.fullName}</p>
                            <p className={`text-xs ${onlineUsers.includes(user._id) ? "text-green-400" : "text-gray-500"}`}>
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </p>
                        </div>
                        {unseenMessages[user._id] > 0 && (
                            <span className='flex-shrink-0 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-violet-500 text-white text-xs font-medium'>
                                {unseenMessages[user._id]}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar