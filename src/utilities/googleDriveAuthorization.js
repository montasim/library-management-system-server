import google from '@googleapis/drive';

import configuration from '../configuration/configuration.js';

const googleDriveAuthorization = async () => {
    try {
        // Define the scope of access required by the application.
        const SCOPE = [configuration.googleDrive.scope];
        const private_key = Buffer.from(
            configuration.googleDrive.privateKey,
            'base64'
        ).toString('utf-8');

        // Initialize a JWT client for authentication with Google Drive.
        const jwtClient = new google.auth.JWT(
            configuration.googleDrive.client,
            null,
            private_key,
            SCOPE
        );

        // Authorize the JWT client.
        await jwtClient.authorize();

        // Return the authorized JWT client.
        return jwtClient;
    } catch (error) {
        return error;
    }
};

export default googleDriveAuthorization;
