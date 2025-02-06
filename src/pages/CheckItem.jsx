import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const CheckItem = () => {
  const [scanning, setScanning] = useState(false)
  const [cardId, setCardId] = useState(null)
  const [status, setStatus] = useState('')
  const [trackingData, setTrackingData] = useState(null)

  // Dummy data for tracking history
  const dummyTrackingData = {
    itemId: "NFC-123456",
    productName: "Premium Coffee Beans",
    trackingHistory: [
      {
        id: 1,
        timestamp: "2024-03-15T14:30:00",
        location: "Jakarta, Indonesia",
        status: "Product harvested and packed",
        handler: "ABC Farms"
      },
      {
        id: 2,
        timestamp: "2024-03-16T09:15:00",
        location: "Jakarta Port",
        status: "Shipped for export",
        handler: "Global Shipping Co."
      },
      {
        id: 3,
        timestamp: "2024-03-18T16:45:00",
        location: "Singapore Hub",
        status: "Transit checkpoint",
        handler: "SG Logistics"
      },
      {
        id: 4,
        timestamp: "2024-03-20T11:20:00",
        location: "Melbourne, Australia",
        status: "Arrived at destination warehouse",
        handler: "AU Distribution"
      }
    ]
  }

  const startScanning = async () => {
    try {
      setScanning(true)
      setStatus('Scanning for NFC card...')
      
      // Simulate NFC scanning with setTimeout
      setTimeout(() => {
        setCardId(dummyTrackingData.itemId)
        setTrackingData(dummyTrackingData)
        setStatus('Card scanned successfully!')
        setScanning(false)
      }, 2000)

    } catch (error) {
      console.error('Error scanning NFC:', error)
      setStatus('Error scanning NFC card')
      setScanning(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Check Item History</h1>

          {/* Scan Button */}
          <div className="mb-8">
            <button
              onClick={startScanning}
              disabled={scanning}
              className={`w-full py-3 px-4 rounded-md text-white font-medium
                ${scanning 
                  ? 'bg-gray-400' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {scanning ? 'Scanning...' : 'Scan NFC Card'}
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">{status}</p>
            </div>
          )}

          {/* Tracking Information */}
          {trackingData && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-2">Product Information</h2>
                <p className="text-gray-600">Product ID: {trackingData.itemId}</p>
                <p className="text-gray-600">Name: {trackingData.productName}</p>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Tracking History</h2>
                <div className="space-y-4">
                  {trackingData.trackingHistory.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="relative pl-8 pb-4"
                    >
                      {/* Timeline connector */}
                      {index !== trackingData.trackingHistory.length - 1 && (
                        <div className="absolute left-[11px] top-[22px] w-0.5 h-full bg-blue-200"></div>
                      )}
                      
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500"></div>
                      
                      {/* Event content */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDate(event.timestamp)}
                        </div>
                        <div className="font-medium text-gray-800 mb-1">
                          {event.status}
                        </div>
                        <div className="text-sm text-gray-600">
                          Location: {event.location}
                        </div>
                        <div className="text-sm text-gray-600">
                          Handler: {event.handler}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckItem 