import _React, { useEffect, useState } from 'react';

const App = () => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/ping`)  // Remove http://localhost:3000 to make it relative
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setResponse(data.message);
        setError('');
      })
      .catch(err => {
        console.error('Error:', err);
        setError('Error connecting to server');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && <p>Server response: {response}</p>}
    </div>
  );
};

export default App;