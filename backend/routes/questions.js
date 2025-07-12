const express = require('express');
const { body } = require('express-validator');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  getPopularTags
} = require('../controllers/questionController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const questionValidation = [
  body('title')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters')
    .trim(),
  body('description')
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20 and 5000 characters')
    .trim(),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed')
    .custom((tags) => {
      if (tags && tags.some(tag => tag.length > 30)) {
        throw new Error('Each tag must be 30 characters or less');
      }
      return true;
    })
];

const updateQuestionValidation = [
  body('title')
    .optional()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20 and 5000 characters')
    .trim(),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed')
    .custom((tags) => {
      if (tags && tags.some(tag => tag.length > 30)) {
        throw new Error('Each tag must be 30 characters or less');
      }
      return true;
    })
];

const voteValidation = [
  body('type')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be "up" or "down"')
];

// Routes
router.get('/tags/popular', getPopularTags);
router.get('/', optionalAuth, getQuestions);
router.get('/:id', optionalAuth, getQuestion);
router.post('/', protect, questionValidation, createQuestion);
router.put('/:id', protect, updateQuestionValidation, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.post('/:id/vote', protect, voteValidation, voteQuestion);

module.exports = router;

