import React, { useState } from 'react'
import assets from '../assets/assets'
import { useAuthContext } from '../context/AuthContext'

const Loginpage = () => {
  const { login } = useAuthContext();
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if(currState === "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return
    }
    setLoading(true)
    await login(currState, { fullName, email, password, bio })
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 gap-8 sm:justify-around'>

      {/* Left Side */}
      <div className='hidden sm:flex flex-col items-center gap-4'>
        <img src={assets.logo_big} alt="" className='w-[min(30vw,220px)]'/>
        <p className='text-white/60 text-sm text-center max-w-[200px]'>
          Connect with friends instantly — anytime, anywhere.
        </p>
      </div>

      {/* Form Card */}
      <div className='w-full max-w-sm'>

        {/* Card Header */}
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col gap-5 shadow-2xl'>

          {/* Logo on mobile */}
          <div className='flex sm:hidden justify-center mb-2'>
            <img src={assets.logo} alt="" className='w-32'/>
          </div>

          {/* Title */}
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-white text-2xl font-semibold'>
                {isDataSubmitted ? "One more step" : currState === "Sign up" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className='text-gray-400 text-xs mt-1'>
                {isDataSubmitted ? "Tell us a little about yourself" : currState === "Sign up" ? "Join QuickChat today" : "Sign in to continue"}
              </p>
            </div>
            {isDataSubmitted &&
              <button onClick={()=>setIsDataSubmitted(false)} className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition'>
                <img src={assets.arrow_icon} alt="" className='w-4'/>
              </button>
            }
          </div>

          {/* Inputs */}
          <div className='flex flex-col gap-3'>
            {currState === "Sign up" && !isDataSubmitted && (
              <div className='relative'>
                <input
                  onChange={(e)=>setFullName(e.target.value)} value={fullName}
                  type="text" placeholder='Full Name' required
                  className='w-full p-3 pl-4 bg-white/8 rounded-xl border border-white/10 outline-none text-white text-sm placeholder-gray-500 focus:border-violet-500 transition-colors'
                />
              </div>
            )}

            {!isDataSubmitted && (
              <>
                <input
                  onChange={(e)=>setEmail(e.target.value)} value={email}
                  type="email" placeholder='Email Address' required
                  className='w-full p-3 pl-4 bg-white/8 rounded-xl border border-white/10 outline-none text-white text-sm placeholder-gray-500 focus:border-violet-500 transition-colors'
                />
                <input
                  onChange={(e)=>setPassword(e.target.value)} value={password}
                  type="password" placeholder='Password' required
                  className='w-full p-3 pl-4 bg-white/8 rounded-xl border border-white/10 outline-none text-white text-sm placeholder-gray-500 focus:border-violet-500 transition-colors'
                />
              </>
            )}

            {currState === "Sign up" && isDataSubmitted && (
              <textarea
                onChange={(e)=>setBio(e.target.value)} value={bio}
                rows={4} placeholder='Write a short bio about yourself...' required
                className='w-full p-3 pl-4 bg-white/8 rounded-xl border border-white/10 outline-none text-white text-sm placeholder-gray-500 focus:border-violet-500 transition-colors resize-none'
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmitHandler}
            disabled={loading}
            type='button'
            className='w-full py-3 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 disabled:opacity-50'>
            {loading ? "Please wait..." : isDataSubmitted ? "Complete Sign Up" : currState === "Sign up" ? "Continue" : "Sign In"}
          </button>

          {/* Terms */}
          <label className='flex items-center gap-2 text-xs text-gray-500 cursor-pointer'>
            <input type="checkbox" className='accent-violet-500 cursor-pointer'/>
            <span>I agree to the <span className='text-violet-400'>Terms of Use</span> & <span className='text-violet-400'>Privacy Policy</span></span>
          </label>

          {/* Switch */}
          <div className='text-center'>
            <p className='text-xs text-gray-500'>
              {currState === "Sign up"
                ? <>Already have an account?{" "}<span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='text-violet-400 cursor-pointer hover:text-violet-300 transition'>Sign in</span></>
                : <>Don't have an account?{" "}<span onClick={()=>setCurrState("Sign up")} className='text-violet-400 cursor-pointer hover:text-violet-300 transition'>Sign up</span></>
              }
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Loginpage