import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error:', err))
  }, [])

  return (
    <>
      <h1>Vite + React + Express</h1>
      <div>
        API Message: {message}
      </div>
    </>
  )
}

export default App