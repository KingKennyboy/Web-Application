import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Layout from './Layout'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import FuelQuote from './Pages/FuelQuote/FuelQuote'
import FuelQuoteHistory from './Pages/FuelQuoteHistory'
import DisplayProfile from './Pages/Profile/DisplayProfile'
import ProfileForm from './Pages/Profile/ProfileForm'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        Initial Page
        <Route index element={<Home />} />
        <Route path='/profileForm' element={<ProfileForm />} />
        {/* Register/Login */}
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        {/* Login Content */}
        <Route  element={<Layout/>}>
          <Route path='/displayProfile' element={<DisplayProfile />} />
          <Route path='/fuelquote' element={<FuelQuote />} />
          <Route path='/fuelquotehistory' element={<FuelQuoteHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App