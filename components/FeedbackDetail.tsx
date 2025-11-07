'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    email: string
    isAdmin?: boolean
  }
  createdAt: string
}

interface FeedbackPost {
  id: string
  title: string
  description: string
  category: string
  status: string
  upvotes: number
  downvotes: number
  author: {
    id: string
    name: string
    email: string
  }
  comments: Comment[]
  votes: any[]
  createdAt: string
}

interface FeedbackDetailProps {
  postId: string
  onClose?: () => void
}

/**
 * FeedbackDetail Component
 * Displays full feedback post details with comments section
 * Allows users and admins to add comments and vote
 */
export default function FeedbackDetail({ postId, onClose }: FeedbackDetailProps) {
  const { user } = useAuth()
  const [post, setPost] = useState<FeedbackPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Fetch post details on mount
  useEffect(() => {
    fetchPostDetails()
  }, [postId])

  /**
   * Fetches detailed feedback post information
   */
  const fetchPostDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/feedback/${postId}`)
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error('Error fetching post details:', error)
      toast.error('Failed to load feedback details')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles comment submission
   */
  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Please log in to comment')
      return
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      setIsSubmittingComment(true)
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorId: user.id,
          content: commentText,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit comment')
      }

      toast.success('Comment added!')
      setCommentText('')
      fetchPostDetails() // Refresh to show new comment
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  /**
   * Get category badge color
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature-request':
        return 'bg-blue-100 text-blue-800'
      case 'bug-report':
        return 'bg-red-100 text-red-800'
      case 'improvement':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  /**
   * Get status badge color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800'
      case 'planned':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  /**
   * Format category and status names
   */
  const formatText = (text: string) => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!post) {
    return <div className="text-center py-8">Feedback not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Post Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getCategoryColor(post.category)}>
            {formatText(post.category)}
          </Badge>
          <Badge className={getStatusColor(post.status)}>
            {formatText(post.status)}
          </Badge>
        </div>
        <p className="text-slate-600 text-sm">
          Posted by <strong>{post.author.name}</strong> on{' '}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Post Description */}
      <Card className="p-6 bg-slate-50">
        <p className="text-slate-700 whitespace-pre-wrap">{post.description}</p>
      </Card>

      {/* Vote Section */}
      <div className="flex gap-4">
        <Button variant="outline" className="gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.upvotes} Upvotes</span>
        </Button>
        <Button variant="outline" className="gap-2">
          <ThumbsDown className="w-4 h-4" />
          <span>{post.downvotes} Downvotes</span>
        </Button>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({post.comments.length})
        </h2>

        {/* Comment Input */}
        <Card className="p-4 mb-6 bg-slate-50">
          <Textarea
            placeholder={user ? (user.isAdmin ? "Add an admin comment..." : "Add a comment...") : "Please log in to comment"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user}
            className="mb-3 min-h-24"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isSubmittingComment || !commentText.trim() || !user}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
          </Button>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {post.comments.length === 0 ? (
            <p className="text-slate-600 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            post.comments.map((comment) => (
              <Card key={comment.id} className={`p-4 ${comment.author.isAdmin ? 'border-l-4 border-l-purple-500 bg-purple-50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {comment.author.name}
                        </p>
                        {comment.author.isAdmin && (
                          <Badge className="bg-purple-600 text-white gap-1 flex items-center">
                            <Shield className="w-3 h-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
