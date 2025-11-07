'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import FeedbackDetail from '@/components/FeedbackDetail'
import { toast } from 'sonner'

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
  _count: {
    votes: number
    comments: number
  }
  createdAt: string
}

interface FeedbackCardProps {
  post: FeedbackPost
  onVoteChange?: () => void
}

/**
 * FeedbackCard Component
 * Displays a single feedback post in the board
 * Shows title, category, status, vote counts, and comment count
 * Allows users to view details and vote
 */
export default function FeedbackCard({ post, onVoteChange }: FeedbackCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  /**
   * Handles upvote/downvote action
   * Sends vote to API and updates UI
   */
  const handleVote = async (type: 'upvote' | 'downvote') => {
    try {
      setIsVoting(true)
      // In a real app, we'd get the actual user ID from auth
      const userId = localStorage.getItem('userId') || 'anonymous-' + Math.random()
      localStorage.setItem('userId', userId)

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          userId,
          type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      toast.success(`${type === 'upvote' ? 'Upvoted' : 'Downvoted'}!`)
      onVoteChange?.()
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  /**
   * Get category badge color based on category type
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
   * Get status badge color based on status
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
   * Format category name for display
   */
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Format status name for display
   */
  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Vote Section */}
        <div className="flex sm:flex-col gap-2 sm:gap-1 items-center sm:items-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('upvote')}
            disabled={isVoting}
            className="gap-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{post.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('downvote')}
            disabled={isVoting}
            className="gap-1 text-slate-600 hover:text-red-600 hover:bg-red-50"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm font-semibold">{post.downvotes}</span>
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <FeedbackDetail postId={post.id} onClose={() => setIsDetailOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={getCategoryColor(post.category)}>
              {formatCategory(post.category)}
            </Badge>
            <Badge className={getStatusColor(post.status)}>
              {formatStatus(post.status)}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            <span>by {post.author.name}</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{post._count.comments} comments</span>
            </div>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
