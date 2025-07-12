const Notification = require('../models/Notification');

// Helper function to create different types of notifications
const createNotificationHelper = async (type, data) => {
  try {
    const notificationData = {
      recipient: data.recipient,
      type,
      relatedUser: data.relatedUser,
      priority: data.priority || 'medium'
    };

    switch (type) {
      case 'answer':
        notificationData.message = `${data.username} answered your question "${data.questionTitle}"`;
        notificationData.relatedQuestion = data.questionId;
        notificationData.relatedAnswer = data.answerId;
        notificationData.actionUrl = `/questions/${data.questionId}#answer-${data.answerId}`;
        break;

      case 'vote':
        if (data.voteType === 'up') {
          notificationData.message = data.targetType === 'question' 
            ? `${data.username} upvoted your question "${data.questionTitle}"`
            : `${data.username} upvoted your answer`;
        } else {
          // Don't create notifications for downvotes to avoid negativity
          return null;
        }
        
        if (data.targetType === 'question') {
          notificationData.relatedQuestion = data.questionId;
          notificationData.actionUrl = `/questions/${data.questionId}`;
        } else {
          notificationData.relatedAnswer = data.answerId;
          notificationData.relatedQuestion = data.questionId;
          notificationData.actionUrl = `/questions/${data.questionId}#answer-${data.answerId}`;
        }
        break;

      case 'accepted':
        notificationData.message = `Your answer was accepted for "${data.questionTitle}"`;
        notificationData.relatedQuestion = data.questionId;
        notificationData.relatedAnswer = data.answerId;
        notificationData.actionUrl = `/questions/${data.questionId}#answer-${data.answerId}`;
        notificationData.priority = 'high';
        break;

      case 'mention':
        notificationData.message = `${data.username} mentioned you in ${data.context}`;
        notificationData.actionUrl = data.actionUrl;
        break;

      case 'system':
        notificationData.message = data.message;
        notificationData.actionUrl = data.actionUrl;
        notificationData.priority = data.priority || 'medium';
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    return await Notification.createNotification(notificationData);
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Specific notification creators
const notifyNewAnswer = async (questionAuthor, answerer, question, answer) => {
  if (questionAuthor.equals(answerer._id)) return null; // Don't notify self
  
  return await createNotificationHelper('answer', {
    recipient: questionAuthor,
    relatedUser: answerer._id,
    username: answerer.username,
    questionTitle: question.title,
    questionId: question._id,
    answerId: answer._id
  });
};

const notifyVote = async (targetAuthor, voter, target, targetType, voteType) => {
  if (targetAuthor.equals(voter._id)) return null; // Don't notify self
  if (voteType !== 'up') return null; // Only notify for upvotes
  
  const data = {
    recipient: targetAuthor,
    relatedUser: voter._id,
    username: voter.username,
    voteType,
    targetType
  };

  if (targetType === 'question') {
    data.questionTitle = target.title;
    data.questionId = target._id;
  } else {
    data.answerId = target._id;
    data.questionId = target.question;
  }

  return await createNotificationHelper('vote', data);
};

const notifyAcceptedAnswer = async (answerAuthor, questionAuthor, question, answer) => {
  if (answerAuthor.equals(questionAuthor._id)) return null; // Don't notify self
  
  return await createNotificationHelper('accepted', {
    recipient: answerAuthor,
    relatedUser: questionAuthor._id,
    username: questionAuthor.username,
    questionTitle: question.title,
    questionId: question._id,
    answerId: answer._id
  });
};

const notifyMention = async (mentionedUser, mentioner, context, actionUrl) => {
  if (mentionedUser.equals(mentioner._id)) return null; // Don't notify self
  
  return await createNotificationHelper('mention', {
    recipient: mentionedUser,
    relatedUser: mentioner._id,
    username: mentioner.username,
    context,
    actionUrl
  });
};

const notifySystem = async (recipient, message, actionUrl, priority = 'medium') => {
  return await createNotificationHelper('system', {
    recipient,
    message,
    actionUrl,
    priority
  });
};

// Batch notification for multiple users
const notifyMultipleUsers = async (recipients, type, data) => {
  const notifications = [];
  
  for (const recipient of recipients) {
    const notification = await createNotificationHelper(type, {
      ...data,
      recipient
    });
    
    if (notification) {
      notifications.push(notification);
    }
  }
  
  return notifications;
};

// Clean up old notifications (can be run as a cron job)
const cleanupOldNotifications = async (daysOld = 30) => {
  try {
    const result = await Notification.cleanupOldNotifications(daysOld);
    console.log(`Cleaned up ${result.deletedCount} old notifications`);
    return result;
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    return null;
  }
};

module.exports = {
  createNotificationHelper,
  notifyNewAnswer,
  notifyVote,
  notifyAcceptedAnswer,
  notifyMention,
  notifySystem,
  notifyMultipleUsers,
  cleanupOldNotifications
};

