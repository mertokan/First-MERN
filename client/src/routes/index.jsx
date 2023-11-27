import {createBrowserRouter} from 'react-router-dom'
import App from '@/App'
import SignIn from '@/pages/SignIn'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import SignUp from '@/pages/SignUp'
import PrivateRoute from '@/components/PrivateRoute'
import CreateListing from '@/pages/CreateListing'
import UpdateListing from '@/pages/UpdateListing'
import Listing from '@/pages/Listing'
import Search from '@/pages/Search'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: '<ErrorPage />',
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/listing/:listingId',
        element: <Listing />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/create-listing',
            element: <CreateListing />,
          },
          {
            path: '/update-listing/:listingId',
            element: <UpdateListing />,
          },
        ],
      },
    ],
  },
])
export default routes
