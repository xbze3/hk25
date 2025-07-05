import React from 'react';

type Incident = {
  description: string;
  link: string;
};

interface IncidentFeedProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

const IncidentFeed: React.FC<IncidentFeedProps> = ({ incidents, onSelect }) => {
  console.log('IncidentFeed rendering with incidents:', incidents);

  if (!incidents || incidents.length === 0) {
    return <p>No incidents available.</p>;
  }

  return (
    <div className="incident-feed">
      <h2>Incoming Reports</h2>
      <ul>
        {incidents.map((incident, index) => (
          <li
            key={index}
            onClick={() => onSelect(incident)}
            style={{ cursor: 'pointer', marginBottom: '1rem' }}
          >
            <p>{incident.description.slice(0, 100)}...</p>
            <a
              href={incident.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View Source
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentFeed;
