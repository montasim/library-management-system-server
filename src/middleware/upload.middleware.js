import multer from 'multer';

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 1.1 * 1024 * 1024,
    },
});

export default uploadMiddleware;
