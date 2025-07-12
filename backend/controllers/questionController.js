const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Notification = require('../models/Notification');

// @desc    Get all questions with pagination and filtering
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const {
      sort = 'newest',
      tag,
      search,
      status = 'open',
      author
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (author) {
      filter.author = author;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'votes':
        sortObj = { votes: -1, createdAt: -1 };
        break;
      case 'activity':
        sortObj = { lastActivity: -1 };
        break;
      case 'views':
        sortObj = { views: -1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const questions = await Question.find(filter)
      .populate('author', 'username avatar reputation')
      .populate('acceptedAnswer')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Question.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          currentPage: page,
          totalPages,
          totalQuestions: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions'
    });
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation bio joinDate')
      .populate('acceptedAnswer');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment view count (only if not the author viewing)
    if (!req.user || !req.user._id.equals(question.author._id)) {
      await question.incrementViews();
    }

    // Get answers for this question
    const answers = await Answer.find({ question: question._id })
      .populate('author', 'username avatar reputation')
      .sort({ isAccepted: -1, votes: -1, createdAt: 1 });

    res.json({
      success: true,
      data: {
        question,
        answers
      }
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching question'
    });
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      tags: tags ? tags.map(tag => tag.toLowerCase().trim()) : [],
      author: req.user._id
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question: populatedQuestion
      }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating question'
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Author or Admin)
const updateQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is author or admin
    if (!question.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }

    const { title, description, tags } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(tags && { tags: tags.map(tag => tag.toLowerCase().trim()) }),
        lastActivity: new Date()
      },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: {
        question: updatedQuestion
      }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating question'
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Author or Admin)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is author or admin
    if (!question.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    // Delete associated answers
    await Answer.deleteMany({ question: question._id });

    // Delete the question
    await Question.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Question and associated answers deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting question'
    });
  }
};

// @desc    Vote on question
// @route   POST /api/questions/:id/vote
// @access  Private
const voteQuestion = async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be "up" or "down"'
      });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Users cannot vote on their own questions
    if (question.author.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on your own question'
      });
    }

    // Apply vote
    if (type === 'up') {
      await question.addUpvote(req.user._id);
    } else {
      await question.addDownvote(req.user._id);
    }

    // Create notification for question author (only for upvotes)
    if (type === 'up') {
      await Notification.createNotification({
        recipient: question.author,
        message: `${req.user.username} upvoted your question "${question.title}"`,
        type: 'vote',
        relatedQuestion: question._id,
        relatedUser: req.user._id,
        actionUrl: `/questions/${question._id}`
      });
    }

    const updatedQuestion = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: `Question ${type}voted successfully`,
      data: {
        question: updatedQuestion
      }
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voting on question'
    });
  }
};

// @desc    Get popular tags
// @route   GET /api/questions/tags/popular
// @access  Public
const getPopularTags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      data: {
        tags
      }
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular tags'
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  getPopularTags
};

