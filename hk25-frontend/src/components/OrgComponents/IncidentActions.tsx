import React, { useState } from 'react';
import CategorySelector from './CategorySelector';

type Incident = {
  description: string;
  link: string;
};

type Props = {
  incident: Incident;
};

const IncidentActions: React.FC<Props> = ({ incident }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [responseText, setResponseText] = useState('');

  const handleCategorize = () => {
    // Replace with backend API call to update categories
    alert(`Categorized Incident:\n"${incident.description.slice(0, 100)}..."\nCategories: ${selectedCategories.join(', ') || 'None'}`);
  };

  const handleRespond = () => {
    // Replace with email/system response sending logic
    alert(`Response sent for:\n"${incident.description.slice(0, 100)}..."\nResponse: ${responseText || '(No response text)'}`);
  };

  return (
    <div className="incident-actions">
      <CategorySelector
        selectedCategories={selectedCategories}
        onChange={setSelectedCategories}
      />

      <textarea
        placeholder="Write your response..."
        value={responseText}
        onChange={e => setResponseText(e.target.value)}
        rows={5}
        style={{ width: '100%', marginTop: '1rem' }}
      />

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handleCategorize}>Categorize</button>
        <button onClick={handleRespond}>Send Response</button>
      </div>
    </div>
  );
};

export default IncidentActions;
