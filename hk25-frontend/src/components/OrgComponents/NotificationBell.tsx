import React from 'react';
import { Bell } from 'lucide-react';

type Incident = {
  description: string;
  link: string;
};

type Props = {
  notifications?: Incident[];
  onClick?: () => void;  // Add this
};

const NotificationBell: React.FC<Props> = ({ notifications = [], onClick }) => {
  return (
    <div className="notification-bell" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Bell />
      {notifications.length > 0 && (
        <span className="badge">{notifications.length}</span>
      )}
    </div>
  );
};

export default NotificationBell;
