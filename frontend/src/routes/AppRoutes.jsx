import React from 'react'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import LandingPage from '../screens/LandingPage.jsx'
import Register from '../screens/Register.jsx'
import Home from '../screens/Home.jsx'
import GoogleCallback from '../screens/GoogleCallbackFunc.jsx'
import UserAuth from '../auth/UserAuth.jsx'
const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<UserAuth><Home/></UserAuth>} />
            <Route path='/login' element={<LandingPage/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/auth/google/callback' element={<GoogleCallback/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes