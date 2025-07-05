import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UserNavBar from "./UserNavBar";
import ListGroup from "react-bootstrap/ListGroup";

interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

interface Report {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: string;
}

function UserMyReports() {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;

                const decoded = jwtDecode(token) as DecodedToken;

                const response = await axios.get(
                    "http://localhost:8081/user/my-reports",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReports(response.data);
            } catch (err) {
                console.error("Error fetching reports:", err);
            }
        };

        fetchReports();
    }, []);

    return (
        <>
            <UserNavBar />
            <div className="w-100">
                <ListGroup>
                    {reports.map((report) => (
                        <ListGroup.Item
                            key={report._id}
                            className="border report-item"
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="">
                                    <h5 className="fw-bold text-dark">
                                        {report.title}
                                    </h5>
                                    <p className="mb-2 text-secondary">
                                        {report.description}
                                    </p>
                                    <div className="small text-muted">
                                        <strong>Category:</strong>{" "}
                                        {report.category} &nbsp;|&nbsp;
                                        <strong>Status:</strong> {report.status}{" "}
                                        &nbsp;|&nbsp;
                                        <strong>Submitted:</strong>{" "}
                                        {new Date(
                                            report.createdAt
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <span
                                    className={`badge rounded-pill px-3 py-2 ${
                                        report.status === "Resolved"
                                            ? "bg-success"
                                            : report.status === "In Review"
                                            ? "bg-warning text-dark"
                                            : "bg-secondary"
                                    }`}
                                    style={{ height: "fit-content" }}
                                >
                                    {report.status}
                                </span>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </>
    );
}

export default UserMyReports;
