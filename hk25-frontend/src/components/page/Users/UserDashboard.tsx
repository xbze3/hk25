import UserNavBar from "./UserNavBar";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import "../../../components-css/ListItem.css";
import "../../../components-css/page-css/LogoutOrgSearch.css";
import ReportModal from "./LogReportModel";
import { useState } from "react";

function UserDashboard() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState("");

    const handleOpenReport = (orgName: string) => {
        setSelectedOrg(orgName);
        setShowModal(true);
    };

    const organizations = [
        {
            id: "1",
            name: "Ministry of Health",
            description:
                "Responsible for national healthcare infrastructure and policy.",
            contact: "health@gov.gy",
        },
        {
            id: "2",
            name: "Guyana Fire Service",
            description: "Emergency services, fire prevention and response.",
            contact: "fire@gov.gy",
        },
        {
            id: "3",
            name: "Guyana Power & Light",
            description:
                "Provider of national electricity services and maintenance.",
            contact: "info@gplinc.com",
        },
    ];

    return (
        <>
            <UserNavBar />

            <div id="org-search-banner">
                <div id="org-search-wrapper">
                    <input
                        type="text"
                        placeholder="Search for an organization..."
                        id="org-search-input"
                    />
                    <button id="org-search-button">Search</button>
                </div>
            </div>

            <ListGroup variant="flush" id="result-group">
                {organizations.map((org) => (
                    <ListGroup.Item key={org.id} id="result-item">
                        <div id="list-item-content">
                            <div
                                className="d-flex flex-column pe-3"
                                id="result-item-text-box"
                            >
                                <h5 className="fw-bold mb-1" id="item-title">
                                    {org.name}
                                </h5>

                                <div className="mb-1 text-muted fst-italic">
                                    {org.contact}
                                </div>

                                <div className="mb-1 text-muted fst-italic">
                                    {org.description}
                                </div>
                            </div>

                            <div
                                id="view-button-div"
                                style={{ minWidth: "100px" }}
                            >
                                <Button
                                    variant="primary"
                                    id="result-item-view-button"
                                    onClick={() => handleOpenReport(org.name)}
                                >
                                    Make Report
                                </Button>

                                {/* <Button
                                    variant="success"
                                    id="result-item-view-button"
                                    onClick={() =>
                                        alert(
                                            `Join request sent to ${org.name}`
                                        )
                                    }
                                >
                                    Join Organization
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    id="result-item-view-button"
                                    onClick={() =>
                                        alert(`Viewing reports for ${org.name}`)
                                    }
                                >
                                    View Reports
                                </Button> */}
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <ReportModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                orgName={selectedOrg}
            />
        </>
    );
}

export default UserDashboard;
