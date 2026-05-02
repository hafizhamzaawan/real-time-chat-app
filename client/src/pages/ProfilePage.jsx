import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { authUser, setAuthUser, axios } = useAuthContext()
  const [selectedImg, setSelectedImg] = useState(null)
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file){
      const reader = new FileReader()
      reader.onloadend = () => setSelectedImg(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.put("/api/user/update-profile", {
        fullName: name,
        bio,
        profilePic: selectedImg
      })
      if(data.success){
        setAuthUser(data.user)
        toast.success("Profile updated!")
        navigate("/")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-2xl backdrop-blur-md border border-gray-600 text-white flex items-center justify-between max-sm:flex-col-reverse rounded-2xl overflow-hidden'>

        {/* Form Side */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <div>
            <h3 className='text-2xl font-semibold'>Profile Details</h3>
            <p className='text-gray-400 text-sm mt-1'>Update your name, bio and profile picture</p>
          </div>

          {/* Image Upload — Big visible button */}
          <div className='flex flex-col items-start gap-3'>
            <p className='text-sm text-gray-300'>Profile Picture</p>
            <label htmlFor="avatar" className='cursor-pointer group'>
              <input onChange={handleImageChange} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
              <div className='relative w-20 h-20'>
                <img
                  src={selectedImg || authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className='w-20 h-20 rounded-full object-cover border-2 border-violet-400'
                />
                <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <p className='text-white text-xs text-center'>Change Photo</p>
                </div>
              </div>
            </label>
            <p className='text-xs text-gray-400'>Click on image to change photo</p>
          </div>

          <input
            onChange={(e)=>setName(e.target.value)} value={name}
            type="text" required placeholder='Your name'
            className='p-3 bg-white/10 rounded-lg border border-gray-500 outline-none text-sm placeholder-gray-400'
          />

          <textarea
            onChange={(e)=>setBio(e.target.value)} value={bio}
            placeholder='Write profile bio' rows={3} required
            className='p-3 bg-white/10 rounded-lg border border-gray-500 outline-none text-sm placeholder-gray-400 resize-none'
          />

          <button
            type='submit'
            disabled={loading}
            className='bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50'>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {/* Preview Side */}
        <div className='flex flex-col items-center gap-3 p-10 bg-white/5 h-full'>
          <p className='text-sm text-gray-400'>Preview</p>
          <img
            src={selectedImg || authUser?.profilePic || assets.avatar_icon}
            alt=""
            className='w-28 h-28 rounded-full object-cover border-4 border-violet-400'
          />
          <p className='text-lg font-medium'>{name}</p>
          <p className='text-sm text-gray-400 text-center max-w-[150px]'>{bio}</p>
          <div className='mt-2 px-3 py-1 bg-violet-500/20 rounded-full text-xs text-violet-300'>
            {authUser?.email}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage