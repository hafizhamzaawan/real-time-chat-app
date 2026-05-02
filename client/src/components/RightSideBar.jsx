import React from 'react'
import assets from '../assets/assets'
import { useChatContext } from '../context/ChatContext'
import { useAuthContext } from '../context/AuthContext'

const RightSideBar = () => {
  const { selectedUser, messages, setShowRightSidebar } = useChatContext();
  const { onlineUsers } = useAuthContext();

  const imgMessages = messages.filter(msg => msg.image);

  return selectedUser ? (
    <div className='h-full flex flex-col bg-[#1a1a2e] border-l border-white/10 text-white overflow-hidden max-md:hidden'>

      {/* Profile Section */}
      <div className='flex-shrink-0 flex flex-col items-center gap-3 p-6 border-b border-white/10'>
        <div className='relative'>
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
            className='w-20 h-20 rounded-full object-cover border-2 border-violet-500/50'/>
          {onlineUsers.includes(selectedUser._id) && (
            <span className='absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a2e]'></span>
          )}
        </div>
        <div className='text-center'>
          <h1 className='text-base font-semibold'>{selectedUser?.fullName}</h1>
          <p className={`text-xs mt-0.5 ${onlineUsers.includes(selectedUser._id) ? "text-green-400" : "text-gray-500"}`}>
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
        {selectedUser?.bio && (
          <p className='text-xs text-gray-400 text-center leading-relaxed px-4'>{selectedUser?.bio}</p>
        )}
      </div>

      {/* Media Section — scrollable */}
      <div className='flex-1 overflow-y-auto p-4 border-b border-white/10'>
        <div className='flex items-center justify-between mb-3'>
          <p className='text-xs font-medium text-gray-300'>Shared Media</p>
          <span className='text-xs text-gray-500'>{imgMessages.length} files</span>
        </div>
        {imgMessages.length > 0 ? (
          <div className='grid grid-cols-2 gap-2'>
            {imgMessages.map((msg, index)=>(
              <div key={index} onClick={()=>window.open(msg.image)}
                className='cursor-pointer rounded-xl overflow-hidden aspect-square bg-white/5 hover:opacity-80 transition'>
                <img src={msg.image} alt="" className='w-full h-full object-cover'/>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 gap-2 opacity-40'>
            <img src={assets.gallery_icon} alt="" className='w-8'/>
            <p className='text-xs text-gray-400'>No media shared yet</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className='flex-shrink-0 p-4 flex flex-col gap-2'>
        <button className='w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 rounded-xl cursor-pointer transition'>
          Block User
        </button>
        <button onClick={()=>setShowRightSidebar(false)}
          className='w-full py-2.5 bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 text-xs border border-violet-500/30 rounded-xl cursor-pointer transition'>
          Close Panel
        </button>
      </div>

    </div>
  ) : null
}

export default RightSideBar