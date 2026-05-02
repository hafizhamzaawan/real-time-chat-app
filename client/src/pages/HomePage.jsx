import React from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { useChatContext } from '../context/ChatContext'

const HomePage = () => {
  const { selectedUser, showRightSidebar } = useChatContext();

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className={`w-full h-full overflow-hidden grid
        ${selectedUser && showRightSidebar
          ? "grid-cols-[1fr] md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
          : "grid-cols-[1fr] md:grid-cols-[320px_1fr]"
        }`}>
        <SideBar/>
        <ChatContainer/>
        {showRightSidebar && <RightSideBar/>}
      </div>
    </div>
  )
}

export default HomePage