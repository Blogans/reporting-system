import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/test')
      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <>
      <h1>React + Express Test</h1>
      {message && <p>Server says: {message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
  )
}

export default App