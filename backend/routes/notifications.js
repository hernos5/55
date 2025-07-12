const express = require('express');
const { body } = require('express-validator');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  createNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createNotificationValidation = [
  body('recipient')
    .isMongoId()
    .withMessage('Valid recipient ID is required'),
  body('message')
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
    .trim(),
  body('type')
    .isIn(['answer', 'comment', 'vote', 'accepted', 'mention', 'system'])
    .withMessage('Invalid notification type'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
];

// Routes
router.get('/unread-count', protect, getUnreadCount);
router.get('/', protect, getNotifications);
router.put('/mark-all-read', protect, markAllAsRead);
router.delete('/read', protect, deleteAllRead);
router.post('/', protect, authorize('admin'), createNotificationValidation, createNotification);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/unread', protect, markAsUnread);
router.delete('/:id', protect, deleteNotification);

module.exports = router;

