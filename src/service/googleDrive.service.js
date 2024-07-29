import google from '@googleapis/drive';
import { Readable } from 'stream';

import configuration from '../configuration/configuration.js';
import googleDriveConfiguration
    from '../configuration/googleDrive.configuration.js';

const uploadFile = async (file) => {
    try {
        const authorizationClient = await googleDriveConfiguration();
        const drive = google.drive({
            version: 'v3',
            auth: authorizationClient,
        });
        const fileMetaData = {
            name: file?.originalname,
            parents: [configuration.googleDrive.folderKey],
        };
        const fileStream = new Readable();

        fileStream?.push(file.buffer);
        fileStream?.push(null);

        // Upload the file
        const { data: fileData } = await drive.files.create({
            requestBody: fileMetaData,
            media: {
                body: fileStream,
                mimeType: file?.mimetype,
            },
            fields: 'id',
        });

        // Set the file permissions to 'anyone with the link can view'
        await drive.permissions.create({
            fileId: fileData?.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get the shareable link
        const { data: fileInfo } = await drive.files.get({
            fileId: fileData?.id,
            fields: 'webViewLink',
        });

        return {
            fileId: fileData?.id,
            shareableLink: fileInfo?.webViewLink,
            downloadLink: `https://drive.google.com/u/1/uc?id=${fileData?.id}&export=download`,
        };
    } catch (error) {
        return error;
    }
};

const deleteFile = async (fileId) => {
    try {
        const authorizationClient = await googleDriveConfiguration();
        const drive = google.drive({
            version: 'v3',
            auth: authorizationClient,
        });

        return await drive.files.delete({ fileId });
    } catch (error) {
        return error;
    }
};

const GoogleDriveService = {
    uploadFile,
    deleteFile,
};

export default GoogleDriveService;
