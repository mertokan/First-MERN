import {createBrowserRouter} from 'react-router-dom'
import App from '@/App'
import Signin from '@/pages/Signin'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Profile from '@/pages/Profile'
import SignUp from '@/pages/SignUp'

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
        element: <Signin />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
])
export default routes
