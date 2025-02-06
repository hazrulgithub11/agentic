import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const ScanProduct = () => {
  const [nfcSupported, setNfcSupported] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [cardId, setCardId] = useState(null)
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('')

  // Check if NFC is supported
  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true)
    }
  }, [])

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    } catch (error) {
      console.error('Error getting location:', error)
      setStatus('Error getting location')
      return null
    }
  }

  const startScanning = async () => {
    if (!nfcSupported) {
      setStatus('NFC is not supported on this device')
      return
    }

    try {
      setScanning(true)
      setStatus('Scanning for NFC card...')
      
      const ndef = new NDEFReader()
      await ndef.scan()
      
      ndef.addEventListener('reading', async ({ serialNumber }) => {
        setCardId(serialNumber)
        setStatus('Card detected! Getting location...')
        
        // Get location when card is scanned
        const locationData = await getCurrentLocation()
        if (locationData) {
          setLocation(locationData)
          setStatus('Ready to update blockchain')
          // Here you would call your smart contract function
          // await updateSupplyChain(serialNumber, locationData)
        }
      })

    } catch (error) {
      console.error('Error scanning NFC:', error)
      setStatus('Error scanning NFC card')
      setScanning(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Supply Chain Tracking</h1>
          
          {!nfcSupported && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              NFC is not supported on this device
            </div>
          )}

          <div className="space-y-6">
            {/* Scan Button */}
            <div>
              <button
                onClick={startScanning}
                disabled={scanning || !nfcSupported}
                className={`w-full py-3 px-4 rounded-md text-white font-medium
                  ${scanning 
                    ? 'bg-gray-400' 
                    : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {scanning ? 'Scanning...' : 'Scan NFC Card'}
              </button>
            </div>

            {/* Status Display */}
            {status && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{status}</p>
              </div>
            )}

            {/* Card Info Display */}
            {cardId && (
              <div className="border rounded-md p-4 space-y-2">
                <div>
                  <span className="font-medium">Card ID: </span>
                  <span className="text-gray-700">{cardId}</span>
                </div>
                {location && (
                  <div>
                    <span className="font-medium">Location: </span>
                    <span className="text-gray-700">
                      {`${location.latitude}, ${location.longitude}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanProduct 