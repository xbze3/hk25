import React from "react";
import IncidentActions from "./IncidentActions";
import { Card } from "react-bootstrap";
import "../../components-css/page-css/organization/IncidentDeatils.css";

type Incident = {
    _id?: string;
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
};

type IncidentDetailProps = {
    incident: Incident;
};

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Text>
                    <strong>Title: </strong> {incident.title} <br />
                    <strong>Reported By: </strong> {incident.reportedBy?.email}{" "}
                    <br />
                    <strong>Description: </strong> {incident.description} <br />
                </Card.Text>

                <div>
                    <IncidentActions incident={incident} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default IncidentDetail;
