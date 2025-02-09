import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ScanNFC = () => {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if NFC is supported
  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  const startScanning = async () => {
    if (!nfcSupported) {
      setStatus('NFC is not supported on this device');
      return;
    }

    try {
      setScanning(true);
      setStatus('Scanning for Pokémon card...');
      setError(null);
      
      const ndef = new NDEFReader();
      await ndef.scan();
      
      ndef.addEventListener('reading', ({ message }) => {
        try {
          // Get the hash from the NFC card
          const textDecoder = new TextDecoder();
          const hashRecord = message.records.find(record => 
            record.recordType === "text" && 
            textDecoder.decode(record.data).startsWith('0x')
          );

          if (!hashRecord) {
            throw new Error('Invalid Pokémon card - No hash found');
          }

          const hash = textDecoder.decode(hashRecord.data);
          setStatus('Pokémon card detected! 🎉');
          
          // Redirect to the reveal page with the hash
          navigate(`/model?hash=${hash}`);
          
        } catch (error) {
          console.error('Error reading Pokémon card:', error);
          setError(error.message);
          setStatus('Error: ' + error.message);
        } finally {
          setScanning(false);
        }
      });

      ndef.addEventListener('error', (error) => {
        console.error('NFC Error:', error);
        setError('Error scanning card. Please try again.');
        setStatus('Error scanning card. Please try again.');
        setScanning(false);
      });

    } catch (error) {
      console.error('Error scanning NFC:', error);
      setError('Error initializing NFC scanner');
      setStatus('Error initializing NFC scanner');
      setScanning(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
            Scan Your Pokémon Card
          </h1>
          
          {!nfcSupported && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-200">
                NFC is not supported on this device. Please use a device with NFC capabilities.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Scan Button with Animation */}
            <div className="relative">
              <button
                onClick={startScanning}
                disabled={scanning || !nfcSupported}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium
                  ${scanning 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {scanning ? 'Scanning...' : 'Scan Pokémon Card'}
              </button>
              
              {/* Scanning Animation */}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-full h-full border-4 border-purple-500 rounded-lg animate-ping"></div>
                </div>
              )}
            </div>

            {/* Status Display */}
            {status && (
              <div className={`p-4 rounded-lg ${
                error 
                  ? 'bg-red-900/50 text-red-200 border border-red-500' 
                  : 'bg-purple-900/50 text-purple-200 border border-purple-500'
              }`}>
                <p className="font-medium">{status}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-purple-300">How to Scan:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Click the "Scan Pokémon Card" button above</li>
                <li>Hold your Pokémon card near your device's NFC reader</li>
                <li>Keep the card steady until scanning is complete</li>
                <li>You'll be automatically redirected to see your Pokémon!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanNFC; 