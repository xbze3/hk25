import React from "react";
import IncidentActions from "./IncidentActions";
import { Card, Button } from "react-bootstrap";
import "../../components-css/page-css/organization/IncidentDeatils.css";

type Incident = {
    description: string;
    link: string;
};

type IncidentDetailProps = {
    incident: Incident;
};

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident }) => {
    return (
        <Card className="shadow-sm border-0 p-3">
            <Card.Body>
                <Card.Text>
                    <strong>Description:</strong>
                    <br />
                    {incident.description}
                </Card.Text>

                {/* <div className="mb-3">
                    <strong>Reference Link:</strong>
                    <br />
                    <a
                        href={incident.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary mt-2"
                    >
                        Open Link
                    </a>
                </div> */}

                <div>
                    <IncidentActions incident={incident} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default IncidentDetail;
