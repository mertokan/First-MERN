import {useParams} from 'react-router-dom'

const InputCheckboxes = ({id, label}) => {
  return (
    <div className='flex gap-2 select-none'>
      <input type='checkbox' name='' id={id} className='w-5' />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

const Search = () => {
  const params = useParams()

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-8 border-b-2 md:border-r-2 md:min-h-screen'>
        <form action='' className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label htmlFor='searchTerm' className='whitespace-nowrap'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label htmlFor='' className='font-semibold '>Type:</label>
            <InputCheckboxes id='all' label='Rent & Sale' />
            <InputCheckboxes id='rent' label='Rent' />
            <InputCheckboxes id='sale' label='Sale' />
            <InputCheckboxes id='offer' label='Offer' />
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label htmlFor='' className='font-semibold '>Amenities:</label>
            <InputCheckboxes id='parking' label='Parking' />
            <InputCheckboxes id='furnished' label='Furnished' />
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='' className='font-semibold '>Sort:</label>
            <select name='' id='sort_order' className='border rounded-lg p-3'>
              <option value=''>Price high to low</option>
              <option value=''>Price low to hight</option>
              <option value=''>Latest</option>
              <option value=''>Oldest</option>
            </select>
          </div>
          <button className='uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className='font-semibold text-3xl border-b p-3 text-slate-700 mt-5'>
          Listing Results:
        </h1>
      </div>
    </div>
  )
}

export default Search
