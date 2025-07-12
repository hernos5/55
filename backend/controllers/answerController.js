const { validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');

// @desc    Get answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
const getAnswersForQuestion = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'votes'; // votes, newest, oldest

    let sortObj = {};
    switch (sort) {
      case 'votes':
        sortObj = { isAccepted: -1, votes: -1, createdAt: 1 };
        break;
      case 'newest':
        sortObj = { isAccepted: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { isAccepted: -1, createdAt: 1 };
        break;
      default:
        sortObj = { isAccepted: -1, votes: -1, createdAt: 1 };
    }

    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username avatar reputation')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Answer.countDocuments({ question: req.params.questionId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        answers,
        pagination: {
          currentPage: page,
          totalPages,
          totalAnswers: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching answers'
    });
  }
};

// @desc    Get single answer by ID
// @route   GET /api/answers/:id
// @access  Public
const getAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate('author', 'username avatar reputation bio joinDate')
      .populate('question', 'title author');

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    res.json({
      success: true,
      data: {
        answer
      }
    });
  } catch (error) {
    console.error('Get answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching answer'
    });
  }
};

// @desc    Create new answer
// @route   POST /api/answers
// @access  Private
const createAnswer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content, questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if question is open
    if (question.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot answer a closed question'
      });
    }

    const answer = await Answer.create({
      content,
      question: questionId,
      author: req.user._id
    });

    // Update question's answer count and last activity
    await Question.findByIdAndUpdate(questionId, {
      $inc: { answerCount: 1 },
      lastActivity: new Date()
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation');

    // Create notification for question author
    if (!question.author.equals(req.user._id)) {
      await Notification.createNotification({
        recipient: question.author,
        message: `${req.user.username} answered your question "${question.title}"`,
        type: 'answer',
        relatedQuestion: question._id,
        relatedAnswer: answer._id,
        relatedUser: req.user._id,
        actionUrl: `/questions/${question._id}#answer-${answer._id}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Answer created successfully',
      data: {
        answer: populatedAnswer
      }
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating answer'
    });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private (Author or Admin)
const updateAnswer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is author or admin
    if (!answer.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this answer'
      });
    }

    const { content } = req.body;

    // Add to edit history if content is being changed
    if (content && content !== answer.content) {
      await answer.addEdit(content, req.user._id);
    }

    const updatedAnswer = await Answer.findById(req.params.id)
      .populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: 'Answer updated successfully',
      data: {
        answer: updatedAnswer
      }
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating answer'
    });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private (Author or Admin)
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is author or admin
    if (!answer.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this answer'
      });
    }

    // Update question's answer count
    await Question.findByIdAndUpdate(answer.question, {
      $inc: { answerCount: -1 },
      ...(answer.isAccepted && { acceptedAnswer: null })
    });

    await Answer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting answer'
    });
  }
};

// @desc    Vote on answer
// @route   POST /api/answers/:id/vote
// @access  Private
const voteAnswer = async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be "up" or "down"'
      });
    }

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Users cannot vote on their own answers
    if (answer.author.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on your own answer'
      });
    }

    // Apply vote
    if (type === 'up') {
      await answer.addUpvote(req.user._id);
    } else {
      await answer.addDownvote(req.user._id);
    }

    // Create notification for answer author (only for upvotes)
    if (type === 'up') {
      await Notification.createNotification({
        recipient: answer.author,
        message: `${req.user.username} upvoted your answer`,
        type: 'vote',
        relatedAnswer: answer._id,
        relatedUser: req.user._id,
        actionUrl: `/questions/${answer.question}#answer-${answer._id}`
      });
    }

    const updatedAnswer = await Answer.findById(req.params.id)
      .populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: `Answer ${type}voted successfully`,
      data: {
        answer: updatedAnswer
      }
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voting on answer'
    });
  }
};

// @desc    Accept answer
// @route   POST /api/answers/:id/accept
// @access  Private (Question Author only)
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate('question');

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    const question = answer.question;

    // Only question author can accept answers
    if (!question.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the question author can accept answers'
      });
    }

    // Unmark previous accepted answer if exists
    if (question.acceptedAnswer) {
      const previousAccepted = await Answer.findById(question.acceptedAnswer);
      if (previousAccepted) {
        await previousAccepted.unmarkAsAccepted();
      }
    }

    // Mark this answer as accepted
    await answer.markAsAccepted();

    // Update question with accepted answer
    await Question.findByIdAndUpdate(question._id, {
      acceptedAnswer: answer._id
    });

    // Create notification for answer author
    if (!answer.author.equals(req.user._id)) {
      await Notification.createNotification({
        recipient: answer.author,
        message: `Your answer was accepted for "${question.title}"`,
        type: 'accepted',
        relatedQuestion: question._id,
        relatedAnswer: answer._id,
        relatedUser: req.user._id,
        actionUrl: `/questions/${question._id}#answer-${answer._id}`,
        priority: 'high'
      });
    }

    const updatedAnswer = await Answer.findById(req.params.id)
      .populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: 'Answer accepted successfully',
      data: {
        answer: updatedAnswer
      }
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting answer'
    });
  }
};

// @desc    Unaccept answer
// @route   DELETE /api/answers/:id/accept
// @access  Private (Question Author only)
const unacceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate('question');

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    const question = answer.question;

    // Only question author can unaccept answers
    if (!question.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the question author can unaccept answers'
      });
    }

    // Unmark as accepted
    await answer.unmarkAsAccepted();

    // Update question
    await Question.findByIdAndUpdate(question._id, {
      acceptedAnswer: null
    });

    const updatedAnswer = await Answer.findById(req.params.id)
      .populate('author', 'username avatar reputation');

    res.json({
      success: true,
      message: 'Answer unaccepted successfully',
      data: {
        answer: updatedAnswer
      }
    });
  } catch (error) {
    console.error('Unaccept answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unaccepting answer'
    });
  }
};

module.exports = {
  getAnswersForQuestion,
  getAnswer,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
  unacceptAnswer
};

