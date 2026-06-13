import express from 'express';

const router = express.Router();
import {executeCode,checkLastSubmission} from '../controllers/codeController.js'


// When someone hits POST /api/execute, run the executeCode function
router.post('/execute', executeCode);
router.post('/checkSubmission',checkLastSubmission);

export default router