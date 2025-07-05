import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../../../components-css/ReportModel.css";
import ReportMap from "../../ReportMap";

interface LogReportModalProps {
    show: boolean;
    handleClose: () => void;
    orgName: string;
}

function LogReportModal({ show, handleClose, orgName }: LogReportModalProps) {
    const [form, setForm] = useState({
        severity: "low",
        location: null as [number, number] | null,
        details: "",
        isAnonymous: false,
        media: null as File | null,
    });

    // const [location, setLocation] = useState<[number, number] | null>(null);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Report submitted:", { ...form, organization: orgName });
        handleClose();
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

                    <Form.Group className="mb-3">
                        <Form.Label>Attach Media</Form.Label>
                        <Form.Control
                            type="file"
                            name="media"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Check
                        type="checkbox"
                        label="Submit anonymously"
                        name="isAnonymous"
                        checked={form.isAnonymous}
                        onChange={handleChange}
                    />

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
