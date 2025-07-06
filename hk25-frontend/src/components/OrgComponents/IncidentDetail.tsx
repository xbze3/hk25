import IncidentActions from "./IncidentActions";
import IncidentMap from "../IncidentMap";
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
    location?: {
        lat?: number;
        lng?: number;
    };
};

type IncidentDetailProps = {
    incident: Incident;
};

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident }) => {
    const { lat, lng } = incident.location || {};

    return (
        <Card>
            <Card.Body>
                <Card.Text>
                    <strong>Title: </strong> {incident.title} <br />
                    <strong>Reported By: </strong>{" "}
                    {incident.reportedBy?.email ?? "null"} <br />
                    <strong>Description: </strong> {incident.description} <br />
                    <strong>Location: </strong>
                    <strong> Longitude: </strong> {lng ?? "null"},{" "}
                    <strong>Latitude: </strong> {lat ?? "null"}
                </Card.Text>

                {lat !== undefined && lng !== undefined && (
                    <IncidentMap lat={lat} lng={lng} />
                )}

                <div className="mt-4">
                    <IncidentActions incident={incident} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default IncidentDetail;
