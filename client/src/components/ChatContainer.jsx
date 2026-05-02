import React, { useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { useChatContext } from '../context/ChatContext'
import { useAuthContext } from '../context/AuthContext'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, showRightSidebar, setShowRightSidebar } = useChatContext();
  const { authUser, onlineUsers } = useAuthContext();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if(selectedUser) getMessages(selectedUser._id);
  }, [selectedUser])

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
    }
    reader.readAsDataURL(file);
  }

  const formatTime = (createdAt) => {
    if(!createdAt) return "";
    return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return selectedUser ? (
    <div className='h-full flex flex-col bg-[#0f0f1a] overflow-hidden'>

      {/* Header */}
      <div
        onClick={()=>setShowRightSidebar(prev => !prev)}
        className='flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-[#1a1a2e] border-b border-white/10 cursor-pointer hover:bg-[#1e1b3a] transition-colors'>
        <div className='relative'>
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full object-cover'/>
          {onlineUsers.includes(selectedUser._id) && (
            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#1a1a2e]'></span>
          )}
        </div>
        <div className='flex-1'>
          <p className='text-white font-medium text-sm'>{selectedUser?.fullName}</p>
          <p className={`text-xs ${onlineUsers.includes(selectedUser._id) ? "text-green-400" : "text-gray-500"}`}>
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
        <img
          onClick={(e)=>{e.stopPropagation(); setSelectedUser(null)}}
          src={assets.arrow_icon} alt=""
          className='md:hidden w-5 cursor-pointer opacity-70'
        />
        <div className={`max-md:hidden w-7 h-7 rounded-full flex items-center justify-center transition ${showRightSidebar ? "bg-violet-600" : "bg-white/10"}`}>
          <img src={assets.help_icon} alt="" className='w-4'/>
        </div>
      </div>

      {/* Messages — only this scrolls! */}
      <div className='flex-1 overflow-y-auto flex flex-col gap-2 p-4'>
        {messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full gap-2 opacity-40'>
            <img src={assets.logo_icon} alt="" className='w-10'/>
            <p className='text-white text-sm'>No messages yet</p>
            <p className='text-gray-400 text-xs'>Say hello! 👋</p>
          </div>
        )}
        {messages.map((msg, index)=>{
          const isSender = msg.senderId === authUser._id;
          return (
            <div key={msg._id || index} className={`flex items-end gap-2 ${isSender ? "justify-end flex-row-reverse" : "justify-start"}`}>
              <img
                src={isSender ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                alt="" className='w-6 h-6 rounded-full object-cover flex-shrink-0 mb-1'
              />
              <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                {msg.image
                  ? <img src={msg.image} alt="" className='max-w-[220px] rounded-2xl border border-white/10'/>
                  : <div className={`px-4 py-2 rounded-2xl max-w-[250px] text-sm text-white
                      ${isSender ? "bg-violet-600 rounded-br-sm" : "bg-[#1e1b3a] border border-white/10 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                }
                <span className='text-[10px] text-gray-500 mt-1 px-1'>{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          )
        })}
        <div ref={scrollRef}></div>
      </div>

      {/* Input — always at bottom */}
      <div className='flex-shrink-0 px-4 py-3 bg-[#1a1a2e] border-t border-white/10'>
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 gap-2 focus-within:border-violet-500 transition-colors'>
            <input
              onChange={(e)=>setInput(e.target.value)} value={input}
              onKeyDown={(e)=>e.key === "Enter" && handleSendMessage(e)}
              type="text" placeholder='Type a message...'
              className='flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-500'
            />
            <input onChange={handleSendImage} type="file" id='image' accept='image/*' hidden/>
            <label htmlFor="image" className='cursor-pointer opacity-60 hover:opacity-100 transition'>
              <img src={assets.gallery_icon} alt="" className='w-5'/>
            </label>
          </div>
          <button onClick={handleSendMessage}
            className='w-10 h-10 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0'>
            <img src={assets.send_button} alt="" className='w-5'/>
          </button>
        </div>
      </div>

    </div>
  ) : (
    <div className='h-full flex flex-col items-center justify-center gap-3 bg-[#0f0f1a] max-md:hidden'>
      <div className='w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center'>
        <img src={assets.logo_icon} alt="" className='w-8'/>
      </div>
      <p className='text-white font-medium'>Welcome to QuickChat</p>
      <p className='text-gray-500 text-sm'>Select a conversation to start chatting</p>
    </div>
  )
}

export default ChatContainer