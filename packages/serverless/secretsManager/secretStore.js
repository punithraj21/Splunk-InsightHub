import {
    SecretsManagerClient,
    CreateSecretCommand,
    GetSecretValueCommand,
    DescribeSecretCommand,
    PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { fetchCurrentUserRole } from "../splunkApi.js";

// Initializing the AWS Secrets Manager client with the specified region
const secretsManagerClient = new SecretsManagerClient({ region: "ap-south-1" });

// Main handler function for AWS Lambda
const handler = async (event) => {
    const operation = event.operation;

    // Handling different operations based on the event
    switch (operation) {
        case "store":
            return await storeSecret(event);
        case "fetch":
            return await fetchSecret(event);
        default:
            return {
                statusCode: 400,
                body: JSON.stringify("Invalid operation"),
            };
    }
};

// Function to store a secret in AWS Secrets Manager
async function storeSecret(event) {
    const { username, password } = JSON.parse(event.body);
    // Fetching the current user's role
    const roleName = await fetchCurrentUserRole({ username, password });
    let secretName = `${username}/credentials`;

    try {
        // Check if the secret already exists
        try {
            const describeCommand = new DescribeSecretCommand({ SecretId: secretName });
            await secretsManagerClient.send(describeCommand);

            // If secret exists, update it
            const updateCommand = new PutSecretValueCommand({
                SecretId: secretName,
                SecretString: JSON.stringify({ username, password, role: roleName }),
            });
            await secretsManagerClient.send(updateCommand);

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "http://localhost:8000",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify("Secret updated successfully!"),
            };
        } catch (describeError) {
            // If secret does not exist, create a new one
            if (describeError.name === "ResourceNotFoundException") {
                const createCommand = new CreateSecretCommand({
                    Name: secretName,
                    SecretString: JSON.stringify({ username, password, role: roleName }),
                });
                await secretsManagerClient.send(createCommand);

                return {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "http://localhost:8000",
                        "Access-Control-Allow-Credentials": true,
                    },
                    body: JSON.stringify("Secret created successfully!"),
                };
            } else {
                throw describeError;
            }
        }
    } catch (error) {
        // Handling any errors during the secret storing process
        console.error("Error storing secret:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Error storing secret"),
        };
    }
}

// Function to fetch a secret from AWS Secrets Manager
async function fetchSecret(event) {
    const { username } = JSON.parse(event.body);

    let secretName = `${username}/credentials`;

    try {
        // Command to get the secret value
        const command = new GetSecretValueCommand({
            SecretId: secretName,
        });
        const data = await secretsManagerClient.send(command);
        const secret = JSON.parse(data.SecretString);

        return secret;
    } catch (error) {
        console.error("Error fetching secret:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Error fetching secret"),
        };
    }
}

// Exporting the handler and utility functions for external use
export { handler, fetchSecret, storeSecret };
