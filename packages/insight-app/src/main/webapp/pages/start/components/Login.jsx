import React, { useState } from "react";
import PropTypes from "prop-types";
// Importing UI components from Splunk's UI library
import Text from "@splunk/react-ui/Text";
import Button from "@splunk/react-ui/Button";
import Heading from "@splunk/react-ui/Heading";

import { StyledInput } from "../StartStyles";

// Importing the server URL from the configuration file
import { SERVER_URL } from "../../../../../../config";

// LoginPage component definition
const LoginPage = ({ setIsLoggedIn }) => {
    // State hooks for managing username, password, and error message
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Function to handle login when the button is clicked
    const handleLogin = async () => {
        if (username && password) {
            // Making a POST request to the login endpoint with username and password
            await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
            // Storing user credentials in localStorage
            localStorage.setItem("user", username);
            localStorage.setItem("pass", password);
            // Updating login state and redirecting to dashboard
            setIsLoggedIn(true);
            history.push("/dashboard");
        } else {
            // Setting an error message if credentials are not provided
            setError("Invalid credentials");
        }
    };

    return (
        <>
            <Heading level={1} style={{ textAlign: "center" }}>
                Login
            </Heading>
            <div style={{ justifyContent: "center", display: "flex", width: "100%" }}>
                <div style={{ display: "flex" }}>
                    <StyledInput>
                        <Text value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                    </StyledInput>
                    <StyledInput>
                        <Text type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                    </StyledInput>

                    {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}
                    <div style={{ width: "100px", display: "flex", alignItems: "center" }}>
                        <Button appearance="primary" onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

// PropType validation for the setIsLoggedIn prop
const propTypes = {
    setIsLoggedIn: PropTypes.func.isRequired,
};

LoginPage.propTypes = propTypes;

// Exporting the LoginPage component
export default LoginPage;
