import {app} from '@/firebase'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const CheckBox = ({id, label, onChange, checked}) => {
  return (
    <div className='flex gap-2'>
      <input type='checkbox' id={id} className='w-5' onChange={onChange} checked={checked} />
      <label className='capitalize cursor-pointer select-none' htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

const InputNumber = ({id, label, onChange, value, min = '1', max = '10', month = false}) => {
  return (
    <div className='flex items-center gap-2'>
      <input
        type='number'
        placeholder='Price'
        className='border p-3 rounded-lg border-gray-300'
        min={min}
        max={max}
        id={id}
        required
        onChange={onChange}
        value={value}
      />
      <div className='flex flex-col items-center'>
        <label className='capitalize'>{label}</label>
        {month && <span className=''>($ / month)</span>}
      </div>
    </div>
  )
}

const CreateListing = () => {
  const navigate = useNavigate()
  const {currentUser} = useSelector((state) => state.user)
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(formData)

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true)
      setImageUploadError(false)
      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)})
          setImageUploadError(false)
          setUploading(false)
        })
        .catch((error) => {
          setImageUploadError('Image upload failed (2 mb max per image)')
          setUploading(false)
        })
    } else {
      setImageUploadError('You can only upload up to 6 images per listing')
      setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, `listing/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const handleRemoveImage = (index) => {
    const newImageUrls = formData.imageUrls.filter((url, i) => i !== index)
    setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index)})
  }

  const handleChange = (e) => {
    if (e.target.id === 'rent' || e.target.id === 'sale') {
      setFormData({...formData, type: e.target.id})
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({...formData, [e.target.id]: e.target.checked})
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({...formData, [e.target.id]: e.target.value})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image')
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price')
      setLoading(true)
      setError(false)
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className='p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row container mx-auto gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <CheckBox
              id='sale'
              label='sell'
              onChange={handleChange}
              checked={formData.type === 'sale'}
            />
            <CheckBox
              id='rent'
              label='rent'
              onChange={handleChange}
              checked={formData.type === 'rent'}
            />
            <CheckBox
              id='parking'
              label='parking spot'
              onChange={handleChange}
              checked={formData.parking}
            />
            <CheckBox
              id='furnished'
              label='furnished'
              onChange={handleChange}
              checked={formData.furnished}
            />
            <CheckBox id='offer' label='offer' onChange={handleChange} checked={formData.offer} />
          </div>
          <div className='flex gap-6 flex-wrap'>
            <InputNumber
              id='bedrooms'
              label='bedrooms'
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <InputNumber
              id='bathrooms'
              label='bathrooms'
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <InputNumber
              id='regularPrice'
              label='regular price'
              min='50'
              max='1000000'
              month={formData.type === 'rent'}
              onChange={handleChange}
              value={formData.regularPrice}
            />
            {formData.offer && (
              <InputNumber
                id='discountPrice'
                label='discounted price'
                min='0'
                max='1000000'
                onChange={handleChange}
                month={formData.type === 'rent'}
                value={formData.discountPrice}
              />
            )}
          </div>
        </div>
        <div className='flex flex-col gap-4 flex-1'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              type='file'
              placeholder='Images'
              className='border border-gray-300 p-3 rounded w-full'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              onClick={handleImageSubmit}
              type='button'
              disabled={uploading}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={index} className='flex justify-between p-3 border items-center'>
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  )
}

export default CreateListing
