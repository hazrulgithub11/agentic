import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center pt-20">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      </div>
    </div>
  )
}

export default Home