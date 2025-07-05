import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import SG_LOGO from "../assets/sg_logo.svg";

import "../components-css/NavBar.css";
import { Link } from "react-router-dom";

function LandingNavBar() {
    return (
        <Navbar
            expand="lg"
            className="nav-navy"
            data-bs-theme="dark"
            collapseOnSelect
        >
            <Container fluid>
                <Navbar.Brand as={Link} to="/" id="navbar-brand">
                    <img src={SG_LOGO} alt="Safeguard LOGO" id="sg-logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    className="justify-content-end"
                >
                    <Nav className="align-items-center flex-column flex-lg-row">
                        <Nav.Link as={Link} to="/login" id="landing-login">
                            Login
                        </Nav.Link>

                        <Nav.Link as={Link} to="/signup" id="landing-signup">
                            Create an Account
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default LandingNavBar;
