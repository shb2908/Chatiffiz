import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';


const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' Component={Homepage} />
        <Route path='/chats' Component={Chatpage} />
        {/* <Route/>
        <Route/> */}
      </Routes>
    </>
  )
}

export default App
