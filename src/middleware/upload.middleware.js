import multer from 'multer';

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
});

export default uploadMiddleware;
