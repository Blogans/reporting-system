import _React, { useEffect, useState } from 'react';

interface DashboardStats {
  totalIncidents: number;
  totalWarnings: number;
  totalBans: number;
  totalVenues: number;
}

const App = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8080/api/dashboard/stats')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => setStats(data))
      .catch(_err => setError('Error fetching dashboard stats'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h2 className="font-bold">Total Incidents</h2>
            <p className="text-xl">{stats.totalIncidents}</p>
          </div>
          <div className="border p-4 rounded">
            <h2 className="font-bold">Total Warnings</h2>
            <p className="text-xl">{stats.totalWarnings}</p>
          </div>
          <div className="border p-4 rounded">
            <h2 className="font-bold">Total Bans</h2>
            <p className="text-xl">{stats.totalBans}</p>
          </div>
          <div className="border p-4 rounded">
            <h2 className="font-bold">Total Venues</h2>
            <p className="text-xl">{stats.totalVenues}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;