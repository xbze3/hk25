import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import "../../components-css/ListItem.css";
import "../../components-css/page-css/LogoutOrgSearch.css";
import lookingForSomething from "../../assets/looking_for_something.svg";
import LandingNavBar from "../LandingNavBar";
import ReportModal from "../NoLogReportModel";
import { useState } from "react";
import axios from "axios";

function OrgListItem() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleOpenReport = (orgName: string) => {
        setSelectedOrg(orgName);
        setShowModal(true);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setOrganizations([]);
            return;
        }

        try {
            const response = await axios.get(
                "http://localhost:8081/search/organizations",
                {
                    params: { name: searchQuery.trim() },
                }
            );
            setOrganizations(response.data);
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
            setOrganizations([]);
        }
    };

    return (
        <>
            <LandingNavBar />

            <div id="org-search-banner">
                <div id="org-search-wrapper">
                    <input
                        type="text"
                        placeholder="Search for an organization..."
                        id="org-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button id="org-search-button" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            <ListGroup variant="flush" id="result-group">
                {organizations.map((org: any) => (
                    <ListGroup.Item key={org.id || org._id} id="result-item">
                        <div id="list-item-content">
                            <div
                                className="d-flex flex-column pe-3"
                                id="result-item-text-box"
                            >
                                <h5 className="fw-bold mb-1" id="item-title">
                                    {org.name}
                                </h5>
                                <div className="mb-1 text-muted fst-italic">
                                    {org.location}
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

            {organizations.length === 0 && (
                <div className="empty-search-container">
                    <img
                        src={lookingForSomething}
                        alt="Looking for something?"
                        className="empty-search-image"
                    />
                </div>
            )}
        </>
    );
}

export default OrgListItem;
