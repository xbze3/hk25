import LandingNavBar from "../LandingNavBar";
import "../../components-css/page-css/LandingPage.css";
import { Link } from "react-router-dom";
import sg_emblem from "../../assets/sg_emblem.svg";

function LandingPage() {
    return (
        <>
            <LandingNavBar />

            <div id="image-wrapper">
                <div id="landing-header">
                    <div id="header-image-div">
                        <img src={sg_emblem} alt="" id="header-image" />
                    </div>

                    <div id="title-and-search">
                        <div id="header-title-div">
                            <h1 id="header-title">
                                One report can save a life.
                            </h1>
                        </div>

                        <div id="header-search-div">
                            <Link
                                to="/logout-search"
                                id="org-search-button-landing"
                            >
                                Make a Report
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="section-divider">
                    <span className="divider-line"></span>
                    <p className="divider-text">About Us</p>
                    <span className="divider-line"></span>
                </div>

                <div id="about-us-section" className="about-us">
                    <p>
                        SafeGuardGY is a digital safety and compliance platform
                        designed to make reporting health, safety, security, and
                        environmental (HSSE) concerns simple and accessible.
                        Whether you're a concerned citizen or a member of an
                        organization, your voice matters. Our goal is to bridge
                        the gap between the public and institutions by offering
                        real-time reporting, organizational transparency, and
                        data-driven insights, all in one place.
                    </p>
                </div>
            </div>

            <footer>
                <div className="footer">
                    <div className="rowText">
                        <b>Seg Fault</b> || Safeguard GY
                    </div>
                    <div className="rowText">
                        Designed and Developed By: Ezra Minty | Matthias
                        Arrindell | Clarence Luscius
                    </div>
                </div>
            </footer>
        </>
    );
}

export default LandingPage;
