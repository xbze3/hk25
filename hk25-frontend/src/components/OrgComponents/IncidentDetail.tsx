import React from 'react';
import IncidentActions from './IncidentActions';

type Incident = {
  description: string;
  link: string;
};

type IncidentDetailProps = {
  incident: Incident;
};

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident }) => {
  return (
    <div className="incident-detail">
      <h3>Incident Details</h3>
      <p>{incident.description}</p>
      <a href={incident.link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>

      <IncidentActions incident={incident} />
    </div>
  );
};

export default IncidentDetail;
