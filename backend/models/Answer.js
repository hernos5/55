const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    minlength: [10, 'Answer must be at least 10 characters long'],
    maxlength: [5000, 'Answer cannot exceed 5000 characters']
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question reference is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Answer author is required']
  },
  votes: {
    type: Number,
    default: 0
  },
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  downvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
answerSchema.index({ question: 1 });
answerSchema.index({ author: 1 });
answerSchema.index({ votes: -1 });
answerSchema.index({ createdAt: -1 });
answerSchema.index({ isAccepted: -1 });

// Update vote count based on upvotes and downvotes
answerSchema.methods.updateVoteCount = function() {
  this.votes = this.upvotes.length - this.downvotes.length;
  return this.save();
};

// Add upvote
answerSchema.methods.addUpvote = function(userId) {
  // Remove any existing downvote
  this.downvotes = this.downvotes.filter(vote => !vote.user.equals(userId));
  
  // Check if user already upvoted
  const existingUpvote = this.upvotes.find(vote => vote.user.equals(userId));
  if (existingUpvote) {
    // Remove upvote if already exists
    this.upvotes = this.upvotes.filter(vote => !vote.user.equals(userId));
  } else {
    // Add upvote
    this.upvotes.push({ user: userId });
  }
  
  return this.updateVoteCount();
};

// Add downvote
answerSchema.methods.addDownvote = function(userId) {
  // Remove any existing upvote
  this.upvotes = this.upvotes.filter(vote => !vote.user.equals(userId));
  
  // Check if user already downvoted
  const existingDownvote = this.downvotes.find(vote => vote.user.equals(userId));
  if (existingDownvote) {
    // Remove downvote if already exists
    this.downvotes = this.downvotes.filter(vote => !vote.user.equals(userId));
  } else {
    // Add downvote
    this.downvotes.push({ user: userId });
  }
  
  return this.updateVoteCount();
};

// Mark as accepted answer
answerSchema.methods.markAsAccepted = function() {
  this.isAccepted = true;
  this.acceptedAt = new Date();
  return this.save();
};

// Unmark as accepted answer
answerSchema.methods.unmarkAsAccepted = function() {
  this.isAccepted = false;
  this.acceptedAt = null;
  return this.save();
};

// Add edit to history
answerSchema.methods.addEdit = function(newContent, editorId) {
  this.editHistory.push({
    content: this.content,
    editedBy: editorId
  });
  this.content = newContent;
  return this.save();
};

module.exports = mongoose.model('Answer', answerSchema);

