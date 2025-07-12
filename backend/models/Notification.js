const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification recipient is required']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['answer', 'comment', 'vote', 'accepted', 'mention', 'system'],
    required: true
  },
  relatedQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  relatedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionUrl: {
    type: String,
    maxlength: [200, 'Action URL cannot exceed 200 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });

// Mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Mark notification as unread
notificationSchema.methods.markAsUnread = function() {
  this.read = false;
  this.readAt = null;
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  return await notification.save();
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsReadForUser = async function(userId) {
  return await this.updateMany(
    { recipient: userId, read: false },
    { 
      read: true, 
      readAt: new Date() 
    }
  );
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCountForUser = async function(userId) {
  return await this.countDocuments({ recipient: userId, read: false });
};

// Static method to delete old read notifications
notificationSchema.statics.cleanupOldNotifications = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return await this.deleteMany({
    read: true,
    readAt: { $lt: cutoffDate }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);

