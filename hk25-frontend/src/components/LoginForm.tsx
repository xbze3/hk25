import { Link } from "react-router-dom";
import "../components-css/LoginForm.css";
import sgOutline from "../assets/sg-outline-login.svg";

function LoginForm() {
    return (
        <div className="page-wrapper">
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

                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Login
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
