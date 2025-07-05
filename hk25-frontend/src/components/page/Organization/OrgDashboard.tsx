import { useState, useEffect } from "react";
import IncidentFeed from "../../OrgComponents/IncidentFeed";
import IncidentDetail from "../../OrgComponents/IncidentDetail";
import NotificationBell from "../../OrgComponents/NotificationBell";
import IncidentStatsGraph from "../../OrgComponents/IncidentStatsGraph";
import "./../../../components-css/page-css/organization/OrgDashboard.css";
import { jwtDecode } from "jwt-decode";

export interface Incident {
    _id?: string;
    description: string;
    link: string;
    type?: string;
    date?: string;
    organizationId?: string;
}

interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
    userType: string;
}

function OrgDashboard() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
        null
    );
    const [notifications, setNotifications] = useState<Incident[]>([]);
    const [showIncidentFeed, setShowIncidentFeed] = useState(false);
    const [orgId, setOrgId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setOrgId(decoded.id);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!orgId) return;

        const fetchIncidents = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8081/reports/organization/${orgId}`
                );
                const data = await response.json();
                const reports: Incident[] = Array.isArray(data) ? data : [];
                setIncidents(reports);
                setNotifications(reports);
            } catch (error) {
                console.error("Error fetching incidents:", error);
            }
        };

        fetchIncidents();
        const interval = setInterval(fetchIncidents, 180000);
        return () => clearInterval(interval);
    }, [orgId]);

    const validIncidents = incidents.filter(
        (i): i is Incident & { type: string; date: string } =>
            typeof i.type === "string" && typeof i.date === "string"
    );

    const handleBellClick = () => {
        setShowIncidentFeed((prev) => !prev);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Incident Dashboard</h1>
                <NotificationBell
                    notifications={notifications}
                    onClick={handleBellClick}
                />
            </header>

            <main className="dashboard-main">
                <IncidentStatsGraph incidents={validIncidents} />

                {showIncidentFeed && (
                    <IncidentFeed
                        incidents={incidents}
                        onSelect={setSelectedIncident}
                    />
                )}

                {selectedIncident && (
                    <IncidentDetail incident={selectedIncident} />
                )}
            </main>
        </div>
    );
}

export default OrgDashboard;
