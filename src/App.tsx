import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://https://incident-report-system-g4dtfwhwegdvc7ah.australiaeast-01.azurewebsites.net:8080/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setError(err.message))
  }, [])

  return (
    <>
      <h1>React + Express Test</h1>
      {message && <p>Server says: {message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
  )
}

export default App