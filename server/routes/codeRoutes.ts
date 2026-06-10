import express from 'express';

const router = express.Router();
import executeCode from '../controllers/codeController.js'

// When someone hits POST /api/execute, run the executeCode function
router.post('/execute', executeCode);

export default router