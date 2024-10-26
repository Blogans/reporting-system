import _React, { useEffect, useState } from 'react';

const App = () => {
  const [response, setResponse] = useState('');

  const URL = 'https://incident-report-system-g4dtfwhwegdvc7ah.australiaeast-01.azurewebsites.net'
  
  useEffect(() => {
    fetch(`${URL}/api/ping`)
      .then(res => res.json())
      .then(data => setResponse(data.message))
      .catch(_err => setResponse('Error connecting to server'));
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Server response: {response}</p>
    </div>
  );
};

export default App;