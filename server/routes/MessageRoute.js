import express from 'express';
import { addMessage, getMessages } from '../controllers/MessageController.js';

const router = express.Router();

router.post('/', addMessage);

router.post('/getMessage/', getMessages);

export default router