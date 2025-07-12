const express = require('express');
const { body } = require('express-validator');
const {
  getAnswersForQuestion,
  getAnswer,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
  unacceptAnswer
} = require('../controllers/answerController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const answerValidation = [
  body('content')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Answer content must be between 10 and 5000 characters')
    .trim(),
  body('questionId')
    .isMongoId()
    .withMessage('Valid question ID is required')
];

const updateAnswerValidation = [
  body('content')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Answer content must be between 10 and 5000 characters')
    .trim()
];

const voteValidation = [
  body('type')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be "up" or "down"')
];

// Routes
router.get('/question/:questionId', optionalAuth, getAnswersForQuestion);
router.get('/:id', optionalAuth, getAnswer);
router.post('/', protect, answerValidation, createAnswer);
router.put('/:id', protect, updateAnswerValidation, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.post('/:id/vote', protect, voteValidation, voteAnswer);
router.post('/:id/accept', protect, acceptAnswer);
router.delete('/:id/accept', protect, unacceptAnswer);

module.exports = router;

