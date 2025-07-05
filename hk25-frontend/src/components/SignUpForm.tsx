import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components-css/SignUpForm.css";
import sgOutline from "../assets/sg-outline-signup.svg";
import { toast } from "react-toastify";

function SignUpForm() {
    const [activeTab, setActiveTab] = useState<"user" | "organization">("user");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [orgName, setOrgName] = useState("");
    const [orgType, setOrgType] = useState("");
    const [orgLoc, setOrgLoc] = useState("");
    const [orgDesc, setOrgDesc] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();

    const validatePassword = (pwd: string) => {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasNumber = /\d/.test(pwd);
        const isLengthValid = pwd.length >= 8;
        return hasUpperCase && hasNumber && isLengthValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitError("");
        setLoading(true);

        const newErrors: { [key: string]: string } = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid.";
        }

        if (!validatePassword(password)) {
            newErrors.password =
                "Password must be 8+ characters, include one uppercase letter and one number.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (activeTab === "user") {
            if (!firstName.trim()) {
                newErrors.firstName = "First name is required.";
            }
            if (!lastName.trim()) {
                newErrors.lastName = "Last name is required.";
            }
        } else if (activeTab === "organization") {
            if (!orgName.trim()) {
                newErrors.orgName = "Organization name is required.";
            }
            if (!orgType.trim()) {
                newErrors.orgType = "Organization type is required.";
            }
            if (!orgLoc.trim()) {
                newErrors.orgLoc = "Organization location is required.";
            }
            if (!orgDesc.trim()) {
                newErrors.orgDesc = "Organization description is required.";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const url =
                    activeTab === "user"
                        ? "http://localhost:8081/signup/user"
                        : "http://localhost:8081/signup/organization";

                const payload =
                    activeTab === "user"
                        ? { firstName, lastName, email, password }
                        : {
                              orgName,
                              orgType,
                              orgLoc,
                              orgDesc,
                              email,
                              password,
                          };

                const response = await axios.post(url, payload);

                localStorage.setItem("authToken", response.data.token);

                toast.success("Sign up successful!");
                setTimeout(() => navigate("/login"), 1500);

                setFirstName("");
                setLastName("");
                setOrgName("");
                setOrgType("");
                setOrgLoc("");
                setOrgDesc("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setErrors({});
            } catch (error: any) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Signup failed. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Link to="/" id="back-button">
                ← Back to Home
            </Link>

            <div id="signup-wrapper">
                <div className="signup-tabs">
                    <button
                        className={`signup-tab ${
                            activeTab === "user" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("user")}
                    >
                        Sign up as User
                    </button>
                    <button
                        className={`signup-tab ${
                            activeTab === "organization" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("organization")}
                    >
                        Sign up as Organization
                    </button>
                </div>

                <div className="signup-container">
                    <div id="banner-container">
                        <img
                            src={sgOutline}
                            alt="SG Banner"
                            id="case-bank-banner"
                        />
                    </div>

                    <form
                        className="signup-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {activeTab === "user" ? (
                            <>
                                <div className="form-group">
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="Enter your First Name"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                    {errors.firstName && (
                                        <p className="error">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Enter your Last Name"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                    {errors.lastName && (
                                        <p className="error">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label htmlFor="orgName">
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        id="orgName"
                                        placeholder="Enter Organization Name"
                                        value={orgName}
                                        onChange={(e) =>
                                            setOrgName(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                    {errors.orgName && (
                                        <p className="error">
                                            {errors.orgName}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="orgType">
                                        Organization Type
                                    </label>
                                    <input
                                        type="text"
                                        id="orgType"
                                        placeholder="e.g. NGO, School, Company"
                                        value={orgType}
                                        onChange={(e) =>
                                            setOrgType(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                    {errors.orgType && (
                                        <p className="error">
                                            {errors.orgType}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="orgLoc">Location</label>
                                    <input
                                        type="text"
                                        id="orgLoc"
                                        placeholder="e.g. 123 Numbers Street"
                                        value={orgLoc}
                                        onChange={(e) =>
                                            setOrgLoc(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                    {errors.orgLoc && (
                                        <p className="error">{errors.orgLoc}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="orgDesc">
                                        Organization Description
                                    </label>
                                    <input
                                        type="text"
                                        id="orgDesc"
                                        placeholder="Responsible for national healthcare infrastructure."
                                        value={orgDesc}
                                        onChange={(e) =>
                                            setOrgDesc(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                    {errors.orgDesc && (
                                        <p className="error">
                                            {errors.orgDesc}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="error">{errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <small className="note">
                                Must be 8+ characters, with at least one
                                uppercase and one number.
                            </small>
                            {errors.password && (
                                <p className="error">{errors.password}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="error">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {submitError && (
                            <p className="error submit-error">{submitError}</p>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>

                        <div id="login-create-account">
                            <p>Already have an account?</p>{" "}
                            <Link to="/login" id="login-signup">
                                Login
                            </Link>{" "}
                            <p>instead</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;
