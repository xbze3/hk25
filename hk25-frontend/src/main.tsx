import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

import LandingPage from "./components/page/LandingPage.tsx";
import LogoutOrgSearchPage from "./components/page/LogoutOrgSearch.tsx";
import SignUpForm from "./components/SignUpForm.tsx";
import LoginForm from "./components/LoginForm.tsx";
import UserDashboard from "./components/page/Users/UserDashboard.tsx";
import UserMyReports from "./components/page/Users/UserMyReports.tsx";
import MyOrganizations from "./components/page/Users/MyOrganizations.tsx";
import OrgDashboard from "./components/page/Organization/OrgDashboard.tsx";

// import App from "./App.tsx";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/signup",
        element: <SignUpForm />,
    },
    {
        path: "/login",
        element: <LoginForm />,
    },
    {
        path: "/logout-search",
        element: <LogoutOrgSearchPage />,
    },
    {
        path: "/user/dashboard",
        element: <UserDashboard />,
    },
    {
        path: "/user/reports",
        element: <UserMyReports />,
    },
    {
        path: "/user/my-organizations",
        element: <MyOrganizations />,
    },
    {
        path: "/org/dashboard",
        element: <OrgDashboard />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
