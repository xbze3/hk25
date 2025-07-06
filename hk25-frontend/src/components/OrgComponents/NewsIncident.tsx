import IncidentActions from "./IncidentActions";
import { Card } from "react-bootstrap";
import "../../components-css/page-css/organization/IncidentDeatils.css";

type Incident = {
    _id: string;
    description: string;
    link: string;
};

type NewsIncidentDetailProps = {
    incident: Incident;
};

const NewsIncident: React.FC<NewsIncidentDetailProps> = ({ incident }) => {

    return (
        <Card>
            <Card.Body>
                <Card.Text>
                    <strong>Description: </strong> {incident.description} <br />
                    <strong>Link: </strong> {incident.link} <br />
                </Card.Text>

                <div className="mt-4">
                    <IncidentActions incident={incident} />
                </div>

            </Card.Body>
        </Card>
    );
};

export default NewsIncident;
