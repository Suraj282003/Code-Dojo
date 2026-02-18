const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

router.get('/', problemController.getAllProblems);
router.get('/:problemId', problemController.getProblemById);
router.post('/', problemController.createProblem); // admin only

module.exports = router;
