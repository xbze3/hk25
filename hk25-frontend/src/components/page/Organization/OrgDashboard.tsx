import { useState, useEffect, useCallback } from "react";
import IncidentDetail from "../../OrgComponents/IncidentDetail";
import NotificationBell from "../../OrgComponents/NotificationBell";
import IncidentStatsGraph from "../../OrgComponents/IncidentStatsGraph";
import "./../../../components-css/page-css/organization/OrgDashboard.css";
import { jwtDecode } from "jwt-decode";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Modal, ListGroup, Button, ButtonGroup, Spinner, Alert } from "react-bootstrap";

import SG_LOGO from "../../../assets/sg_logo.svg";
import "../../../components-css/NavBar.css";

export interface Incident {
  _id: string;
  description: string;
  title: string;
  link: string;
  type?: string;
  date?: string;
  reportedBy?: {
    email?: string;
  };
  organizationId?: string;
  createdAt: string;
  location: {
    lat: number;
    lng: number;
  };
  status?: string;
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
  const [newsIncidents, setNewsIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [notifications, setNotifications] = useState<Incident[]>([]);
  const [showIncidentFeed, setShowIncidentFeed] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<"incidents" | "users">("incidents");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Decode token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          window.location.href = "/";
        } else {
          setOrgId(decoded.id);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchIncidents = useCallback(async () => {
    if (!orgId) return [];

    try {
      const response = await fetch(`http://localhost:8081/reports/organization/${orgId}`);
      if (!response.ok) throw new Error("Failed to fetch incidents");
      const data = await response.json();
      const reports: Incident[] = Array.isArray(data) ? data : [];
      setIncidents(reports);
      return reports;
    } catch (error: any) {
      setError("Failed to load reported incidents.");
      console.error(error);
      return [];
    }
  }, [orgId]);

  const fetchNewsIncidents = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/incidents`);
      if (!response.ok) throw new Error("Failed to fetch news incidents");
      const data = await response.json();
      const news: Incident[] = Array.isArray(data) ? data : [];
      setNewsIncidents(news);
      return news;
    } catch (error: any) {
      setError("Failed to load AI-scraped incidents.");
      console.error(error);
      return [];
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    const [reported, news] = await Promise.all([fetchIncidents(), fetchNewsIncidents()]);
    setNotifications([...reported, ...news]);
    setLoading(false);
  }, [orgId, fetchIncidents, fetchNewsIncidents]);

  useEffect(() => {
    if (orgId) {
      loadData();

      const interval = setInterval(loadData, 180000); // 3 min refresh
      return () => clearInterval(interval);
    }
  }, [orgId, loadData]);

  const validIncidents = incidents.filter(
    (i): i is Incident & { type: string; date: string } =>
      typeof i.type === "string" && typeof i.date === "string"
  );

  const handleBellClick = () => {
    setShowIncidentFeed((prev) => !prev);
  };

  return (
    <>
      <Navbar expand="lg" className="nav-navy" data-bs-theme="dark" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand as={Link} to="/user/dashboard" id="navbar-brand">
            <img src={SG_LOGO} alt="Safeguard LOGO" id="sg-logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center flex-column flex-lg-row">
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => localStorage.removeItem("authToken")}
              >
                Logout
              </Nav.Link>
              <Nav.Link>
                <NotificationBell notifications={notifications} onClick={handleBellClick} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="dashboard-container">
        <main className="dashboard-main">
          <section className="graph-grid">
            <div className="dashboard-chart-section">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <IncidentStatsGraph incidents={validIncidents} />
              )}
            </div>
          </section>
        </main>
      </div>

      <Modal show={showIncidentFeed} onHide={() => setShowIncidentFeed(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Incident Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="switch-button-wrapper" className="d-flex justify-content-between align-items-center">
            <ButtonGroup className="mb-3" id="report-button-wrapper">
              <Button
                variant={activeList === "incidents" ? "primary" : "outline-primary"}
                onClick={() => setActiveList("incidents")}
              >
                View Reported Incidents
              </Button>
              <Button
                variant={activeList === "users" ? "primary" : "outline-primary"}
                onClick={() => setActiveList("users")}
              >
                View AI-Scraped Incidents
              </Button>
            </ButtonGroup>
            <Button variant="outline-secondary" onClick={loadData}>
              Reload
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : activeList === "incidents" ? (
            <ListGroup variant="flush">
              {incidents.map((incident) => (
                <ListGroup.Item
                  key={incident._id}
                  action
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div>
                    <strong>{incident.type}</strong>
                    <div className="text-muted small">
                      {incident.title} –{" "}
                      {incident.createdAt
                        ? new Date(incident.createdAt).toLocaleString()
                        : "No Date"}{" "}
                      – {incident.description} – {incident.status}
                      {incident.status === "Resolved" && (
                        <span style={{ color: "green", marginLeft: "0.5rem" }}>✔</span>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
              <ListGroup variant="flush">
                {newsIncidents
                    .filter((incident) => incident.description !== "Submit")
                    .map((incident) => (
                        <ListGroup.Item
                            key={incident._id}
                            action
                            as="a"
                            href={incident.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                          <div>
                            <div className="text-muted small">
                              {incident.description || "No description"}
                            </div>
                          </div>
                        </ListGroup.Item>
                    ))}
              </ListGroup>

          )}
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
          {selectedIncident && <IncidentDetail incident={selectedIncident} />}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OrgDashboard;
