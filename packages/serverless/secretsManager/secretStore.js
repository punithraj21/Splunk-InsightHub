import {
    SecretsManagerClient,
    CreateSecretCommand,
    GetSecretValueCommand,
    DescribeSecretCommand,
    PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { fetchCurrentUserRole } from "../splunkApi.js";

const secretsManagerClient = new SecretsManagerClient({ region: "ap-south-1" });

const handler = async (event) => {
    const operation = event.operation;

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

async function storeSecret(event) {
    const { username, password } = JSON.parse(event.body);
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
                body: JSON.stringify("Secret updated successfully!"),
            };
        } catch (describeError) {
            if (describeError.name === "ResourceNotFoundException") {
                const createCommand = new CreateSecretCommand({
                    Name: secretName,
                    SecretString: JSON.stringify({ username, password, role: roleName }),
                });
                await secretsManagerClient.send(createCommand);

                return {
                    statusCode: 200,
                    body: JSON.stringify("Secret created successfully!"),
                };
            } else {
                throw describeError;
            }
        }
    } catch (error) {
        console.error("Error storing secret:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Error storing secret"),
        };
    }
}

async function fetchSecret(event) {
    const { username } = JSON.parse(event.body);

    let secretName = `${username}/credentials`;

    try {
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

export { handler, fetchSecret, storeSecret };
