import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components-css/LoginForm.css";
import sgOutline from "../assets/sg-outline-login.svg";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!email.trim() || !password) {
            toast.error("Please enter both email and password.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8081/login", {
                email: email.trim(),
                password,
            });

            localStorage.setItem("authToken", response.data.token);

            toast.success("Login successful!");
            setTimeout(() => navigate("/user/dashboard"), 1500);
        } catch (err: any) {
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <ToastContainer />
            <Link to="/" id="back-button">
                ← Back to Home
            </Link>

            <div className="login-container">
                <div id="banner-container">
                    <img
                        src={sgOutline}
                        alt="Case Bank Banner"
                        id="case-bank-banner"
                    />
                </div>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div id="login-create-account">
                        <p>Don't have an account?</p>{" "}
                        <Link to="/signup" id="login-signup">
                            Sign Up
                        </Link>{" "}
                        <p>instead</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
