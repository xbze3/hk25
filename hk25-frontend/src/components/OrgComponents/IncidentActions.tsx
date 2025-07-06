import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "../../components-css/page-css/organization/IncidentActions.css";

type Incident = {
    _id: string;
    description: string;
    link: string;
};

type Props = {
    incident: Incident;
};

const IncidentActions: React.FC<Props> = ({ incident }) => {
    const [responseText, setResponseText] = useState("");

    const handleRespond = () => {
        alert(
            `Response sent for:\n"${incident.description.slice(
                0,
                100
            )}..."\nResponse: ${responseText || "(No response text)"}`
        );
    };

    const markAsResolved = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:8081/report/mark-resolved/${incident._id}`
            );

            if (response.status === 200) {
                toast.success("Incident marked as resolved.");
            }
        } catch (error) {
            console.error("Failed to mark as resolved", error);
            toast.error("Failed to update incident.");
        }
    };

    return (
        <div className="incident-actions">
            <ToastContainer />
            <textarea
                placeholder="Write your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={5}
                style={{ width: "100%", marginTop: "1rem" }}
            />

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button onClick={handleRespond} id="send-button-actions">
                    Send Response
                </button>

                <button onClick={markAsResolved} id="send-button-actions">
                    Mark as Resolved
                </button>
            </div>
        </div>
    );
};

export default IncidentActions;
