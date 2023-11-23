import {useSelector} from 'react-redux'
import {useRef, useState, useEffect} from 'react'
import {getDownloadURL, getStorage, list, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '@/firebase'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from '@/redux/user/userSlice'
import {useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'

const Profile = () => {
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(null)
  const [userListings, setUserListings] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercent(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL})
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
      setInterval(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart())
      const res = await fetch(`/api/auth/signout`)
      const data = await res.json()

      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }
      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowListingsError(true)
        return
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        console.log(data.message)
        return
      }
      setUserListings(userListings.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='p-3 container mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5 mb-5'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          className='hidden'
          type='file'
          ref={fileRef}
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt='avatar'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'
        />
        <p className='text-sm self-center font-semibold'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image upload (image must be less than 2 mb)</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          name=''
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Email'
          defaultValue={currentUser.email}
          name=''
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          name=''
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          to={'/create-listing'}
          className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70 text-center'
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer font-semibold'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer font-semibold'>
          Sign Out
        </span>
      </div>
      <button className='text-green-700 w-full' onClick={handleShowListings}>
        Show Listings
      </button>
      <p>{showListingsError ? 'Error showing listings' : ''}</p>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Profile updated successfully' : ''}</p>
      {userListings && userListings.length > 0 && (
        <div className=' flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='flex justify-between items-center border rounded-lg p-3 gap-4 '
            >
              <Link to={`/listing/${listing._id}`} key={listing._id} className=''>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className='text-slate-700 font-semibold flex-1 hover:underline truncate'
              >
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center gap-2'>
                <button
                  className='text-red-700 uppercase'
                  onClick={() => handleListingDelete(listing._id)}
                >
                  Delete
                </button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
