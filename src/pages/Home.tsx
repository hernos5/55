import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Search, Filter, TrendingUp, Clock, MessageSquare, Eye } from 'lucide-react';
import { questionsAPI } from '../services/api';
import { Question, QuestionFilters } from '../types';
import { formatRelativeTime, formatNumber, cn } from '../utils';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<QuestionFilters>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
    sort: (searchParams.get('sort') as any) || 'newest',
    search: searchParams.get('search') || '',
    tag: searchParams.get('tag') || '',
    status: (searchParams.get('status') as any) || 'open',
  });

  // Fetch questions
  const { data: questionsData, isLoading, error } = useQuery(
    ['questions', filters],
    () => questionsAPI.getQuestions(filters),
    {
      keepPreviousData: true,
    }
  );

  // Fetch popular tags
  const { data: tagsData } = useQuery(
    'popularTags',
    () => questionsAPI.getPopularTags(10)
  );

  const questions = questionsData?.data.data?.questions || [];
  const pagination = questionsData?.data.data?.pagination;
  const popularTags = tagsData?.data.data?.tags || [];

  const updateFilters = (newFilters: Partial<QuestionFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600">Failed to load questions. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600 mt-1">
            {pagination?.totalQuestions ? 
              `${formatNumber(pagination.totalQuestions)} questions` : 
              'Loading questions...'
            }
          </p>
        </div>
        <Link to="/ask" className="btn-primary">
          Ask Question
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="card">
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value as any })}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="votes">Most Voted</option>
                  <option value="activity">Recent Activity</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value as any })}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="all">All Status</option>
              </select>

              {/* Clear Filters */}
              {(filters.search || filters.tag || filters.status !== 'open') && (
                <button
                  onClick={() => {
                    setFilters({ page: 1, limit: 10, sort: 'newest', status: 'open' });
                    setSearchParams({});
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(filters.search || filters.tag) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    <Search className="w-3 h-3 mr-1" />
                    Search: {filters.search}
                  </span>
                )}
                {filters.tag && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Tag: {filters.tag}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="card text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.tag ? 
                    'Try adjusting your search criteria or filters.' :
                    'Be the first to ask a question!'
                  }
                </p>
                <Link to="/ask" className="btn-primary">
                  Ask the First Question
                </Link>
              </div>
            ) : (
              questions.map((question: Question) => (
                <div key={question._id} className="card hover:shadow-md transition-shadow">
                  <div className="flex space-x-4">
                    {/* Vote Count */}
                    <div className="flex flex-col items-center space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className={cn(
                          "font-medium",
                          question.votes > 0 ? "text-green-600" : 
                          question.votes < 0 ? "text-red-600" : "text-gray-500"
                        )}>
                          {question.votes}
                        </span>
                      </div>
                      <span className="text-xs">votes</span>
                    </div>

                    {/* Answer Count */}
                    <div className="flex flex-col items-center space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className={cn(
                          "font-medium",
                          question.acceptedAnswer ? "text-green-600" : "text-gray-500"
                        )}>
                          {question.answerCount}
                        </span>
                      </div>
                      <span className="text-xs">answers</span>
                    </div>

                    {/* View Count */}
                    <div className="flex flex-col items-center space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{formatNumber(question.views)}</span>
                      </div>
                      <span className="text-xs">views</span>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/questions/${question._id}`}
                        className="block group"
                      >
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                          {question.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {question.description.substring(0, 200)}...
                        </p>
                      </Link>

                      {/* Tags */}
                      {question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => updateFilters({ tag })}
                              className="tag hover:bg-primary-200 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>asked {formatRelativeTime(question.createdAt)}</span>
                          </span>
                          {question.acceptedAnswer && (
                            <span className="text-green-600 font-medium">✓ Accepted</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <img
                            src={question.author.avatar || `https://ui-avatars.com/api/?name=${question.author.username}&size=24`}
                            alt={question.author.username}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">{question.author.username}</span>
                          <span className="text-primary-600">{formatNumber(question.author.reputation)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "px-3 py-2 text-sm border rounded-lg",
                      page === pagination.currentPage
                        ? "bg-primary-600 text-white border-primary-600"
                        : "border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
            <div className="space-y-2">
              {popularTags.map((tagData) => (
                <button
                  key={tagData.tag}
                  onClick={() => updateFilters({ tag: tagData.tag })}
                  className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="tag">{tagData.tag}</span>
                  <span className="text-sm text-gray-500">{formatNumber(tagData.count)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions</span>
                <span className="font-medium">{formatNumber(pagination?.totalQuestions || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Popular Tags</span>
                <span className="font-medium">{popularTags.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

