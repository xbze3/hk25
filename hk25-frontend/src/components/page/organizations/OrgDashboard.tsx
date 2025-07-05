import { useState, useEffect } from 'react';
import IncidentFeed from './../../OrgComponents/IncidentFeed';
import IncidentDetail from './../../OrgComponents/IncidentDetail';
import NotificationBell from './../../OrgComponents/NotificationBell';
import IncidentStatsGraph from './../../OrgComponents/IncidentStatsGraph'; // import your graph component
import './../../../components-css/page-css/organization/OrgDashboard.css';

type Incident = {
  description: string;
  link: string;
  type?: string;  // optional because raw data might be missing these
  date?: string;
};

function OrgDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [notifications, setNotifications] = useState<Incident[]>([]);
  const [showIncidentFeed, setShowIncidentFeed] = useState(false);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:3000/incidents'); // adjust route as needed
        const data = await response.json();
        const posts = Array.isArray(data) ? data : [];
        setIncidents(posts);
        setNotifications(posts);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 180000);
    return () => clearInterval(interval);
  }, []);

  // Filter incidents to only those with valid type and date for the graph
  const validIncidents = incidents.filter(
    (i): i is Incident & { type: string; date: string } =>
      typeof i.type === 'string' && typeof i.date === 'string'
  );

  // Toggle IncidentFeed visibility
  const handleBellClick = () => {
    setShowIncidentFeed(!showIncidentFeed);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Incident Dashboard</h1>
        <NotificationBell notifications={notifications} onClick={handleBellClick} />
      </header>

      <main className="dashboard-main">
        {/* Add the graph here */}
        <IncidentStatsGraph incidents={validIncidents} />

        {showIncidentFeed && (
          <IncidentFeed incidents={incidents} onSelect={setSelectedIncident} />
        )}
        {selectedIncident && <IncidentDetail incident={selectedIncident} />}
      </main>
    </div>
  );
}

export default OrgDashboard;
