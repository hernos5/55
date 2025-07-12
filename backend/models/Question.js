const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Question author is required']
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
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  answerCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'duplicate'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Indexes for performance
questionSchema.index({ author: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ votes: -1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ lastActivity: -1 });
questionSchema.index({ title: 'text', description: 'text' });

// Virtual for answer count
questionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question'
});

// Update vote count based on upvotes and downvotes
questionSchema.methods.updateVoteCount = function() {
  this.votes = this.upvotes.length - this.downvotes.length;
  return this.save();
};

// Add upvote
questionSchema.methods.addUpvote = function(userId) {
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
questionSchema.methods.addDownvote = function(userId) {
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

// Increment view count
questionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Question', questionSchema);

