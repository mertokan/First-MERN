import React from 'react'
import {useSelector} from 'react-redux'

const Profile = () => {
  const {currentUser} = useSelector((state) => state.user)

  return (
    <div className='p-3 container mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-5 mb-5'>
        <img
          src={currentUser.avatar}
          alt='avatar'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'
        />
        <input
          type='text'
          placeholder='Username'
          name=''
          id='username'
          className='border p-3 rounded-lg'
        />
        <input
          type='text'
          placeholder='Email'
          name=''
          id='email'
          className='border p-3 rounded-lg'
        />
        <input
          type='text'
          placeholder='Password'
          name=''
          id='password'
          className='border p-3 rounded-lg'
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'>
          Update
        </button>
      </form>

      <div className='flex justify-between'>
        <span className='text-red-700 cursor-pointer font-semibold'>Delete Account</span>
        <span className='text-red-700 cursor-pointer font-semibold'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
