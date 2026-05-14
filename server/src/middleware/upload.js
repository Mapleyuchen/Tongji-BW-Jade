import multer from 'multer';
import { env } from '../config/env.js';
import { badRequest } from '../utils/AppError.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_IMAGE_MB * 1024 * 1024,
    files: env.MAX_IMAGES
  },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(badRequest('仅支持 JPG、PNG、WEBP 格式图片。', 'UNSUPPORTED_IMAGE_TYPE'));
      return;
    }
    cb(null, true);
  }
});

// 正式字段名为 images，兼容旧版 image 和部分前端习惯的 files。
export const uploadImages = upload.fields([
  { name: 'images', maxCount: env.MAX_IMAGES },
  { name: 'image', maxCount: env.MAX_IMAGES },
  { name: 'files', maxCount: env.MAX_IMAGES }
]);

export function requireImages(req, res, next) {
  const imageFiles = [
    ...(req.files?.images || []),
    ...(req.files?.image || []),
    ...(req.files?.files || [])
  ];

  if (imageFiles.length === 0) {
    next(badRequest('请上传玉石图片，字段名为 images，可一次上传多张。', 'IMAGE_REQUIRED'));
    return;
  }

  req.uploadedImages = imageFiles.slice(0, env.MAX_IMAGES);
  next();
}
