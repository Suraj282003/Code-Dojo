// routes/submissions.js

const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

/**
 * POST /api/submissions
 * Submit code for a problem
 * Body: { userId, problemId, language, sourceCode }
 */
router.post('/', submissionController.submitCode);

/**
 * GET /api/submissions/:id
 * Get a single submission by ID with full results
 */
// router.get('/:id', submissionController.submitCode);

/**
 * GET /api/submissions/user/:userId
 * Get all submissions for a user
 * Query: ?problemId=XXX (optional - filter by problem)
 */
// router.get('/user/:userId', submissionController.getUserSubmissions);

module.exports = router;
