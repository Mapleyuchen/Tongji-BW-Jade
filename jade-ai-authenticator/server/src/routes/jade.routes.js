import express from 'express';
import { nanoid } from 'nanoid';
import { uploadImages, requireImages } from '../middleware/upload.js';
import { validateIdentifyInput } from '../middleware/validateIdentify.js';
import { buildJadePrompt } from '../services/jadePrompt.js';
import { analyzeJadeImages } from '../services/aiClient.js';
import { normalizeJadeReport } from '../services/reportNormalizer.js';
import { logger } from '../utils/logger.js';

export const jadeRouter = express.Router();

jadeRouter.post(
  '/identify',
  uploadImages,
  requireImages,
  validateIdentifyInput,
  async (req, res, next) => {
    const requestId = nanoid(12);
    try {
      const { materialHint, sceneHint, description } = req.validatedBody;
      const images = req.uploadedImages.map((file, index) => ({
        index: index + 1,
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        dataUrl: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      }));
      const prompt = buildJadePrompt({
        materialHint,
        sceneHint,
        description,
        imageCount: images.length
      });

      logger.info('Jade identify request received', {
        requestId,
        imageCount: images.length,
        mimeTypes: images.map((image) => image.mimeType),
        totalSize: images.reduce((sum, image) => sum + image.size, 0),
        materialHint
      });

      const aiResult = await analyzeJadeImages({ images, prompt, requestId });
      const report = normalizeJadeReport(aiResult.text, {
        ...aiResult.meta,
        imageCount: images.length,
        imageNames: images.map((image) => image.name)
      });

      res.json({
        success: true,
        requestId,
        result: report
      });
    } catch (error) {
      next(error);
    }
  }
);
