import ListingItem from '@/components/ListingItem'
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

const InputCheckboxes = ({id, label, onChange, checked}) => {
  return (
    <div className='flex gap-2 select-none'>
      <input
        type='checkbox'
        name={id}
        id={id}
        className='w-5'
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

const Search = () => {
  const navigate = useNavigate()
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  })

  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  const [showMore, setShowMore] = useState(false)
  const env = import.meta.env.VITE_BACKEND_LINK

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const typeFromUrl = urlParams.get('type')
    const parkingFromUrl = urlParams.get('parking')
    const furnishedFromUrl = urlParams.get('furnished')
    const offerFromUrl = urlParams.get('offer')
    const sortFromUrl = urlParams.get('sort')
    const orderFromUrl = urlParams.get('order')

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      })
    }

    const fetchListings = async () => {
      setLoading(true)
      setShowMore(false)
      const searchQuery = urlParams.toString()
      const res = await fetch(`${env}/api/listing/get?${searchQuery}`)
      const data = await res.json()
      if (data.length > 8) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      setListings(data)
      setLoading(false)
    }

    fetchListings()
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({...sidebarData, type: e.target.id})
    }

    if (e.target.id === 'searchTerm') {
      setSidebarData({...sidebarData, searchTerm: e.target.value})
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      })
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at'

      const order = e.target.value.split('_')[1] || 'desc'

      setSidebarData({...sidebarData, sort, order})
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('type', sidebarData.type)
    urlParams.set('parking', sidebarData.parking)
    urlParams.set('furnished', sidebarData.furnished)
    urlParams.set('offer', sidebarData.offer)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('order', sidebarData.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(`${env}/api/listing/get?${searchQuery}`)
    const data = await res.json()
    if (data.length < 8) {
      setShowMore(false)
    } else {
      setShowMore(true)
    }
    setListings([...listings, ...data])
  }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-8 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label htmlFor='searchTerm' className='whitespace-nowrap'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label htmlFor='' className='font-semibold '>
              Type:
            </label>
            <InputCheckboxes
              id='all'
              label='Rent & Sale'
              onChange={handleChange}
              checked={sidebarData.type === 'all'}
            />
            <InputCheckboxes
              id='rent'
              label='Rent'
              onChange={handleChange}
              checked={sidebarData.type === 'rent'}
            />
            <InputCheckboxes
              id='sale'
              label='Sale'
              onChange={handleChange}
              checked={sidebarData.type === 'sale'}
            />
            <InputCheckboxes
              id='offer'
              label='Offer'
              onChange={handleChange}
              checked={sidebarData.offer}
            />
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label htmlFor='' className='font-semibold '>
              Amenities:
            </label>
            <InputCheckboxes
              id='parking'
              label='Parking'
              onChange={handleChange}
              checked={sidebarData.parking}
            />
            <InputCheckboxes
              id='furnished'
              label='Furnished'
              onChange={handleChange}
              checked={sidebarData.furnished}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='' className='font-semibold '>
              Sort:
            </label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='font-semibold text-3xl border-b p-3 text-slate-700 mt-5'>
          Listing Results:
        </h1>
        <div className='p-7 grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 justify-items-center'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && <p className='text-xl text-slate-700 text-center'>Loading...</p>}
          {!loading &&
            listings &&
            listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}

          {showMore && (
            <button
              className='capitalize text-green-700 hover:underline p-7 text-center w-full col-span-full'
              onClick={onShowMoreClick}
            >
              show more...
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
