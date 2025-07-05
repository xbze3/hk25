import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type Incident = {
  type: string;
  date: string;
};

type Props = {
  incidents?: Incident[];
};

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f50',
  '#a0522d',
  '#20b2aa',
  '#ff6347',
];

const dummyIncidents: Incident[] = [
  { type: 'Slip and Fall', date: '2025-06-01T10:30:00Z' },
  { type: 'Equipment Malfunction', date: '2025-06-01T12:00:00Z' },
  { type: 'Slip and Fall', date: '2025-06-02T09:00:00Z' },
  { type: 'Fire Hazard', date: '2025-06-02T14:15:00Z' },
  { type: 'Slip and Fall', date: '2025-06-03T11:45:00Z' },
  { type: 'Equipment Malfunction', date: '2025-06-03T13:00:00Z' },
  { type: 'Fire Hazard', date: '2025-06-04T08:20:00Z' },
  { type: 'Chemical Spill', date: '2025-06-04T15:00:00Z' },
  { type: 'Slip and Fall', date: '2025-06-05T10:00:00Z' },
];

const preventionTips = [
  { incident: 'Slip and Fall', prevention: 'Keep floors clean and dry; use non-slip mats.' },
  { incident: 'Equipment Malfunction', prevention: 'Regular maintenance and inspections.' },
  { incident: 'Fire Hazard', prevention: 'Store flammable materials safely; install detectors.' },
  { incident: 'Chemical Spill', prevention: 'Use proper containers and train staff on handling.' },
];

const IncidentStatsGraph: React.FC<Props> = ({ incidents }) => {
  const dataToUse = incidents && incidents.length > 0 ? incidents : dummyIncidents;

  const typeCounts = dataToUse.reduce<Record<string, number>>((acc, { type }) => {
    if (type) acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  if (!barData.length) {
    return <p style={{ textAlign: 'center', marginTop: 20 }}>No incident data available.</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        maxWidth: 1200,
        margin: '2rem auto',
        padding: '0 1rem',
      }}
    >
      {/* Left half - Bar chart */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ width: '100%', padding: '1rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Workplace Incident Counts by Type
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: number) => [`${value} incidents`, 'Count']} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" animationDuration={800} animationEasing="ease-in-out">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right half - Prevention table */}
      <div
        style={{
          flex: 1,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          padding: '1rem 1.5rem',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflowX: 'auto',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Prevention Tips
        </h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ccc', padding: '0.5rem' }}>
                Incident Type
              </th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '0.5rem' }}>
                Prevention Methods
              </th>
            </tr>
          </thead>
          <tbody>
            {preventionTips.map(({ incident, prevention }) => (
              <tr key={incident}>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                  {incident}
                </td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                  {prevention}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentStatsGraph;
