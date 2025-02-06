import { useState } from 'react'
import Navbar from '../components/Navbar'

const MintItem = () => {
  const [scanning, setScanning] = useState(false)
  const [status, setStatus] = useState('')
  const [nfcId, setNfcId] = useState(null)
  const [minting, setMinting] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    manufacturer: '',
    manufacturingDate: '',
    productCategory: '',
    description: '',
    ownerWallet: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const startScanning = async () => {
    try {
      setScanning(true)
      setStatus('Scanning for NFC card...')
      
      // Simulate NFC scanning with setTimeout
      setTimeout(() => {
        const mockNfcId = 'NFC-' + Math.random().toString(36).substr(2, 9)
        setNfcId(mockNfcId)
        setStatus('Card scanned successfully!')
        setScanning(false)
      }, 2000)

    } catch (error) {
      console.error('Error scanning NFC:', error)
      setStatus('Error scanning NFC card')
      setScanning(false)
    }
  }

  const handleMint = async (e) => {
    e.preventDefault()
    if (!nfcId) {
      setStatus('Please scan an NFC card first')
      return
    }

    try {
      setMinting(true)
      setStatus('Minting NFT...')

      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would call your smart contract's mint function
      // const transaction = await contract.mintNFT(nfcId, formData)
      // await transaction.wait()

      setStatus('NFT minted successfully!')
      // Reset form
      setFormData({
        productName: '',
        manufacturer: '',
        manufacturingDate: '',
        productCategory: '',
        description: '',
        ownerWallet: ''
      })
      setNfcId(null)
    } catch (error) {
      console.error('Error minting NFT:', error)
      setStatus('Error minting NFT')
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Mint New Item</h1>

          {/* NFC Scanning Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Step 1: Scan NFC Card</h2>
            <button
              onClick={startScanning}
              disabled={scanning}
              className={`w-full py-3 px-4 rounded-md text-white font-medium
                ${scanning || minting
                  ? 'bg-gray-400' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {scanning ? 'Scanning...' : 'Scan NFC Card'}
            </button>
            
            {nfcId && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">
                  <span className="font-medium">Card ID:</span> {nfcId}
                </p>
              </div>
            )}
          </div>

          {/* Status Message */}
          {status && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">{status}</p>
            </div>
          )}

          {/* Product Information Form */}
          <form onSubmit={handleMint} className="space-y-6">
            <h2 className="text-xl font-semibold">Step 2: Enter Product Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Category
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="food">Food & Beverage</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Wallet Address
                </label>
                <input
                  type="text"
                  name="ownerWallet"
                  value={formData.ownerWallet}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!nfcId || minting}
                className={`w-full py-3 px-4 rounded-md text-white font-medium
                  ${!nfcId || minting
                    ? 'bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700'}`}
              >
                {minting ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MintItem 