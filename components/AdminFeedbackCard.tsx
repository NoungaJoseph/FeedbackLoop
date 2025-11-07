'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
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

interface AdminFeedbackCardProps {
  post: FeedbackPost
  onStatusChange: () => void
}

/**
 * AdminFeedbackCard Component
 * Displays feedback post in admin view with status management
 * Allows admins to change status of feedback items
 */
export default function AdminFeedbackCard({
  post,
  onStatusChange,
}: AdminFeedbackCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(post.status)

  /**
   * Handle status change
   */
  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/feedback/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update status')
      }

      setCurrentStatus(newStatus)
      toast.success(`Status updated to ${newStatus}`)
      onStatusChange()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update status')
      setCurrentStatus(post.status)
    } finally {
      setIsUpdating(false)
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
   * Format text for display
   */
  const formatText = (text: string) => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Content */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {post.title}
          </h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getCategoryColor(post.category)}>
              {formatText(post.category)}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            by {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 items-center justify-start lg:justify-center">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-slate-600">
              <ThumbsUp className="w-4 h-4" />
              <span className="font-semibold">{post.upvotes}</span>
            </div>
            <p className="text-xs text-slate-500">Upvotes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-slate-600">
              <ThumbsDown className="w-4 h-4" />
              <span className="font-semibold">{post.downvotes}</span>
            </div>
            <p className="text-xs text-slate-500">Downvotes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-slate-600">
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold">{post._count.comments}</span>
            </div>
            <p className="text-xs text-slate-500">Comments</p>
          </div>
        </div>

        {/* Status Selector */}
        <div>
          <p className="text-xs text-slate-600 mb-2 font-semibold">Change Status</p>
          <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className={`${getStatusColor(currentStatus)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
