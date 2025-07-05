import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../../../components-css/ReportModel.css";
import ReportMap from "../../ReportMap";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

interface LogReportModalProps {
    show: boolean;
    handleClose: () => void;
    orgName: string;
}

function LogReportModal({ show, handleClose, orgName }: LogReportModalProps) {
    const [form, setForm] = useState({
        severity: "Low",
        location: null as [number, number] | null,
        details: "",
        isAnonymous: true,
        media: null as File | null,
    });

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUserEmail(decoded.email || null);
            } catch (err) {
                console.error("Failed to decode JWT:", err);
                setUserEmail(null);
            }
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type, checked, files } =
            e.target as HTMLInputElement;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                    ? files?.[0] ?? null
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload = {
                severity: form.severity,
                location: form.location,
                details: form.details,
                isAnonymous: form.isAnonymous,
                organizationName: orgName,
                userEmail: form.isAnonymous ? null : userEmail,
            };

            await axios.post("http://localhost:8081/report", payload);

            toast.success("Report submitted successfully.");
            handleClose();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to submit report.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Report to {orgName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Severity</Form.Label>
                        <Form.Select
                            name="severity"
                            value={form.severity}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Minor">Minor</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                            <option value="Fatal">Fatal</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Select Location on Map</Form.Label>
                        <ReportMap
                            onLocationSelect={(coords) =>
                                setForm({ ...form, location: coords })
                            }
                        />
                        {form.location && (
                            <Form.Text className="text-muted">
                                Selected: Lat {form.location[0].toFixed(5)}, Lng{" "}
                                {form.location[1].toFixed(5)}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Details</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="details"
                            placeholder="Describe the incident..."
                            value={form.details}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="mt-4 d-flex justify-content-end">
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            className="me-2"
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit Report
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LogReportModal;
