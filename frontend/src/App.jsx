import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:8000/health')
      .then(response => {
        setHealth(response.data)
      })
      .catch(error => {
        console.error('Error fetching backend health:', error)
        setHealth({ status: 'error', message: 'Could not connect to backend' })
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">AI Digital Passport</h1>
        <p className="text-gray-600 mb-4">Prototype Frontend running.</p>
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Backend Connection Status:</h2>
          {health ? (
            <div>
              <p className={health.status === 'ok' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {health.message}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 animate-pulse">Checking backend...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
