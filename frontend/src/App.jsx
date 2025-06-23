import React from 'react'
import  AppRoutes  from './routes/AppRoutes.jsx'
import { UserProvider } from './context/user.context.jsx'
const App = () => {
  return (
    <div>
      <UserProvider>
      <AppRoutes />
      </UserProvider>
    </div>
  )
}

export default App