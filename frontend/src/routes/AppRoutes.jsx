import React from 'react'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import GoogleCallback from '../screens/GoogleCallback'
import UserAuth from '../auth/UserAuth'
const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<UserAuth><Home/></UserAuth>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/auth/google/callback' element={<GoogleCallback/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes