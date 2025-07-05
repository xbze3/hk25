import { useState } from "react";
import { Link } from "react-router-dom";
import "../components-css/SignUpForm.css";
import sgOutline from "../assets/sg-outline-signup.svg";

function SignUpForm() {
    const [activeTab, setActiveTab] = useState<"user" | "organization">("user");

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

                    <form className="signup-form">
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
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Enter your Last Name"
                                    />
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
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="orgType">
                                        Organization Type
                                    </label>
                                    <input
                                        type="text"
                                        id="orgType"
                                        placeholder="e.g. NGO, School, Company"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="orgLoc">Location</label>
                                    <input
                                        type="text"
                                        id="orgLoc"
                                        placeholder="e.g. 123 Numbers Street"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="orgDesc">
                                        Organization Description
                                    </label>
                                    <input
                                        type="text"
                                        id="orgDesc"
                                        placeholder="Responsible for national healthcare infrastructure."
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter a strong password"
                            />
                            <small className="note">
                                Must be 8+ characters, with at least one
                                uppercase and one number.
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Re-enter your password"
                            />
                        </div>

                        <button type="submit" className="submit-button">
                            Sign Up
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
