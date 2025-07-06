import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../../../components-css/ReportModel.css";
import ReportMap from "../../ReportMap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useDictation } from "../../../hooks/useDictation";

interface LogReportModalProps {
    show: boolean;
    handleClose: () => void;
    orgName: string;
}

interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

function LogReportModal({ show, handleClose, orgName }: LogReportModalProps) {
    const { text: dictatedDetails, startDictation, listening } = useDictation();
    const [showSOSConfirm, setShowSOSConfirm] = useState(false);

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
                const decoded = jwtDecode(token) as DecodedToken;
                setUserEmail(decoded.email || null);
            } catch (err) {
                console.error("Failed to decode JWT:", err);
                setUserEmail(null);
            }
        }
    }, []);

    useEffect(() => {
        if (dictatedDetails && !form.details) {
            setForm((prev) => ({
                ...prev,
                details: dictatedDetails,
            }));
        }
    }, [dictatedDetails]);

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
        <>
            <ToastContainer />
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
                                    Selected: Lat {form.location[0].toFixed(5)},
                                    Lng {form.location[1].toFixed(5)}
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
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        details: e.target.value,
                                    }))
                                }
                                required
                            />
                            <Button
                                type="button"
                                onClick={startDictation}
                                className={`mt-2 dictation-button ${
                                    listening ? "listening" : ""
                                }`}
                            >
                                {listening ? "Listening..." : "Start Dictation"}
                            </Button>
                            {/* {dictatedDetails && (
                            <Form.Text className="text-info d-block mt-2">
                                🗣 You said: <em>{dictatedDetails}</em>
                            </Form.Text>
                        )} */}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Attach Media (Optional)</Form.Label>
                            <Form.Control
                                type="file"
                                name="media"
                                accept="image/*,video/*"
                            />
                            <Form.Text className="text-muted">
                                Supported: .jpg, .png, .mp4
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isAnonymous"
                                checked={form.isAnonymous}
                                onChange={handleChange}
                                label="Submit anonymously"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button
                                variant="danger"
                                className="sos-button"
                                onClick={() => setShowSOSConfirm(true)}
                            >
                                SOS
                            </Button>
                            <div>
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
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal
                show={showSOSConfirm}
                onHide={() => setShowSOSConfirm(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm SOS Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="sos-text">
                        Are you sure you want to send an{" "}
                        <strong>SOS Alert</strong>?<br />
                        <br />
                        This will automatically notify emergency services and
                        the <strong>{orgName}</strong> HSSE department and share
                        your current location with them.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowSOSConfirm(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowSOSConfirm(false);
                            toast.success("🚨 SOS alert triggered!");
                        }}
                    >
                        Confirm SOS
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LogReportModal;
