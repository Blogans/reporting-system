import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('https://https://incident-report-system-g4dtfwhwegdvc7ah.australiaeast-01.azurewebsites.net/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => {
        console.error(err)
        setMessage('Error connecting to server')
      })
  }, [])

  return <div>{message}</div>
}

export default App