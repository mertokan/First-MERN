import React from 'react'

const CheckBox = ({id, label}) => {
  return (
    <div className='flex gap-2'>
      <input type='checkbox' id={id} className='w-5' />
      <span className='capitalize'>{label}</span>
    </div>
  )
}

const InputNumber = ({id, label}) => {
  return (
    <div className='flex items-center gap-2'>
      <input
        type='number'
        placeholder='Price'
        className='border p-3 rounded-lg border-gray-300'
        min='1'
        max='10'
        id={id}
        required
      />
      <div className='flex flex-col items-center'>
        <label className='capitalize'>{label}</label>
        <span className=''>($ / month)</span>
      </div>
    </div>
  )
}

const CreateListing = () => {
  return (
    <main className='p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row container mx-auto gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' />
          <div className='flex gap-6 flex-wrap'>
            <CheckBox id='sell' label='sell' />
            <CheckBox id='rent' label='rent' />
            <CheckBox id='parking' label='parking spot' />
            <CheckBox id='furnished' label='furnished' />
            <CheckBox id='offer' label='offer' />
          </div>
          <div className='flex gap-6 flex-wrap'>
            <InputNumber id='bedrooms' label='bedrooms' />
            <InputNumber id='bathrooms' label='bathrooms' />
            <InputNumber id='regularPrice' label='regular price' />
            <InputNumber id='discountPrice' label='discounted price' />
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
              type='file'
              placeholder='Images'
              className='border border-gray-300 p-3 rounded w-full'
              id='images'
              accept='image/*'
              multiple
            />
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              Upload
            </button>
          </div>
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing
