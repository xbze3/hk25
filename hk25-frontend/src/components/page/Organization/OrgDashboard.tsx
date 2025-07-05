import { useState, useEffect } from "react";
import IncidentFeed from "../../OrgComponents/IncidentFeed";
import IncidentDetail from "../../OrgComponents/IncidentDetail";
import NotificationBell from "../../OrgComponents/NotificationBell";
import IncidentStatsGraph from "../../OrgComponents/IncidentStatsGraph";
import "./../../../components-css/page-css/organization/OrgDashboard.css";
import { jwtDecode } from "jwt-decode";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Modal, ListGroup } from "react-bootstrap";

import SG_LOGO from "../../../assets/sg_logo.svg";
import "../../../components-css/NavBar.css";

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
        <>
            <Navbar
                expand="lg"
                className="nav-navy"
                data-bs-theme="dark"
                collapseOnSelect
            >
                <Container fluid>
                    <Navbar.Brand
                        as={Link}
                        to="/user/dashboard"
                        id="navbar-brand"
                    >
                        <img src={SG_LOGO} alt="Safeguard LOGO" id="sg-logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse
                        id="basic-navbar-nav"
                        className="justify-content-end"
                    >
                        <Nav className="align-items-center flex-column flex-lg-row">
                            <Nav.Link>
                                <NotificationBell
                                    notifications={notifications}
                                    onClick={handleBellClick}
                                />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="dashboard-container">
                <main className="dashboard-main">
                    <section className="graph-grid">
                        <div className="dashboard-chart-section">
                            <IncidentStatsGraph incidents={validIncidents} />
                        </div>
                    </section>
                </main>
            </div>

            <Modal
                show={showIncidentFeed}
                onHide={() => setShowIncidentFeed(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Incident Reports</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup variant="flush">
                        {incidents.map((incident) => (
                            <ListGroup.Item
                                key={incident._id}
                                action
                                onClick={() => {
                                    setSelectedIncident(incident);
                                    setShowIncidentFeed(false);
                                }}
                            >
                                <div>
                                    <strong>{incident.type}</strong>
                                    <div className="text-muted small">
                                        {incident.date
                                            ? new Date(
                                                  incident.date
                                              ).toLocaleString()
                                            : "No Date"}{" "}
                                        – {incident.description}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
            </Modal>

            <Modal
                show={selectedIncident !== null}
                onHide={() => setSelectedIncident(null)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Incident Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedIncident && (
                        <IncidentDetail incident={selectedIncident} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default OrgDashboard;
